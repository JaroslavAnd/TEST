import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { role } = body;

    if (!role || (role !== "USER" && role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Некоректна роль. Дозволені значення: USER, ADMIN" },
        { status: 400 }
      );
    }

    if (id === adminCheck.session?.user?.id && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Неможливо змінити власну роль адміністратора" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: "Роль успішно оновлено",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Не вдалося оновити роль користувача" },
      { status: 500 }
    );
  }
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

  if (id === adminCheck.session?.user?.id) {
    return NextResponse.json(
      { error: "Неможливо видалити власний акаунт" },
      { status: 400 }
    );
  }

  try {
    // Delete user comments and articles if cascade is not set on Article model
    await prisma.$transaction([
      prisma.comment.deleteMany({ where: { authorId: id } }),
      prisma.article.deleteMany({ where: { authorId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);

    return NextResponse.json({
      message: "Користувача успішно видалено",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Не вдалося видалити користувача" },
      { status: 500 }
    );
  }
}
