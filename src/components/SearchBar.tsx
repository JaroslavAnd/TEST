"use client";

import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  /** Початкове значення (з URL). Зміна значення ззовні — через `key` у батька. */
  defaultValue?: string;
  onSearch: (value: string) => void;
  delay?: number;
}

export default function SearchBar({ defaultValue = "", onSearch, delay = 350 }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Debounce робимо в обробнику події, а не в useEffect:
  // так не виникає зайвих викликів onSearch і скидання сторінки пагінації.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(next.trim()), delay);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        clearTimeout(timer.current);
        onSearch(value.trim());
      }}
      className="relative"
    >
      <label htmlFor="article-search" className="sr-only">
        Пошук матеріалів
      </label>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
      </svg>
      <input
        id="article-search"
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Шукати за заголовком або текстом"
        className="field py-3 pl-11 text-base"
        autoComplete="off"
      />
    </form>
  );
}
