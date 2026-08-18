import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">📄</div>
      <h2 className="text-xl font-bold mb-2">Статтю не знайдено</h2>
      <p className="text-text-muted mb-6">
        На жаль, матеріал з таким ID не існує.
      </p>
      <Link
        href="/articles"
        className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
      >
        ← Повернутися до списку
      </Link>
    </div>
  );
}
