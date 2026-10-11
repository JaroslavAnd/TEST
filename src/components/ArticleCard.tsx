import Link from "next/link";
import { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
}

// Кольори бейджів для категорій
const categoryColors: Record<string, string> = {
  "Програмування": "bg-blue-50 text-blue-700 border-blue-200/60",
  "Веброзробка": "bg-indigo-50 text-indigo-700 border-indigo-200/60",
  "Бази даних": "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  "Алгоритми": "bg-purple-50 text-purple-700 border-purple-200/60",
  "DevOps": "bg-amber-50 text-amber-700 border-amber-200/60",
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const badgeClass = categoryColors[article.category] || "bg-slate-50 text-slate-700 border-slate-200/60";
  const formattedDate = new Date(article.createdAt).toLocaleDateString("uk-UA", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
            {article.category}
          </span>
          <span className="text-[12px] text-slate-400 font-medium">
            {formattedDate}
          </span>
        </div>

        <Link href={`/articles/${article.id}`}>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
            {article.title}
          </h3>
        </Link>

        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-4">
          {article.excerpt}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center text-[10px] font-bold">
            {article.author?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <span className="text-xs font-medium text-slate-600 truncate max-w-[130px]">
            {article.author?.name || "Анонім"}
          </span>
        </div>

        <Link
          href={`/articles/${article.id}`}
          className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          Читати
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
