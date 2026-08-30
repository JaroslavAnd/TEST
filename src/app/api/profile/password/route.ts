import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// PATCH /api/profile/password — змінити пароль
export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Не авторизовано" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!newPassword || !confirmPassword) {
      return Response.json(
        { error: "Новий пароль та підтвердження є обов'язковими" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return Response.json(
        { error: "Новий пароль має бути не менше 6 символів" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return Response.json(
        { error: "Новий пароль і підтвердження не збігаються" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user) {
      return Response.json({ error: "Користувача не знайдено" }, { status: 404 });
    }

    // OAuth-користувач без локального пароля
    if (!user.password) {
      return Response.json(
        { error: "Ви увійшли через OAuth-провайдер. Локальний пароль не встановлено." },
        { status: 400 }
      );
    }

    // Перевірка поточного пароля
    if (!currentPassword) {
      return Response.json(
        { error: "Введіть поточний пароль" },
        { status: 400 }
      );
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordsMatch) {
      return Response.json(
        { error: "Поточний пароль невірний" },
        { status: 400 }
      );
    }

    // Хешування та збереження нового пароля
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return Response.json({ message: "Пароль успішно змінено" });
  } catch {
    return Response.json(
      { error: "Не вдалося змінити пароль" },
      { status: 500 }
    );
  }
}
