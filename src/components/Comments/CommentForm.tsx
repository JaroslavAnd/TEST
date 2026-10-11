"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface CommentFormProps {
  articleId: number;
  onSuccess: () => void;
}

const MAX_LENGTH = 1000;

export function CommentForm({ articleId, onSuccess }: CommentFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    return (
      <p className="mb-6 rounded-md border border-dashed border-slate-300 bg-surface px-5 py-4 text-text-muted">
        Щоб залишити коментар, <Link href="/login" className="font-semibold text-ink underline underline-offset-4">увійдіть в акаунт</Link>.
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Не вдалося надіслати коментар");
      }

      setContent("");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося надіслати коментар");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-md border border-rule bg-surface p-4 sm:p-5">
      <label htmlFor="comment-text" className="mb-2 block text-sm font-semibold">
        Ваш коментар
      </label>
      <textarea
        id="comment-text"
        className="field resize-y"
        rows={3}
        maxLength={MAX_LENGTH}
        placeholder="Запитайте автора або поділіться власним прикладом"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
      />

      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-error">
          {error}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="text-xs text-text-muted">
          {content.length} / {MAX_LENGTH}
        </span>
        <button type="submit" disabled={!content.trim() || isSubmitting} className="btn btn-primary btn-sm">
          {isSubmitting ? "Надсилаємо…" : "Надіслати"}
        </button>
      </div>
    </form>
  );
}
