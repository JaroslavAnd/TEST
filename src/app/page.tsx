import Link from "next/link";

const features = [
  {
    icon: "📚",
    title: "Навчальні матеріали",
    description: "Сотні структурованих статей, лекцій та конспектів для зручного навчання.",
    tag: "База знань",
  },
  {
    icon: "🔍",
    title: "Розумний пошук",
    description: "Миттєвий повнотекстовий пошук за ключовими словами та фільтри за категоріями.",
    tag: "Фільтри",
  },
  {
    icon: "💬",
    title: "Інтерактивні коментарі",
    description: "Обговорюйте прочитане, ставте запитання авторам та діліться власним досвідом.",
    tag: "Спільнота",
  },
  {
    icon: "🛡️",
    title: "Панель модерації",
    description: "Повноцінна система ролей для контролю контенту, авторів та безпеки.",
    tag: "RBAC Адмін",
  },
];

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
              Освітній портал нового покоління
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
            Платформа для обміну{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              академічними знаннями
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Публікуйте конспекти, читайте фахові статті, беріть участь у дискусіях та систематизуйте свої знання разом із StudyHub.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/articles"
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Переглянути матеріали →
            </Link>
            <Link
              href="/articles/create"
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all"
            >
              Опублікувати статтю
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 pb-20 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Можливості StudyHub
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
            Сучасний стек інструментів для навчання, авторства та адміністрування.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-2.5 bg-slate-50 rounded-xl border border-slate-100 inline-block">
                    {item.icon}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700 mb-1">StudyHub Education</p>
        <p>© 2026 StudyHub. Курсова робота з дисципліни «Фулл-стек розробка».</p>
      </footer>
    </div>
  );
}
