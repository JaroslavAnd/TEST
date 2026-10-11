"use client";

import { useComments } from "@/hooks/useComments";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

interface CommentsSectionProps {
  articleId: number;
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const { comments, isLoading, mutate } = useComments(articleId);

  return (
    <section className="mt-14" aria-labelledby="comments-title">
      <h2 id="comments-title" className="mb-6 text-2xl font-bold">
        Коментарі{!isLoading && comments.length > 0 ? ` (${comments.length})` : ""}
      </h2>
      <CommentForm articleId={articleId} onSuccess={() => mutate()} />
      <CommentList comments={comments} isLoading={isLoading} onDelete={() => mutate()} />
    </section>
  );
}
