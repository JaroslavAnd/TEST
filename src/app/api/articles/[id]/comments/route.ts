import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleId = parseInt(id, 10);
    
    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: "Некоректний ID статті" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { articleId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Помилка при завантаженні коментарів" },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const articleId = parseInt(id, 10);
    
    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: "Некоректний ID статті" },
        { status: 400 }
      );
    }
    
    const body = await req.json();
    const { content } = body;
    
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Коментар не може бути порожнім" },
        { status: 400 }
      );
    }
    
    if (content.length > 1000) {
      return NextResponse.json(
        { error: "Коментар занадто довгий (максимум 1000 символів)" },
        { status: 400 }
      );
    }
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true },
    });
    if (!article) {
      return NextResponse.json({ error: "Статтю не знайдено" }, { status: 404 });
    } 
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        articleId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Помилка при створенні коментаря" },
      { status: 500 }
    );
  }
}
