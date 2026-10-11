import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { validateRegister } from "@/lib/validation";

// POST /api/register — реєстрація нового користувача
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    // Email зберігаємо в нижньому регістрі, інакше «A@x.com» і «a@x.com» стануть різними акаунтами
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    const validation = validateRegister({ name, email, password });
    if (!validation.valid) {
      return Response.json({ error: validation.error }, { status: 400 });
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
        name,
        email,
        password: hashedPassword,
      },
    });

    return Response.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register API error:", error);
    return Response.json(
      { 
        error: error instanceof Error ? error.message : "Не вдалося зареєструвати користувача" 
      },
      { status: 500 }
    );
  }
}
