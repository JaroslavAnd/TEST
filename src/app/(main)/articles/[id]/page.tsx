"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useArticle } from "@/hooks/useArticles";
import { useState } from "react";
import { CommentsSection } from "@/components/Comments/CommentsSection";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
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
      } else {
        const data = await res.json();
        alert(data.error || "Помилка видалення");
        setDeleting(false);
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

  // Перевірка чи поточний користувач є автором
  const isAuthor = session?.user?.id && article.authorId === session.user.id;
  // Статті без автора можуть редагувати всі авторизовані
  const canEdit = session?.user && (!article.authorId || isAuthor);

  return (
    <div className="max-w-4xl mx-auto py-2">
      <div className="mb-6">
        <Link
          href="/articles"
          className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors inline-flex items-center gap-1.5"
        >
          <span>←</span> До всіх матеріалів
        </Link>
      </div>

      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          {article.category}
        </span>
        {article.author?.name && (
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <span>✍️</span> {article.author.name}
          </span>
        )}
        <span className="text-xs text-slate-400">
          • {formattedDate}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
        {article.title}
      </h1>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 mb-8 shadow-sm">
        <div className="prose prose-slate max-w-none text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal">
          {article.content}
        </div>
      </div>

      {/* Кнопки редагування та видалення — тільки для автора */}
      {canEdit && (
        <div className="flex gap-3 mb-10 pb-6 border-b border-slate-200/80">
          <Link
            href={`/articles/${article.id}/edit`}
            className="px-4 py-2 text-sm font-semibold bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            ✏️ Редагувати
          </Link>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 text-sm font-semibold text-error bg-red-50/50 border border-red-200/60 rounded-xl hover:bg-red-50 transition-colors"
            >
              Видалити
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-red-50/80 p-2 rounded-xl border border-red-200">
              <span className="text-xs font-medium text-red-700">Ви впевнені?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1 text-xs font-semibold bg-error text-white rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
              >
                {deleting ? "..." : "Так"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Ні
              </button>
            </div>
          )}
        </div>
      )}

      <CommentsSection articleId={article.id} />
    </div>
  );
}
