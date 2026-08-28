import Link from "next/link";
import { Button } from "@mui/material";

const features = [
  {
    icon: "📚",
    title: "Навчальні матеріали",
    description:
      "Сотні статей з різних тем для студентів та викладачів.",
  },
  {
    icon: "⭐",
    title: "Обране",
    description:
      "Зберігайте корисні матеріали та повертайтесь до них будь-коли.",
  },
  {
    icon: "✍️",
    title: "Створення контенту",
    description:
      "Діліться власними знаннями — публікуйте свої статті.",
  },
  {
    icon: "👤",
    title: "Профіль",
    description:
      "Керуйте своїм обліковим записом та налаштуваннями безпеки.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-secondary to-primary-dark text-white px-4 py-20 md:py-28">
        <div className="text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
            <span className="text-sm font-medium">🎓 Навчальна платформа</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Study<span className="text-primary-light">Hub</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
            Зручна платформа для публікації, читання та збереження навчальних
            матеріалів. Розширюйте свої знання разом з нами.
          </p>
          <Link href="/articles">
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#2563eb",
                borderRadius: "0.75rem",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                "&:hover": { backgroundColor: "#1d4ed8" },
              }}
            >
              Переглянути матеріали
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            Можливості платформи
          </h2>
          <p className="text-text-muted text-center mb-10 max-w-xl mx-auto">
            StudyHub допомагає ефективно навчатися та ділитися знаннями
          </p>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-surface rounded-xl border border-border p-5 text-center hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-base font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-text-muted">
        © 2026 StudyHub. Лабораторна робота №2.
      </footer>
    </div>
  );
}
