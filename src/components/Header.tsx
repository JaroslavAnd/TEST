"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Avatar from "@/components/Avatar";
import Logo from "@/components/Logo";

const links = [
  { label: "Матеріали", href: "/articles", match: (p: string) => p === "/articles" || /^\/articles\/\d+/.test(p) },
  { label: "Обране", href: "/articles/favorite", match: (p: string) => p.startsWith("/articles/favorite") },
];

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isAdmin = session?.user?.role === "ADMIN";

  // Закриття меню при кліку поза ним або за Escape
  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const menuItem =
    "block w-full px-4 py-2 text-left text-sm text-text-main hover:bg-slate-50";

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 md:px-8">
        <Logo />

        <nav aria-label="Основна навігація" className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className="rounded-md px-3 py-2 text-sm font-medium text-text-muted hover:text-ink aria-[current=page]:text-text-main"
              >
                <span className={active ? "marker" : ""}>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {session?.user ? (
            <>
              <Link href="/articles/create" className="btn btn-primary btn-sm hidden sm:inline-flex">
                Написати статтю
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label="Меню акаунта"
                  className="flex items-center gap-2 rounded-full border border-transparent p-1 pr-2 hover:border-rule"
                >
                  <Avatar name={session.user.name} image={session.user.image} size={32} />
                  <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:block">
                    {session.user.name || "Користувач"}
                  </span>
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-lg border border-rule bg-surface py-1 shadow-lg"
                  >
                    <div className="border-b border-rule px-4 py-3">
                      <p className="truncate text-sm font-semibold">{session.user.name}</p>
                      <p className="truncate text-xs text-text-muted">{session.user.email}</p>
                      {isAdmin && (
                        <p className="mt-1.5 inline-block rounded bg-marker-soft px-1.5 py-0.5 text-xs font-semibold text-text-main">
                          Адміністратор
                        </p>
                      )}
                    </div>
                    <Link role="menuitem" href="/profile" onClick={() => setMenuOpen(false)} className={menuItem}>
                      Профіль
                    </Link>
                    <Link role="menuitem" href="/profile/security" onClick={() => setMenuOpen(false)} className={menuItem}>
                      Безпека
                    </Link>
                    {isAdmin && (
                      <Link role="menuitem" href="/admin" onClick={() => setMenuOpen(false)} className={menuItem}>
                        Адмін-панель
                      </Link>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className={`${menuItem} border-t border-rule text-margin`}
                    >
                      Вийти
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary btn-sm">
                Увійти
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm hidden sm:inline-flex">
                Реєстрація
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
