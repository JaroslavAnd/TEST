"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

// Повертає список сторінок із пропусками: 1 … 4 5 6 … 12
export function getPageItems(page: number, totalPages: number): (number | "gap")[] {
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  const items: (number | "gap")[] = [];
  if (start > 1) {
    items.push(1);
    if (start > 2) items.push("gap");
  }
  for (let i = start; i <= end; i++) items.push(i);
  if (end < totalPages) {
    if (end < totalPages - 1) items.push("gap");
    items.push(totalPages);
  }
  return items;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const cell =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors";
  const idle = "border-rule bg-surface text-text-main hover:border-ink";

  return (
    <nav aria-label="Сторінки" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${cell} ${idle} disabled:pointer-events-none disabled:opacity-40`}
      >
        Назад
      </button>

      {getPageItems(page, totalPages).map((item, i) =>
        item === "gap" ? (
          <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-text-muted">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-label={`Сторінка ${item}`}
            aria-current={item === page ? "page" : undefined}
            className={`${cell} ${item === page ? "border-ink bg-ink text-white" : idle}`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={`${cell} ${idle} disabled:pointer-events-none disabled:opacity-40`}
      >
        Далі
      </button>
    </nav>
  );
}
