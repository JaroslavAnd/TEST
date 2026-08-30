"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArticleOutlined,
  BookmarkBorderOutlined,
  PersonOutlined,
  SecurityOutlined,
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
];

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/articles") {
      return pathname === "/articles";
    }
    if (href === "/profile") {
      return pathname === "/profile";
    }
    return pathname.startsWith(href);
  };

  const articleItems = navItems.filter((item) => item.section === "articles");
  const profileItems = navItems.filter((item) => item.section === "profile");

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
      </nav>

      {/* Мобільна нижня навігація */}
      <nav className={styles.mobileNav}>
        <ul className={styles.mobileNavList}>
          {navItems.map((item) => (
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
