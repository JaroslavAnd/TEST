import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Роль перевіряємо в БД, а не в JWT: токен може бути застарілим
export async function isAdminUser(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "ADMIN";
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Не авторизовано", status: 401, session: null };
  }
  if (!(await isAdminUser(session.user.id))) {
    return { error: "Доступ заборонено", status: 403, session: null };
  }
  return { error: null, status: 200, session };
}
