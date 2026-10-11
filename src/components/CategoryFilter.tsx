"use client";

import { ARTICLE_CATEGORIES } from "@/lib/validation";

interface CategoryFilterProps {
  selected: string | null;
  onChange: (category: string | null) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const base =
    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors";
  const idle = "border-rule bg-surface text-text-muted hover:border-ink hover:text-ink";
  const active = "border-marker bg-marker text-text-main";

  return (
    <div role="group" aria-label="Фільтр за темою" className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={selected === null}
        onClick={() => onChange(null)}
        className={`${base} ${selected === null ? active : idle}`}
      >
        Усі теми
      </button>

      {ARTICLE_CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          aria-pressed={selected === category}
          onClick={() => onChange(category)}
          className={`${base} ${selected === category ? active : idle}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
