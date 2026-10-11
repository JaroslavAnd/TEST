"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Avatar } from "@mui/material";
import { LogoutOutlined, PersonOutlined } from "@mui/icons-material";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "StudyHub";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закриття меню при кліку поза ним
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border text-text-main flex items-center justify-between px-4 md:px-8 flex-shrink-0 transition-all">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-sm group-hover:scale-105 transition-transform duration-200">
          S
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">
            Study<span className="text-primary font-normal">Hub</span>
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        {session?.user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-border"
            >
              <Avatar
                src={session.user.image || undefined}
                alt={session.user.name || "User"}
                sx={{ width: 34, height: 34, fontSize: "0.875rem", bgcolor: "#3b82f6" }}
              >
                {session.user.name?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {session.user.name || "Користувач"}
                </p>
                <p className="text-[11px] text-text-muted leading-tight truncate max-w-[120px]">
                  {session.user.role === "ADMIN" ? "🛡️ Адмін" : "Студент"}
                </p>
              </div>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-border shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-border/60 mb-1">
                  <p className="text-xs font-semibold text-slate-900">{session.user.name}</p>
                  <p className="text-[11px] text-text-muted truncate">{session.user.email}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                >
                  <PersonOutlined fontSize="small" className="text-text-muted" />
                  Мій профіль
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-error hover:bg-red-50/60 transition-colors"
                >
                  <LogoutOutlined fontSize="small" />
                  Вийти з акаунта
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary transition-colors"
            >
              Увійти
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark rounded-xl shadow-sm hover:shadow-md hover:opacity-95 transition-all"
            >
              Реєстрація
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
