"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Усі статті", href: "/articles" },
  { label: "Обране", href: "/articles/favorite" },
  { label: "Створити статтю", href: "/articles/create" },
];

export default function ArticlesNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/articles") {
      return pathname === "/articles";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
            isActive(tab.href)
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-main hover:border-border"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
