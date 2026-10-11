import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  const { id } = await params;
  const articleId = parseInt(id, 10);

  if (isNaN(articleId)) {
    return NextResponse.json(
      { error: "Некоректний ID статті" },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Статтю не знайдено" },
        { status: 404 }
      );
    }

    await prisma.article.delete({
      where: { id: articleId },
    });

    return NextResponse.json({
      message: "Статтю успішно видалено",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Не вдалося видалити статтю" },
      { status: 500 }
    );
  }
}
