"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Comment } from "@/types";
import Avatar from "@/components/Avatar";

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  onDelete: (id: number) => void;
}

export function CommentList({ comments, isLoading, onDelete }: CommentListProps) {
  const { data: session } = useSession();
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Не вдалося видалити коментар");
      }
      setConfirmId(null);
      onDelete(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося видалити коментар");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4" aria-busy="true">
        {[1, 2].map((i) => (
          <div key={i} className="flex animate-pulse gap-3 py-2">
            <div className="h-9 w-9 shrink-0 rounded-full bg-slate-100" />
            <div className="flex-1">
              <div className="mb-2 h-4 w-1/4 rounded bg-slate-100" />
              <div className="h-4 w-full rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return <p className="text-text-muted">Коментарів поки немає. Напишіть перший.</p>;
  }

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div>
      {error && (
        <p role="alert" className="mb-4 text-sm font-medium text-error">
          {error}
        </p>
      )}
      <ul className="divide-y divide-rule border-y border-rule">
        {comments.map((comment) => {
          const canDelete = isAdmin || session?.user?.id === comment.authorId;
          const date = new Date(comment.createdAt).toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <li key={comment.id} className="flex gap-3 py-5">
              <Avatar name={comment.author.name} image={comment.author.image} size={36} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="font-semibold">{comment.author.name || "Користувач"}</p>
                  <time dateTime={comment.createdAt} className="text-xs text-text-muted">
                    {date}
                  </time>
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words leading-relaxed">{comment.content}</p>

                {canDelete &&
                  (confirmId === comment.id ? (
                    <div className="mt-2 flex items-center gap-3 text-sm">
                      <span className="text-text-muted">Видалити коментар?</span>
                      <button type="button" onClick={() => handleDelete(comment.id)} className="font-semibold text-error hover:underline">
                        Так, видалити
                      </button>
                      <button type="button" onClick={() => setConfirmId(null)} className="font-medium text-text-muted hover:underline">
                        Скасувати
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmId(comment.id)}
                      className="mt-2 text-sm font-medium text-text-muted hover:text-error"
                    >
                      Видалити
                    </button>
                  ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
