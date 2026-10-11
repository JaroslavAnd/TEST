import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST /api/register — реєстрація нового користувача
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json(
        { error: "Поля name, email та password є обов'язковими" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: "Пароль має бути не менше 6 символів" },
        { status: 400 }
      );
    }

    // Перевірка чи email вже зайнятий
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { error: "Користувач з таким email вже існує" },
        { status: 409 }
      );
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: String(name),
        email: String(email),
        password: hashedPassword,
      },
    });

    return Response.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { error: "Не вдалося зареєструвати користувача" },
      { status: 500 }
    );
  }
}
