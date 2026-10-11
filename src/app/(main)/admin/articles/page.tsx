"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useSWR from "swr";
import {
  ArrowBackOutlined,
  DeleteOutlineOutlined,
  VisibilityOutlined,
  ShieldOutlined,
  SearchOutlined,
  ChatBubbleOutlineOutlined,
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

interface ArticleItem {
  id: number;
  title: string;
  category: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
  _count: {
    comments: number;
  };
}

interface ArticlesResponse {
  data: ArticleItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function AdminArticlesPage() {
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

  const { data, error, isLoading, mutate } = useSWR<ArticlesResponse>(
    session?.user?.role === "ADMIN"
      ? `/api/admin/articles?${queryParams.toString()}`
      : null,
    fetcher
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleDeleteArticle = async (articleId: number, title: string) => {
    setActionError(null);
    setActionSuccess(null);

    const confirmed = confirm(
      `Ви впевнені, що хочете видалити статтю "${title}"?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/articles/${articleId}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Не вдалося видалити статтю");
      }

      setActionSuccess("Статтю успішно видалено");
      mutate();
    } catch (err: any) {
      setActionError(err.message || "Помилка при видаленні статті");
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
            <span className="text-text-main font-medium">Статті</span>
          </div>
          <h1 className="text-2xl font-bold">Модерація статей</h1>
        </div>

        {/* Форма пошуку */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" fontSize="small" />
            <input
              type="text"
              placeholder="Пошук за заголовком або категорією..."
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

      {/* Таблиця статей */}
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
                  <th className="py-3 px-4">Заголовок</th>
                  <th className="py-3 px-4">Автор</th>
                  <th className="py-3 px-4">Категорія</th>
                  <th className="py-3 px-4 text-center">Коментарі</th>
                  <th className="py-3 px-4">Дата</th>
                  <th className="py-3 px-4 text-right">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.data.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-border/20 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`/articles/${article.id}`}
                        className="font-medium text-text-main hover:text-primary transition-colors line-clamp-1 max-w-xs"
                      >
                        {article.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px] overflow-hidden flex-shrink-0">
                          {article.author?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={article.author.image}
                              alt={article.author.name || "Author"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            article.author?.name?.[0]?.toUpperCase() ||
                            article.author?.email?.[0]?.toUpperCase() ||
                            "?"
                          )}
                        </div>
                        <span className="text-text-muted truncate max-w-[140px]">
                          {article.author?.name || article.author?.email || "Анонім"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-border/50 text-text-muted">
                        {article.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-text-muted">
                      <div className="flex items-center justify-center space-x-1">
                        <ChatBubbleOutlineOutlined sx={{ fontSize: 14 }} />
                        <span>{article._count.comments}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-muted whitespace-nowrap">
                      {new Date(article.createdAt).toLocaleDateString("uk-UA")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link
                          href={`/articles/${article.id}`}
                          title="Переглянути статтю"
                          className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <VisibilityOutlined fontSize="small" />
                        </Link>
                        <button
                          onClick={() =>
                            handleDeleteArticle(article.id, article.title)
                          }
                          title="Видалити статтю"
                          className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                        >
                          <DeleteOutlineOutlined fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-text-muted">
            Статей не знайдено
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
