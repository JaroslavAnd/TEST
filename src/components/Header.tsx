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
    <header className="h-16 bg-secondary text-white flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-sm font-bold">
          S
        </div>
        <span className="text-lg font-bold tracking-tight">{appName}</span>
      </Link>

      <div className="flex items-center gap-3">
        {session?.user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar
                src={session.user.image || undefined}
                alt={session.user.name || "User"}
                sx={{ width: 32, height: 32, fontSize: "0.875rem" }}
              >
                {session.user.name?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">
                {session.user.name || session.user.email}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-lg border border-border shadow-lg py-1 z-50">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-main hover:bg-gray-50 transition-colors"
                >
                  <PersonOutlined fontSize="small" className="text-text-muted" />
                  Профіль
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-gray-50 transition-colors"
                >
                  <LogoutOutlined fontSize="small" />
                  Вийти
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-1.5 text-sm font-medium bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            Увійти
          </Link>
        )}
      </div>
    </header>
  );
}
