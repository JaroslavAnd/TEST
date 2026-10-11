import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/articles/[id] — отримати статтю за ID (публічний)
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
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
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

// PATCH /api/articles/[id] — оновити статтю (тільки автор)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Не авторизовано" }, { status: 401 });
  }

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

    // Перевірка власності: тільки автор може редагувати
    if (existing.authorId && existing.authorId !== session.user.id) {
      return Response.json(
        { error: "Ви не маєте права редагувати цю статтю" },
        { status: 403 }
      );
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
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
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

// DELETE /api/articles/[id] — видалити статтю (тільки автор)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Не авторизовано" }, { status: 401 });
  }

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

    // Перевірка власності: тільки автор може видаляти
    if (existing.authorId && existing.authorId !== session.user.id) {
      return Response.json(
        { error: "Ви не маєте права видаляти цю статтю" },
        { status: 403 }
      );
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
