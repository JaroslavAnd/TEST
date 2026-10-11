import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Не авторизовано", status: 401, session: null };
  }
  // Check role from database to prevent token manipulation
  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if ((user as { role?: string } | null)?.role !== "ADMIN") {
    return { error: "Доступ заборонено", status: 403, session: null };
  }
  return { error: null, status: 200, session };
}
