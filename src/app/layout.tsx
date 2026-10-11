import type { Metadata } from "next";
import { Onest, Literata } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin", "cyrillic"],
  variable: "--font-literata",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StudyHub — спільний зошит для всіх, хто вчиться",
    template: "%s — StudyHub",
  },
  description:
    "Вебплатформа для публікації та читання навчальних матеріалів: статті за темами, пошук, коментарі та власні конспекти.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${onest.variable} ${literata.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <SessionProvider>
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
