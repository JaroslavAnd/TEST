import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const [usersCount, articlesCount, commentsCount, recentUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.article.count(),
        prisma.comment.count(),
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            createdAt: true,
          },
        }),
      ]);

    return NextResponse.json({
      counts: {
        users: usersCount,
        articles: articlesCount,
        comments: commentsCount,
      },
      recentUsers,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Не вдалося отримати статистику" },
      { status: 500 }
    );
  }
}
