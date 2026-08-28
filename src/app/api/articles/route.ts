import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/articles — список усіх статей
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(articles);
  } catch {
    return Response.json(
      { error: "Не вдалося отримати статті" },
      { status: 500 }
    );
  }
}

// POST /api/articles — створення нової статті
export async function POST(request: NextRequest) {
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
