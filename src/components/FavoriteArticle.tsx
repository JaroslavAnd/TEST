import Link from "next/link";
import { Article } from "@/types";
import { formatDate } from "@/lib/format";

// Серверний компонент — отримує одну статтю за ID з нашого API
async function fetchArticle(id: number): Promise<Article> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/articles/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Не вдалося завантажити статтю");
  return res.json();
}

export default async function FavoriteArticle({ id }: { id: number }) {
  const article = await fetchArticle(id);

  return (
    <article className="group relative flex flex-col rounded-md border border-rule bg-surface p-5 transition-colors hover:border-ink focus-within:border-ink focus-within:ring-2 focus-within:ring-ink/20">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-semibold text-ink">{article.category}</span>
        <time dateTime={article.createdAt} className="text-text-muted">
          {formatDate(article.createdAt)}
        </time>
      </div>
      <h3 className="mt-3 text-xl font-bold leading-snug">
        <Link href={`/articles/${article.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
          <span className="marker-hover">{article.title}</span>
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 leading-relaxed text-text-muted">{article.excerpt}</p>
    </article>
  );
}
