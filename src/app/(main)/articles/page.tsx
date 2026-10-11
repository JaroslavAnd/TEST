"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";
import { useArticles } from "@/hooks/useArticles";
import { pluralize } from "@/lib/format";

const PAGE_SIZE = 9;

function ArticlesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Після «Скинути фільтри» перемонтовуємо поле пошуку, щоб очистити його текст
  const [searchKey, setSearchKey] = useState(0);

  // Фільтри живуть в URL: ними можна ділитися, а кнопка «Назад» працює
  const search = searchParams.get("q") ?? "";
  const category = searchParams.get("category");
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const updateParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const { articles, pagination, isLoading, isError } = useArticles({
    search,
    category: category ?? undefined,
    page,
    limit: PAGE_SIZE,
  });

  const hasFilters = Boolean(search || category);
  const resetFilters = () => {
    setSearchKey((k) => k + 1);
    router.replace(pathname, { scroll: false });
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Навчальні матеріали</h1>
          <p className="mt-2 max-w-xl text-text-muted">
            Статті й конспекти від студентів. Шукайте за словом або обирайте тему.
          </p>
        </div>
        <Link href="/articles/create" className="btn btn-primary self-start sm:self-auto">
          Написати статтю
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        <SearchBar
          key={searchKey}
          defaultValue={search}
          onSearch={(value) => updateParams({ q: value, page: null })}
        />
        <CategoryFilter
          selected={category}
          onChange={(value) => updateParams({ category: value, page: null })}
        />
      </div>

      <div className="mt-8" aria-live="polite">
        {!isLoading && !isError && pagination && (
          <p className="mb-4 flex flex-wrap items-center gap-x-4 text-sm text-text-muted">
            <span>
              Знайдено {pagination.total}{" "}
              {pluralize(pagination.total, ["матеріал", "матеріали", "матеріалів"])}
            </span>
            {hasFilters && (
              <button type="button" onClick={resetFilters} className="font-semibold text-ink underline underline-offset-4">
                Скинути фільтри
              </button>
            )}
          </p>
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-md border border-rule bg-surface p-5">
                <div className="mb-4 h-4 w-24 rounded bg-slate-100" />
                <div className="mb-2 h-6 w-3/4 rounded bg-slate-100" />
                <div className="mb-1.5 h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-2/3 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-md border border-rule bg-surface px-6 py-14 text-center">
            <h2 className="text-lg font-bold">Не вдалося завантажити матеріали</h2>
            <p className="mt-1 text-text-muted">Перевірте з’єднання й оновіть сторінку.</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-md border border-rule bg-surface px-6 py-14 text-center">
            <h2 className="text-lg font-bold">Нічого не знайдено</h2>
            <p className="mt-1 text-text-muted">
              Спробуйте інше слово або оберіть іншу тему.
            </p>
            {hasFilters && (
              <button type="button" onClick={resetFilters} className="btn btn-secondary mt-5">
                Скинути фільтри
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            {pagination && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onChange={(p) => updateParams({ page: p > 1 ? String(p) : null })}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// useSearchParams вимагає Suspense-межі при збірці
export default function ArticlesPage() {
  return (
    <Suspense fallback={null}>
      <ArticlesView />
    </Suspense>
  );
}
