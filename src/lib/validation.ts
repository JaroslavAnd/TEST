// Валідація даних для StudyHub

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Валідація даних для створення статті
export function validateArticle(data: {
  title?: string;
  content?: string;
  category?: string;
  excerpt?: string;
}): ValidationResult {
  if (!data.title || data.title.trim() === "") {
    return { valid: false, error: "Назва матеріалу є обов'язковою" };
  }

  if (data.title.length > 200) {
    return { valid: false, error: "Назва не може перевищувати 200 символів" };
  }

  if (!data.content || data.content.trim() === "") {
    return { valid: false, error: "Зміст матеріалу є обов'язковим" };
  }

  if (data.content.length > 20000) {
    return { valid: false, error: "Зміст не може перевищувати 20 000 символів" };
  }

  if (!data.category || data.category.trim() === "") {
    return { valid: false, error: "Категорія є обов'язковою" };
  }

  if (data.excerpt !== undefined && data.excerpt.length > 300) {
    return { valid: false, error: "Короткий опис не може перевищувати 300 символів" };
  }

  return { valid: true };
}

// Валідація реєстрації
export function validateRegister(data: {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}): ValidationResult {
  if (!data.name || data.name.trim() === "") {
    return { valid: false, error: "Ім'я є обов'язковим" };
  }

  if (!data.email || data.email.trim() === "") {
    return { valid: false, error: "Email є обов'язковим" };
  }

  // Проста перевірка email формату
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: "Невірний формат email" };
  }

  if (!data.password) {
    return { valid: false, error: "Пароль є обов'язковим" };
  }

  if (data.password.length < 6) {
    return { valid: false, error: "Пароль має бути не менше 6 символів" };
  }

  if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
    return { valid: false, error: "Паролі не збігаються" };
  }

  return { valid: true };
}

// Валідація оновлення профілю
export function validateProfile(data: {
  name?: string;
  age?: number | null;
  bio?: string;
}): ValidationResult {
  if (data.name !== undefined && data.name.trim() === "") {
    return { valid: false, error: "Ім'я не може бути порожнім" };
  }

  if (data.age !== undefined && data.age !== null) {
    if (!Number.isInteger(data.age) || data.age < 1 || data.age > 120) {
      return { valid: false, error: "Вік має бути від 1 до 120" };
    }
  }

  if (data.bio !== undefined && data.bio.length > 500) {
    return { valid: false, error: "Біографія не може перевищувати 500 символів" };
  }

  return { valid: true };
}

// Валідація зміни пароля
export function validatePasswordChange(data: {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}): ValidationResult {
  if (!data.currentPassword) {
    return { valid: false, error: "Введіть поточний пароль" };
  }

  if (!data.newPassword) {
    return { valid: false, error: "Введіть новий пароль" };
  }

  if (data.newPassword.length < 6) {
    return { valid: false, error: "Новий пароль має бути не менше 6 символів" };
  }

  if (data.newPassword !== data.confirmPassword) {
    return { valid: false, error: "Новий пароль і підтвердження не збігаються" };
  }

  return { valid: true };
}

// Допустимі категорії статей
export const ARTICLE_CATEGORIES = [
  "Програмування",
  "Веброзробка",
  "Бази даних",
  "Алгоритми",
  "DevOps",
  "Математика",
  "Фізика",
  "Історія",
  "Мови",
  "Інше",
] as const;

// Перевірка чи категорія допустима
export function isValidCategory(category: string): boolean {
  return (ARTICLE_CATEGORIES as readonly string[]).includes(category);
}

// Парсинг ID з рядка
export function parseArticleId(id: string): number | null {
  const parsed = parseInt(id, 10);
  return isNaN(parsed) || parsed <= 0 ? null : parsed;
}
