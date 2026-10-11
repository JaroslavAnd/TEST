"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArticleOutlined,
  BookmarkBorderOutlined,
  PersonOutlined,
  SecurityOutlined,
  AdminPanelSettingsOutlined,
} from "@mui/icons-material";
import styles from "./Navigation.module.css";

const navItems = [
  {
    label: "Статті",
    href: "/articles",
    icon: ArticleOutlined,
    section: "articles",
  },
  {
    label: "Обране",
    href: "/articles/favorite",
    icon: BookmarkBorderOutlined,
    section: "articles",
  },
  {
    label: "Профіль",
    href: "/profile",
    icon: PersonOutlined,
    section: "profile",
  },
  {
    label: "Безпека",
    href: "/profile/security",
    icon: SecurityOutlined,
    section: "profile",
  },
  {
    label: "Адмін-панель",
    href: "/admin",
    icon: AdminPanelSettingsOutlined,
    section: "admin",
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";

  const isActive = (href: string) => {
    if (href === "/articles") {
      return pathname === "/articles";
    }
    if (href === "/profile") {
      return pathname === "/profile";
    }
    if (href === "/admin") {
      return pathname === "/admin" || pathname.startsWith("/admin/");
    }
    return pathname.startsWith(href);
  };

  const visibleNavItems = navItems.filter((item) => {
    if (item.section === "admin") {
      return isAdmin;
    }
    return true;
  });

  const articleItems = visibleNavItems.filter((item) => item.section === "articles");
  const profileItems = visibleNavItems.filter((item) => item.section === "profile");
  const adminItems = visibleNavItems.filter((item) => item.section === "admin");

  return (
    <>
      {/* Десктопна бічна навігація */}
      <nav className={styles.sidebar}>
        <p className={styles.sectionTitle}>Навчальні матеріали</p>
        <ul className={styles.navList}>
          {articleItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.navItem} ${
                  isActive(item.href) ? styles.navItemActive : ""
                }`}
              >
                <item.icon fontSize="small" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className={styles.sectionTitle}>Профіль</p>
        <ul className={styles.navList}>
          {profileItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.navItem} ${
                  isActive(item.href) ? styles.navItemActive : ""
                }`}
              >
                <item.icon fontSize="small" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {isAdmin && adminItems.length > 0 && (
          <>
            <p className={styles.sectionTitle}>Адміністрування</p>
            <ul className={styles.navList}>
              {adminItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.navItem} ${
                      isActive(item.href) ? styles.navItemActive : ""
                    }`}
                  >
                    <item.icon fontSize="small" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* Мобільна нижня навігація */}
      <nav className={styles.mobileNav}>
        <ul className={styles.mobileNavList}>
          {visibleNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.mobileNavItem} ${
                  isActive(item.href) ? styles.mobileNavItemActive : ""
                }`}
              >
                <item.icon fontSize="small" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
