import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/articles — список усіх статей (публічний)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "9"));
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const where: any = {};
    
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
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return Response.json({
      data: articles,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      }
    });
  } catch {
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
    const { title, content, excerpt, category } = body;

    // Валідація обов'язкових полів
    if (!title || !content || !category) {
      return Response.json(
        { error: "Поля title, content та category є обов'язковими" },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title: String(title),
        content: String(content),
        excerpt: excerpt ? String(excerpt) : String(content).slice(0, 200),
        category: String(category),
        authorId: session.user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return Response.json(article, { status: 201 });
  } catch {
    return Response.json(
      { error: "Не вдалося створити статтю" },
      { status: 500 }
    );
  }
}
