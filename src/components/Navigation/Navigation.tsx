"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArticleOutlined,
  BookmarkBorderOutlined,
  EditOutlined,
  PersonOutlined,
  AdminPanelSettingsOutlined,
} from "@mui/icons-material";

// Нижня навігація для телефонів. На десктопі навігація знаходиться в Header.
const items = [
  { label: "Матеріали", href: "/articles", icon: ArticleOutlined },
  { label: "Обране", href: "/articles/favorite", icon: BookmarkBorderOutlined },
  { label: "Написати", href: "/articles/create", icon: EditOutlined },
  { label: "Профіль", href: "/profile", icon: PersonOutlined },
];

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const all = isAdmin
    ? [...items, { label: "Адмін", href: "/admin", icon: AdminPanelSettingsOutlined }]
    : items;

  const isActive = (href: string) =>
    href === "/articles" ? pathname === "/articles" || /^\/articles\/\d+/.test(pathname) : pathname.startsWith(href);

  return (
    <nav
      aria-label="Мобільна навігація"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-rule bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex justify-around">
        {all.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 px-1 py-2 text-[11px] font-medium ${
                  active ? "text-ink" : "text-text-muted"
                }`}
              >
                <item.icon fontSize="small" />
                <span className={active ? "marker" : ""}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
