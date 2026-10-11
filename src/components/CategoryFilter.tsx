"use client";

import { ARTICLE_CATEGORIES } from "@/lib/validation";

interface CategoryFilterProps {
  selected: string | null;
  onChange: (category: string | null) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide py-1">
      <button
        onClick={() => onChange(null)}
        className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold tracking-wide transition-all duration-200 ${
          selected === null
            ? "bg-primary text-white shadow-sm shadow-primary/20 scale-[1.02]"
            : "bg-white text-slate-600 border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        Всі теми
      </button>
      
      {ARTICLE_CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold tracking-wide transition-all duration-200 ${
            selected === category
              ? "bg-primary text-white shadow-sm shadow-primary/20 scale-[1.02]"
              : "bg-white text-slate-600 border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
