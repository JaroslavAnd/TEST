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

// Чи можна редагувати статтю
export function canEditArticle(
  userId: string | undefined,
  authorId: string | null | undefined
): boolean {
  if (!userId) return false;
  // Статті без автора можуть редагувати всі авторизовані
  if (!authorId) return true;
  return userId === authorId;
}
