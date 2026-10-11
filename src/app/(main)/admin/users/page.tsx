"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useSWR from "swr";
import {
  ArrowBackOutlined,
  DeleteOutlineOutlined,
  ShieldOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import Pagination from "@/components/Pagination";

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Помилка завантаження даних");
    }
    return res.json();
  });

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  image: string | null;
  createdAt: string;
  _count: {
    articles: number;
    comments: number;
  };
}

interface UsersResponse {
  data: UserItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: "10",
    ...(search ? { search } : {}),
  });

  const { data, error, isLoading, mutate } = useSWR<UsersResponse>(
    session?.user?.role === "ADMIN"
      ? `/api/admin/users?${queryParams.toString()}`
      : null,
    fetcher
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionError(null);
    setActionSuccess(null);

    if (userId === session?.user?.id && newRole !== "ADMIN") {
      alert("Ви не можете зняти з себе роль адміністратора");
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Не вдалося оновити роль");
      }

      setActionSuccess("Роль користувача успішно оновлено");
      mutate();
    } catch (err) {
      setActionError(err instanceof Error && err.message ? err.message : "Помилка при оновленні ролі");
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    setActionError(null);
    setActionSuccess(null);

    if (userId === session?.user?.id) {
      alert("Ви не можете видалити свій власний акаунт");
      return;
    }

    const confirmed = confirm(
      `Ви впевнені, що хочете видалити користувача ${userEmail}? Усі статті та коментарі користувача також будуть видалені.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Не вдалося видалити користувача");
      }

      setActionSuccess("Користувача успішно видалено");
      mutate();
    } catch (err) {
      setActionError(err instanceof Error && err.message ? err.message : "Помилка при видаленні користувача");
    }
  };

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
          У вас немає прав для перегляду цієї сторінки.
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sm text-text-muted mb-1">
            <Link
              href="/admin"
              className="hover:text-primary transition-colors flex items-center"
            >
              <ArrowBackOutlined fontSize="inherit" className="mr-1" />
              Адмін-панель
            </Link>
            <span>/</span>
            <span className="text-text-main font-medium">Користувачі</span>
          </div>
          <h1 className="text-2xl font-bold">Керування користувачами</h1>
        </div>

        {/* Форма пошуку */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" fontSize="small" />
            <input
              type="text"
              placeholder="Пошук за ім'ям або email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-main placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Знайти
          </button>
        </form>
      </div>

      {actionError && (
        <div className="p-4 bg-error/10 text-error border border-error/20 rounded-xl text-sm">
          {actionError}
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm">
          {actionSuccess}
        </div>
      )}

      {/* Таблиця користувачів */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 bg-border/40 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-error">{error.message}</div>
        ) : data?.data && data.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-border/20 border-b border-border text-text-muted font-medium">
                <tr>
                  <th className="py-3 px-4">Користувач</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Роль</th>
                  <th className="py-3 px-4 text-center">Статей</th>
                  <th className="py-3 px-4 text-center">Коментарів</th>
                  <th className="py-3 px-4">Реєстрація</th>
                  <th className="py-3 px-4 text-right">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.data.map((user) => {
                  const isCurrent = user.id === session?.user?.id;
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-border/20 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs overflow-hidden flex-shrink-0">
                            {user.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={user.image}
                                alt={user.name || "User"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              user.name?.[0]?.toUpperCase() ||
                              user.email[0].toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-text-main">
                              {user.name || "Без імені"}
                              {isCurrent && (
                                <span className="ml-2 text-xs text-primary font-normal">
                                  (Ви)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-muted">{user.email}</td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          disabled={isCurrent}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border bg-surface text-text-main focus:outline-none focus:border-primary disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <option value="USER">Користувач</option>
                          <option value="ADMIN">Адміністратор</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-center text-text-muted font-medium">
                        {user._count.articles}
                      </td>
                      <td className="py-3 px-4 text-center text-text-muted font-medium">
                        {user._count.comments}
                      </td>
                      <td className="py-3 px-4 text-text-muted whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString("uk-UA")}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          disabled={isCurrent}
                          title={
                            isCurrent
                              ? "Неможливо видалити свій акаунт"
                              : "Видалити користувача"
                          }
                          className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted disabled:cursor-not-allowed"
                        >
                          <DeleteOutlineOutlined fontSize="small" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-text-muted">
            Користувачів не знайдено
          </div>
        )}
      </div>

      {/* Пагінація */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={data.pagination.totalPages}
          onChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
}
