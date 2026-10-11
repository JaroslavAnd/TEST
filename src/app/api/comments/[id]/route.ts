import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { isAdminUser } from "@/lib/admin";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Необхідна авторизація" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const commentId = parseInt(id, 10);
    
    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: "Некоректний ID коментаря" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Коментар не знайдено" },
        { status: 404 }
      );
    }

    // Видаляти може автор коментаря або адміністратор (модерація)
    if (comment.authorId !== session.user.id && !(await isAdminUser(session.user.id))) {
      return NextResponse.json(
        { error: "Немає прав для видалення цього коментаря" },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Помилка при видаленні коментаря" },
      { status: 500 }
    );
  }
}
