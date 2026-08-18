export default function ArticlesLoading() {
  return (
    <div>
      <div className="h-8 w-64 bg-border rounded-lg mb-2 animate-pulse" />
      <div className="h-5 w-96 bg-border rounded-lg mb-6 animate-pulse" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface rounded-xl border border-border p-5 animate-pulse"
          >
            <div className="h-4 w-16 bg-border rounded-full mb-3" />
            <div className="h-5 w-3/4 bg-border rounded mb-2" />
            <div className="h-4 w-full bg-border rounded mb-1" />
            <div className="h-4 w-2/3 bg-border rounded mb-4" />
            <div className="h-4 w-24 bg-border rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
