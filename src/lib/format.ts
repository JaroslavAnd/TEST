// Форматування даних для StudyHub

// Форматування дати у вигляді "1 січня 2026"
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

// Генерація excerpt з content
export function generateExcerpt(content: string, maxLength: number = 200): string {
  if (!content) return "";
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trimEnd() + "…";
}

// Форматування імені автора (перша літера великою)
export function formatAuthorName(name: string | null | undefined): string {
  if (!name) return "Анонімний автор";
  return name;
}

// Отримання ініціалів для аватара
export function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

// Обрізання тексту для UI
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

// Перевірка чи є поточний користувач автором
export function isArticleAuthor(
  userId: string | undefined,
  authorId: string | null | undefined
): boolean {
  if (!userId) return false;
  if (!authorId) return false;
  return userId === authorId;
}

// Чи можна редагувати/видаляти статтю:
// автор — свою, адміністратор — будь-яку.
// Стаття без автора (залишок старих даних) доступна лише адміністратору.
export function canEditArticle(
  userId: string | undefined,
  authorId: string | null | undefined,
  role?: string
): boolean {
  if (!userId) return false;
  if (role === "ADMIN") return true;
  if (!authorId) return false;
  return userId === authorId;
}

// Час читання в хвилинах (≈180 слів/хв для українського тексту)
export function readingTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

// Українська множина: pluralize(2, ["матеріал", "матеріали", "матеріалів"])
export function pluralize(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (last === 1) return forms[0];
  if (last >= 2 && last <= 4) return forms[1];
  return forms[2];
}
