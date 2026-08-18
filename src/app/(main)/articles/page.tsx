import { Article } from "@/types";
import ArticleCard from "@/components/ArticleCard";

async function getArticles(): Promise<Article[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Не вдалося завантажити статті");
  return res.json();
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Навчальні матеріали</h1>
      <p className="text-text-muted mb-6">
        Перегляньте доступні статті та навчальні ресурси
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
