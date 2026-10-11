"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface CommentFormProps {
  articleId: number;
  onSuccess: () => void;
}

export function CommentForm({ articleId, onSuccess }: CommentFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    return (
      <div className="bg-surface p-5 rounded-xl border border-border mb-6">
        <p className="text-text-muted text-center">
          Увійдіть, щоб залишити коментар
        </p>
      </div>
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Помилка при створенні коментаря");
      }

      setContent("");
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm mb-6">
      <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span>💬</span> Залишити коментар
      </h3>
      
      <div className="mb-3">
        <textarea
          className="w-full bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
          rows={3}
          placeholder="Поділіться вашими думками щодо матеріалу..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      {error && (
        <p className="text-error mb-3 text-xs font-semibold">{error}</p>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 transition-all shadow-sm shadow-primary/20"
        >
          {isSubmitting ? "Надсилання..." : "Опублікувати коментар"}
        </button>
      </div>
    </form>
  );
}
