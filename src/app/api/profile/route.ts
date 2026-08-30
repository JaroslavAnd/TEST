import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/profile — отримати профіль поточного користувача
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      age: true,
      bio: true,
      password: false,
      createdAt: true,
    },
  });

  if (!user) {
    return Response.json({ error: "Користувача не знайдено" }, { status: 404 });
  }

  // Перевіряємо чи є локальний пароль (для UI: показувати форму зміни пароля чи ні)
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  return Response.json({
    ...user,
    hasPassword: !!dbUser?.password,
  });
}

// PATCH /api/profile — оновити профіль (name, age, bio)
export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Не авторизовано" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, age, bio } = body;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name: String(name) }),
        ...(age !== undefined && { age: age === null ? null : Number(age) }),
        ...(bio !== undefined && { bio: bio === null ? null : String(bio) }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        age: true,
        bio: true,
        createdAt: true,
      },
    });

    return Response.json(user);
  } catch {
    return Response.json(
      { error: "Не вдалося оновити профіль" },
      { status: 500 }
    );
  }
}
