import { Suspense } from "react";
import FavoriteArticle from "@/components/FavoriteArticle";

// TODO: замінити на модель Bookmark у БД (зараз ID зашиті в коді)
const favoriteIds = [1, 2, 3];

function FavoriteArticleSkeleton() {
  return (
    <div className="animate-pulse rounded-md border border-rule bg-surface p-5">
      <div className="mb-4 h-4 w-24 rounded bg-slate-100" />
      <div className="mb-2 h-6 w-3/4 rounded bg-slate-100" />
      <div className="mb-1.5 h-4 w-full rounded bg-slate-100" />
      <div className="h-4 w-2/3 rounded bg-slate-100" />
    </div>
  );
}

export default function FavoritePage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Обрані матеріали</h1>
      <p className="mt-2 text-text-muted">Збережені статті, до яких хочеться повернутися.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favoriteIds.map((id) => (
          <Suspense key={id} fallback={<FavoriteArticleSkeleton />}>
            <FavoriteArticle id={id} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
