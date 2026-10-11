import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, pluralize } from "@/lib/format";

// Головна — серверний компонент: дані беремо з Prisma напряму, без fetch до власного API
export const dynamic = "force-dynamic";

async function getHomeData() {
  try {
    const [latest, byCategory, total] = await Promise.all([
      prisma.article.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, category: true, createdAt: true },
      }),
      prisma.article.groupBy({
        by: ["category"],
        _count: { _all: true },
        orderBy: { _count: { category: "desc" } },
      }),
      prisma.article.count(),
    ]);
    return { latest, byCategory, total };
  } catch {
    // Якщо БД недоступна, головна все одно відкривається
    return { latest: [], byCategory: [], total: 0 };
  }
}

const abilities = [
  {
    title: "Шукайте за темою",
    text: "Фільтруйте матеріали за категоріями або шукайте за словом із заголовка чи тексту. Посилання на результат можна надіслати одногрупнику.",
  },
  {
    title: "Обговорюйте в коментарях",
    text: "Під кожною статтею є коментарі. Поставте запитання автору або доповніть матеріал власним прикладом.",
  },
  {
    title: "Публікуйте своє",
    text: "Зареєструйтеся, напишіть конспект чи розбір теми й редагуйте його будь-коли. Адміністратор стежить за порядком.",
  },
];

export default async function HomePage() {
  const { latest, byCategory, total } = await getHomeData();

  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 pb-16 pt-12 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-20">
        <div>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            StudyHub&nbsp;—&nbsp;спільний зошит для&nbsp;всіх, хто&nbsp;вчиться
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-muted">
            Читайте конспекти й розбори від одногрупників, знаходьте потрібну тему за хвилину та діліться власними
            матеріалами.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/articles" className="btn btn-primary px-6 py-3">
              Читати матеріали
            </Link>
            <Link href="/articles/create" className="btn btn-secondary px-6 py-3">
              Написати статтю
            </Link>
          </div>
          {total > 0 && (
            <p className="mt-6 text-sm text-text-muted">
              У зошиті вже {total} {pluralize(total, ["матеріал", "матеріали", "матеріалів"])}.
            </p>
          )}
        </div>

        <div className="sheet sheet-margin px-5 py-6 pl-14 shadow-[6px_6px_0_0_var(--color-rule)] sm:pl-20">
          <h2 className="mb-2 text-lg font-bold">Нове в зошиті</h2>
          {latest.length === 0 ? (
            <p className="py-6 text-sm text-text-muted">
              Матеріалів поки немає. Станьте першим, хто додасть статтю.
            </p>
          ) : (
            <ul className="divide-y divide-rule">
              {latest.map((a) => (
                <li key={a.id}>
                  <Link href={`/articles/${a.id}`} className="group block py-3.5">
                    <span className="marker-hover text-base font-semibold leading-snug">{a.title}</span>
                    <span className="mt-1 flex gap-4 text-xs text-text-muted">
                      <span>{a.category}</span>
                      <time dateTime={a.createdAt.toISOString()}>{formatDate(a.createdAt.toISOString())}</time>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {byCategory.length > 0 && (
        <section className="border-y border-rule bg-surface">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">Теми</h2>
            <ul className="mt-6 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {byCategory.map((c) => (
                <li key={c.category} className="border-b border-rule">
                  <Link
                    href={`/articles?category=${encodeURIComponent(c.category)}`}
                    className="group flex items-baseline justify-between py-3.5"
                  >
                    <span className="marker-hover font-semibold">{c.category}</span>
                    <span className="text-sm text-text-muted">
                      {c._count._all} {pluralize(c._count._all, ["стаття", "статті", "статей"])}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 lg:py-20">
        <h2 className="max-w-xl text-2xl font-bold sm:text-3xl">Що можна робити на платформі</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
          {abilities.map((item) => (
            <div key={item.title} className="border-t-2 border-ink pt-4">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
