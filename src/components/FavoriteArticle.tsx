import Link from "next/link";
import { Article } from "@/types";

// Серверний компонент — отримує одну статтю за ID
async function fetchArticle(id: number): Promise<Article> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Не вдалося завантажити статтю");
  return res.json();
}

export default async function FavoriteArticle({ id }: { id: number }) {
  const article = await fetchArticle(id);

  return (
    <div className="bg-surface rounded-xl border border-border p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
          ★ Обране
        </span>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          ID: {article.id}
        </span>
      </div>
      <h3 className="text-base font-semibold text-secondary mb-2 capitalize">
        {article.title}
      </h3>
      <p className="text-sm text-text-muted mb-4 line-clamp-4">
        {article.body}
      </p>
      <Link
        href={`/articles/${article.id}`}
        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
      >
        Переглянути →
      </Link>
    </div>
  );
}
