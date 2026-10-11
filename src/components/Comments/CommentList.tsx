"use client";

import { useSession } from "next-auth/react";
import { Comment } from "@/types";
import { Avatar } from "@mui/material";

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  onDelete: (id: number) => void;
}

export function CommentList({ comments, isLoading, onDelete }: CommentListProps) {
  const { data: session } = useSession();

  const handleDelete = async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цей коментар?")) return;
    
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        throw new Error("Помилка видалення коментаря");
      }
      
      onDelete(id);
    } catch (error) {
      console.error(error);
      alert("Не вдалося видалити коментар");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface p-5 rounded-xl border border-border animate-pulse flex gap-3">
            <div className="w-10 h-10 rounded-full bg-border shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-border rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-border rounded w-1/6 mb-4"></div>
              <div className="h-4 bg-border rounded w-full mb-2"></div>
              <div className="h-4 bg-border rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center p-8 bg-surface rounded-xl border border-border text-text-muted">
        Коментарів поки немає
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const isAuthor = session?.user?.id === comment.authorId;
        const date = new Date(comment.createdAt).toLocaleDateString("uk-UA", {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        return (
          <div key={comment.id} className="bg-surface p-5 rounded-xl border border-border flex gap-3">
            <Avatar 
              src={comment.author.image || undefined} 
              alt={comment.author.name || "Користувач"}
              sx={{ width: 40, height: 40 }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-text-main">
                    {comment.author.name || "Анонім"}
                  </h4>
                  <p className="text-xs text-text-muted">{date}</p>
                </div>
                {isAuthor && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-text-muted hover:text-error text-sm transition-colors"
                  >
                    Видалити
                  </button>
                )}
              </div>
              <p className="text-text-main whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
