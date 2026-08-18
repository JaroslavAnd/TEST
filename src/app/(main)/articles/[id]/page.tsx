import { notFound } from "next/navigation";
import { Article, Comment } from "@/types";

// Статична генерація для ID 1-10
export async function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
  }));
}

async function getArticle(id: string): Promise<Article | null> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  return res.json();
}

async function getComments(id: string): Promise<Comment[]> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, comments] = await Promise.all([
    getArticle(id),
    getComments(id),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          ID: {article.id}
        </span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-4 capitalize">
        {article.title}
      </h1>

      <div className="bg-surface rounded-xl border border-border p-5 mb-8">
        <p className="text-text-main leading-relaxed">{article.body}</p>
      </div>

      {/* Коментарі */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          Коментарі ({comments.length})
        </h2>
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-surface rounded-lg border border-border p-4"
            >
              <p className="text-sm font-medium text-primary mb-1">
                {comment.email}
              </p>
              <p className="text-sm text-text-main">{comment.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
