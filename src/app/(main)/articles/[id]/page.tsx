"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useArticle } from "@/hooks/useArticles";
import { CommentsSection } from "@/components/Comments/CommentsSection";
import Avatar from "@/components/Avatar";
import { canEditArticle, formatDate, readingTimeMinutes } from "@/lib/format";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const id = params.id as string;
  const { article, isLoading, isError } = useArticle(id);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/articles");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setDeleteError(data.error || "Не вдалося видалити статтю");
    } catch {
      setDeleteError("Не вдалося видалити статтю. Перевірте з’єднання.");
    }
    setDeleting(false);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse" aria-busy="true">
        <div className="mb-6 h-4 w-28 rounded bg-slate-100" />
        <div className="mb-3 h-5 w-24 rounded bg-slate-100" />
        <div className="mb-8 h-12 w-3/4 rounded bg-slate-100" />
        <div className="rounded-md border border-rule bg-surface p-10">
          <div className="mb-3 h-4 w-full rounded bg-slate-100" />
          <div className="mb-3 h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-2/3 rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-bold">Статтю не знайдено</h1>
        <p className="mt-2 text-text-muted">Можливо, її видалили або посилання неправильне.</p>
        <Link href="/articles" className="btn btn-secondary mt-6">
          До всіх матеріалів
        </Link>
      </div>
    );
  }

  const canEdit = canEditArticle(session?.user?.id, article.authorId, session?.user?.role);
  const minutes = readingTimeMinutes(article.content);
  const paragraphs = article.content.split(/\n{2,}/).filter((p) => p.trim());

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/articles" className="text-sm font-medium text-text-muted hover:text-ink">
        ← Усі матеріали
      </Link>

      <header className="mt-6">
        <Link
          href={`/articles?category=${encodeURIComponent(article.category)}`}
          className="text-sm font-semibold text-ink hover:underline"
        >
          {article.category}
        </Link>
        <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">{article.title}</h1>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
          {article.author?.name && (
            <span className="flex items-center gap-2">
              <Avatar name={article.author.name} image={article.author.image} size={28} />
              <span className="font-medium text-text-main">{article.author.name}</span>
            </span>
          )}
          <time dateTime={article.createdAt}>{formatDate(article.createdAt)}</time>
          <span>{minutes} хв читання</span>
        </div>
      </header>

      <article className="sheet sheet-margin mt-8 py-8 pl-14 pr-5 sm:py-12 sm:pl-24 sm:pr-14">
        <div className="space-y-5 font-serif text-[1.0625rem] leading-[1.85] text-slate-800 sm:text-lg sm:leading-[1.85]">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      </article>

      {canEdit && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href={`/articles/${article.id}/edit`} className="btn btn-secondary btn-sm">
            Редагувати
          </Link>

          {!showConfirm ? (
            <button type="button" onClick={() => setShowConfirm(true)} className="btn btn-danger btn-sm">
              Видалити
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-margin/30 bg-white px-3 py-1.5">
              <span className="text-sm font-medium">Видалити назавжди?</span>
              <button type="button" onClick={handleDelete} disabled={deleting} className="btn btn-danger btn-sm">
                {deleting ? "Видаляємо…" : "Так, видалити"}
              </button>
              <button type="button" onClick={() => setShowConfirm(false)} className="btn btn-secondary btn-sm">
                Скасувати
              </button>
            </div>
          )}
          {deleteError && (
            <p role="alert" className="w-full text-sm font-medium text-error">
              {deleteError}
            </p>
          )}
        </div>
      )}

      <CommentsSection articleId={article.id} />
    </div>
  );
}
