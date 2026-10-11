import Link from "next/link";
import { Article } from "@/types";
import Avatar from "@/components/Avatar";
import { formatDate, formatAuthorName } from "@/lib/format";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const authorName = article.author?.name;

  return (
    <article className="group relative flex flex-col rounded-md border border-rule bg-surface p-5 transition-colors hover:border-ink focus-within:border-ink focus-within:ring-2 focus-within:ring-ink/20">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-semibold text-ink">{article.category}</span>
        <time dateTime={article.createdAt} className="text-text-muted">
          {formatDate(article.createdAt)}
        </time>
      </div>

      <h3 className="mt-3 text-xl font-bold leading-snug">
        {/* Лінк розтягнутий на всю картку, тому клікабельна вся площа */}
        <Link href={`/articles/${article.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
          <span className="marker-hover">{article.title}</span>
        </Link>
      </h3>

      <p className="mt-2 line-clamp-3 leading-relaxed text-text-muted">{article.excerpt}</p>

      {authorName && (
        <div className="mt-auto flex items-center gap-2 pt-5 text-sm text-text-muted">
          <Avatar name={authorName} image={article.author?.image} size={24} />
          <span className="truncate">{formatAuthorName(authorName)}</span>
        </div>
      )}
    </article>
  );
}
