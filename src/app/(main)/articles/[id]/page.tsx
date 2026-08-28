"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useArticle } from "@/hooks/useArticles";
import { useState } from "react";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { article, isLoading, isError } = useArticle(id);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/articles");
      }
    } catch {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl animate-pulse">
        <div className="h-6 w-20 bg-border rounded-full mb-6" />
        <div className="h-8 w-3/4 bg-border rounded mb-4" />
        <div className="bg-surface rounded-xl border border-border p-5 mb-8">
          <div className="h-4 w-full bg-border rounded mb-2" />
          <div className="h-4 w-full bg-border rounded mb-2" />
          <div className="h-4 w-2/3 bg-border rounded" />
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">📄</div>
        <h2 className="text-xl font-bold mb-2">Статтю не знайдено</h2>
        <p className="text-text-muted mb-6">
          На жаль, матеріал з таким ID не існує.
        </p>
        <Link
          href="/articles"
          className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          ← Повернутися до списку
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          {article.category}
        </span>
        <span className="text-xs text-text-muted">
          ID: {article.id}
        </span>
        <span className="text-xs text-text-muted">
          {formattedDate}
        </span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        {article.title}
      </h1>

      <div className="bg-surface rounded-xl border border-border p-5 mb-6">
        <p className="text-text-main leading-relaxed whitespace-pre-line">
          {article.content}
        </p>
      </div>

      {/* Кнопки редагування та видалення */}
      <div className="flex gap-3 mb-8">
        <Link
          href={`/articles/${article.id}/edit`}
          className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Редагувати
        </Link>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-error border border-error rounded-lg hover:bg-error/5 transition-colors"
          >
            Видалити
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">Ви впевнені?</span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1.5 text-sm font-medium bg-error text-white rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
            >
              {deleting ? "Видалення..." : "Так, видалити"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1.5 text-sm font-medium text-text-muted border border-border rounded-lg hover:bg-surface transition-colors"
            >
              Скасувати
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
