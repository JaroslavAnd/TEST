import Link from "next/link";
import { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {article.category}
        </span>
        <span className="text-xs text-text-muted">
          ID: {article.id}
        </span>
      </div>
      <h3 className="text-base font-semibold text-secondary mb-2 line-clamp-2">
        {article.title}
      </h3>
      <p className="text-sm text-text-muted mb-4 line-clamp-3">
        {article.excerpt}
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
