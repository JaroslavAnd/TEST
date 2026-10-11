"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import useSWR from "swr";
import {
  PeopleAltOutlined,
  ArticleOutlined,
  CommentOutlined,
  ArrowForwardOutlined,
  ShieldOutlined,
} from "@mui/icons-material";

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Помилка завантаження даних");
    }
    return res.json();
  });

interface AdminStats {
  counts: {
    users: number;
    articles: number;
    comments: number;
  };
  recentUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    role: "USER" | "ADMIN";
    image: string | null;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();

  const { data, error, isLoading } = useSWR<AdminStats>(
    session?.user?.role === "ADMIN" ? "/api/admin/stats" : null,
    fetcher
  );

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-text-muted">Завантаження...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-surface rounded-2xl border border-border">
        <ShieldOutlined className="text-error mb-4" sx={{ fontSize: 48 }} />
        <h1 className="text-2xl font-bold mb-2">Доступ заборонено</h1>
        <p className="text-text-muted mb-6">
          У вас немає прав для перегляду панелі адміністратора.
        </p>
        <Link
          href="/articles"
          className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity"
        >
          Повернутися до статей
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Адмін-панель</h1>
        <p className="text-text-muted">
          Огляд статистики системи та швидке керування ресурсами
        </p>
      </div>

      {/* Швидкі посилання */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/users"
          className="flex items-center justify-between p-5 bg-surface rounded-xl border border-border hover:border-primary transition-colors group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <PeopleAltOutlined fontSize="medium" />
            </div>
            <div>
              <h2 className="font-semibold text-text-main group-hover:text-primary transition-colors">
                Керування користувачами
              </h2>
              <p className="text-sm text-text-muted">
                Перегляд списку, зміна ролей та видалення
              </p>
            </div>
          </div>
          <ArrowForwardOutlined className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin/articles"
          className="flex items-center justify-between p-5 bg-surface rounded-xl border border-border hover:border-primary transition-colors group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ArticleOutlined fontSize="medium" />
            </div>
            <div>
              <h2 className="font-semibold text-text-main group-hover:text-primary transition-colors">
                Модерація статей
              </h2>
              <p className="text-sm text-text-muted">
                Перегляд та модерація опублікованих статей
              </p>
            </div>
          </div>
          <ArrowForwardOutlined className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Статистика */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Статистика системи</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-surface rounded-xl border border-border p-5 h-28 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-error/10 text-error rounded-xl border border-error/20">
            {error.message}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface rounded-xl border border-border p-5">
              <div className="flex items-center justify-between text-text-muted mb-2">
                <span className="text-sm font-medium">Користувачі</span>
                <PeopleAltOutlined fontSize="small" />
              </div>
              <div className="text-3xl font-bold text-text-main">
                {data?.counts.users ?? 0}
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-border p-5">
              <div className="flex items-center justify-between text-text-muted mb-2">
                <span className="text-sm font-medium">Статті</span>
                <ArticleOutlined fontSize="small" />
              </div>
              <div className="text-3xl font-bold text-text-main">
                {data?.counts.articles ?? 0}
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-border p-5">
              <div className="flex items-center justify-between text-text-muted mb-2">
                <span className="text-sm font-medium">Коментарі</span>
                <CommentOutlined fontSize="small" />
              </div>
              <div className="text-3xl font-bold text-text-main">
                {data?.counts.comments ?? 0}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Останні зареєстровані користувачі */}
      <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-main">
            Останні зареєстровані користувачі
          </h2>
          <Link
            href="/admin/users"
            className="text-sm text-primary hover:underline font-medium"
          >
            Всі користувачі
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-border/40 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : data?.recentUsers && data.recentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted font-medium">
                  <th className="pb-3 pl-2">Користувач</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Роль</th>
                  <th className="pb-3 pr-2">Дата реєстрації</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-border/20 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs overflow-hidden flex-shrink-0">
                          {user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.image}
                              alt={user.name || "User"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()
                          )}
                        </div>
                        <span className="font-medium text-text-main">
                          {user.name || "Без імені"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-text-muted">{user.email}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-border/50 text-text-muted"
                        }`}
                      >
                        {user.role === "ADMIN" ? "Адміністратор" : "Користувач"}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-text-muted">
                      {new Date(user.createdAt).toLocaleDateString("uk-UA")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-muted text-sm py-4 text-center">
            Користувачів не знайдено
          </p>
        )}
      </div>
    </div>
  );
}
