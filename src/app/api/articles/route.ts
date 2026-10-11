import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { parsePagination } from "@/lib/pagination";
import { isValidCategory, validateArticle } from "@/lib/validation";
import type { Prisma } from "@/generated/prisma/client";

// GET /api/articles — список статей з пагінацією, пошуком і фільтром (публічний)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams, { defaultLimit: 9, maxLimit: 50 });
    const search = (searchParams.get("search") || "").trim().slice(0, 100);
    const category = searchParams.get("category") || "";

    const where: Prisma.ArticleWhereInput = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return Response.json({
      data: articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/articles failed:", error);
    return Response.json(
      { error: "Не вдалося отримати статті" },
      { status: 500 }
    );
  }
}

// POST /api/articles — створення нової статті (тільки авторизований)
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Не авторизовано" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const category = typeof body.category === "string" ? body.category : "";
    const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";

    // Валідація (раніше перевірялась лише наявність полів)
    const validation = validateArticle({ title, content, category, excerpt });
    if (!validation.valid) {
      return Response.json({ error: validation.error }, { status: 400 });
    }
    if (!isValidCategory(category)) {
      return Response.json({ error: "Невідома категорія" }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        excerpt: excerpt || content.slice(0, 200),
        category,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return Response.json(article, { status: 201 });
  } catch (error) {
    console.error("POST /api/articles failed:", error);
    return Response.json(
      { error: "Не вдалося створити статтю" },
      { status: 500 }
    );
  }
}
