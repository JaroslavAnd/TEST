"use client";

import { useState } from "react";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";
import { useArticles } from "@/hooks/useArticles";

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 9;

  const { articles, pagination, isLoading, isError } = useArticles({
    search,
    category: category || undefined,
    page,
    limit,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string | null) => {
    setCategory(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Навчальні матеріали</h1>
          <p className="text-sm text-slate-500 mt-1">
            Переглядайте публікації, шукайте потрібні матеріали та фільтруйте за темами
          </p>
        </div>
        <Link
          href="/articles/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
        >
          <span>✍️</span>
          Створити статтю
        </Link>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <SearchBar value={search} onChange={handleSearchChange} />
        <CategoryFilter selected={category} onChange={handleCategoryChange} />
      </div>

      {!isLoading && !isError && pagination && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
          <span>Результати ({pagination.total})</span>
          <span>Сторінка {pagination.page} з {pagination.totalPages || 1}</span>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface rounded-xl border border-border p-5 animate-pulse"
            >
              <div className="h-4 w-24 bg-border rounded-full mb-3" />
              <div className="h-5 w-3/4 bg-border rounded mb-2" />
              <div className="h-4 w-full bg-border rounded mb-1" />
              <div className="h-4 w-2/3 bg-border rounded mb-4" />
              <div className="h-4 w-24 bg-border rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-semibold mb-1">Помилка завантаження</h2>
          <p className="text-text-muted text-sm">
            Не вдалося отримати статті. Спробуйте оновити сторінку.
          </p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-xl border border-border">
          <div className="text-4xl mb-3">📭</div>
          <h2 className="text-lg font-semibold mb-1">Матеріалів не знайдено</h2>
          <p className="text-text-muted text-sm">
            Спробуйте змінити параметри пошуку або обрати іншу категорію.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
