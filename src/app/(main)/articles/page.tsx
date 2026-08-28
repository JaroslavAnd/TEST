"use client";

import ArticleCard from "@/components/ArticleCard";
import { useArticles } from "@/hooks/useArticles";

export default function ArticlesPage() {
  const { articles, isLoading, isError } = useArticles();

  if (isLoading) {
    return (
      <div>
        <div className="h-8 w-64 bg-border rounded-lg mb-2 animate-pulse" />
        <div className="h-5 w-96 bg-border rounded-lg mb-6 animate-pulse" />
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
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-lg font-semibold mb-1">Помилка завантаження</h2>
        <p className="text-text-muted text-sm">
          Не вдалося отримати статті. Спробуйте оновити сторінку.
        </p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-1">Навчальні матеріали</h1>
        <p className="text-text-muted mb-6">
          Перегляньте доступні статті та навчальні ресурси
        </p>
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📭</div>
          <h2 className="text-lg font-semibold mb-1">Статей поки немає</h2>
          <p className="text-text-muted text-sm">
            Створіть першу статтю, щоб вона з&apos;явилась тут.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Навчальні матеріали</h1>
      <p className="text-text-muted mb-6">
        Перегляньте доступні статті та навчальні ресурси
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
