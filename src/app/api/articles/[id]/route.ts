import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { isAdminUser } from "@/lib/admin";
import { parseArticleId, isValidCategory, validateArticle } from "@/lib/validation";

const authorSelect = { id: true, name: true, image: true } as const;

type RouteContext = { params: Promise<{ id: string }> };

// Редагувати/видаляти може автор або адміністратор.
// Статті без автора (залишок старих даних) — лише адміністратор.
async function canModify(userId: string, authorId: string | null) {
  if (authorId && authorId === userId) return true;
  return isAdminUser(userId);
}

// GET /api/articles/[id] — отримати статтю за ID (публічний)
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const articleId = parseArticleId((await params).id);
    if (articleId === null) {
      return Response.json({ error: "Невалідний ID" }, { status: 400 });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { author: { select: authorSelect } },
    });

    if (!article) {
      return Response.json({ error: "Статтю не знайдено" }, { status: 404 });
    }

    return Response.json(article);
  } catch (error) {
    console.error("GET /api/articles/[id] failed:", error);
    return Response.json({ error: "Не вдалося отримати статтю" }, { status: 500 });
  }
}

// PATCH /api/articles/[id] — оновити статтю (автор або адміністратор)
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Не авторизовано" }, { status: 401 });
  }

  try {
    const articleId = parseArticleId((await params).id);
    if (articleId === null) {
      return Response.json({ error: "Невалідний ID" }, { status: 400 });
    }

    const existing = await prisma.article.findUnique({ where: { id: articleId } });
    if (!existing) {
      return Response.json({ error: "Статтю не знайдено" }, { status: 404 });
    }

    if (!(await canModify(session.user.id, existing.authorId))) {
      return Response.json({ error: "Ви не маєте права редагувати цю статтю" }, { status: 403 });
    }

    const body = await request.json();

    // Складаємо результат як «існуюче + зміни» і валідуємо його повністю
    const merged = {
      title: typeof body.title === "string" ? body.title.trim() : existing.title,
      content: typeof body.content === "string" ? body.content.trim() : existing.content,
      excerpt: typeof body.excerpt === "string" ? body.excerpt.trim() : existing.excerpt,
      category: typeof body.category === "string" ? body.category : existing.category,
    };

    const validation = validateArticle(merged);
    if (!validation.valid) {
      return Response.json({ error: validation.error }, { status: 400 });
    }
    if (merged.category !== existing.category && !isValidCategory(merged.category)) {
      return Response.json({ error: "Невідома категорія" }, { status: 400 });
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: merged,
      include: { author: { select: authorSelect } },
    });

    return Response.json(article);
  } catch (error) {
    console.error("PATCH /api/articles/[id] failed:", error);
    return Response.json({ error: "Не вдалося оновити статтю" }, { status: 500 });
  }
}

// DELETE /api/articles/[id] — видалити статтю (автор або адміністратор)
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Не авторизовано" }, { status: 401 });
  }

  try {
    const articleId = parseArticleId((await params).id);
    if (articleId === null) {
      return Response.json({ error: "Невалідний ID" }, { status: 400 });
    }

    const existing = await prisma.article.findUnique({ where: { id: articleId } });
    if (!existing) {
      return Response.json({ error: "Статтю не знайдено" }, { status: 404 });
    }

    if (!(await canModify(session.user.id, existing.authorId))) {
      return Response.json({ error: "Ви не маєте права видаляти цю статтю" }, { status: 403 });
    }

    await prisma.article.delete({ where: { id: articleId } });

    return Response.json({ message: "Статтю видалено" });
  } catch (error) {
    console.error("DELETE /api/articles/[id] failed:", error);
    return Response.json({ error: "Не вдалося видалити статтю" }, { status: 500 });
  }
}
