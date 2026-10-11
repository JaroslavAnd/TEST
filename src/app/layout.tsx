import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StudyHub — навчальна платформа",
  description:
    "Вебплатформа для публікації та читання навчальних матеріалів. Переглядайте статті, зберігайте обране та створюйте власні матеріали.",
};

import Header from "@/components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <SessionProvider>
          <Header />
          <div className="flex-1 flex flex-col">{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
