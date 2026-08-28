import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/articles/[id] — отримати статтю за ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return Response.json({ error: "Невалідний ID" }, { status: 400 });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return Response.json({ error: "Статтю не знайдено" }, { status: 404 });
    }

    return Response.json(article);
  } catch {
    return Response.json(
      { error: "Не вдалося отримати статтю" },
      { status: 500 }
    );
  }
}

// PATCH /api/articles/[id] — оновити статтю
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return Response.json({ error: "Невалідний ID" }, { status: 400 });
    }

    const existing = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existing) {
      return Response.json({ error: "Статтю не знайдено" }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, excerpt, category } = body;

    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        ...(title !== undefined && { title: String(title) }),
        ...(content !== undefined && { content: String(content) }),
        ...(excerpt !== undefined && { excerpt: String(excerpt) }),
        ...(category !== undefined && { category: String(category) }),
      },
    });

    return Response.json(article);
  } catch {
    return Response.json(
      { error: "Не вдалося оновити статтю" },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[id] — видалити статтю
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return Response.json({ error: "Невалідний ID" }, { status: 400 });
    }

    const existing = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existing) {
      return Response.json({ error: "Статтю не знайдено" }, { status: 404 });
    }

    await prisma.article.delete({ where: { id: articleId } });

    return Response.json({ message: "Статтю видалено" });
  } catch {
    return Response.json(
      { error: "Не вдалося видалити статтю" },
      { status: 500 }
    );
  }
}
