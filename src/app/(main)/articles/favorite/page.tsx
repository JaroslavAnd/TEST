import { Suspense } from "react";
import FavoriteArticle from "@/components/FavoriteArticle";

const favoriteIds = [1, 2, 3];

function FavoriteArticleSkeleton() {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 animate-pulse">
      <div className="flex gap-2 mb-2">
        <div className="h-4 w-16 bg-border rounded-full" />
        <div className="h-4 w-12 bg-border rounded-full" />
      </div>
      <div className="h-5 w-3/4 bg-border rounded mb-2" />
      <div className="h-4 w-full bg-border rounded mb-1" />
      <div className="h-4 w-2/3 bg-border rounded mb-4" />
      <div className="h-4 w-24 bg-border rounded" />
    </div>
  );
}

export default function FavoritePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Обрані матеріали</h1>
      <p className="text-text-muted mb-6">
        Ваші збережені навчальні статті
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoriteIds.map((id) => (
          <Suspense key={id} fallback={<FavoriteArticleSkeleton />}>
            <FavoriteArticle id={id} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
