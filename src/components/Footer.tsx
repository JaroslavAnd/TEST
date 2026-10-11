import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-rule bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p>
          <span className="font-semibold text-text-main">StudyHub</span> — спільний зошит для всіх, хто вчиться.
        </p>
        <nav aria-label="Нижня навігація" className="flex gap-5">
          <Link href="/articles" className="hover:text-ink">Матеріали</Link>
          <Link href="/articles/create" className="hover:text-ink">Написати статтю</Link>
          <Link href="/login" className="hover:text-ink">Вхід</Link>
        </nav>
      </div>
    </footer>
  );
}
