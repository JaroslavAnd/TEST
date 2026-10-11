"use client";

import { useComments } from "@/hooks/useComments";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

interface CommentsSectionProps {
  articleId: number;
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const { comments, isLoading, mutate } = useComments(articleId);

  const handleSuccess = () => {
    mutate();
  };

  const handleDelete = () => {
    mutate();
  };

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-text-main mb-6">Коментарі ({comments.length})</h2>
      <CommentForm articleId={articleId} onSuccess={handleSuccess} />
      <CommentList comments={comments} isLoading={isLoading} onDelete={handleDelete} />
    </section>
  );
}
