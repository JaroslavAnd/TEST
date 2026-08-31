import {
  validateArticle,
  validateRegister,
  validateProfile,
  validatePasswordChange,
  isValidCategory,
  parseArticleId,
  ARTICLE_CATEGORIES,
} from "@/lib/validation";

// ============================
// Валідація статей
// ============================

describe("validateArticle", () => {
  it("повертає valid=true для коректних даних", () => {
    const result = validateArticle({
      title: "TypeScript Basics",
      content: "Стаття про TypeScript...",
      category: "Програмування",
    });
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("повертає помилку коли title порожній", () => {
    const result = validateArticle({
      title: "",
      content: "Контент",
      category: "Програмування",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Назва");
  });

  it("повертає помилку коли title тільки пробіли", () => {
    const result = validateArticle({
      title: "   ",
      content: "Контент",
      category: "Програмування",
    });
    expect(result.valid).toBe(false);
  });

  it("повертає помилку коли title відсутній", () => {
    const result = validateArticle({
      content: "Контент",
      category: "Програмування",
    });
    expect(result.valid).toBe(false);
  });

  it("повертає помилку коли title занадто довгий", () => {
    const result = validateArticle({
      title: "a".repeat(201),
      content: "Контент",
      category: "Програмування",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("200");
  });

  it("повертає помилку коли content порожній", () => {
    const result = validateArticle({
      title: "Заголовок",
      content: "",
      category: "Програмування",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Зміст");
  });

  it("повертає помилку коли content відсутній", () => {
    const result = validateArticle({
      title: "Заголовок",
      category: "Програмування",
    });
    expect(result.valid).toBe(false);
  });

  it("повертає помилку коли category порожня", () => {
    const result = validateArticle({
      title: "Заголовок",
      content: "Контент",
      category: "",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Категорія");
  });

  it("повертає помилку коли category відсутня", () => {
    const result = validateArticle({
      title: "Заголовок",
      content: "Контент",
    });
    expect(result.valid).toBe(false);
  });
});

// ============================
// Валідація реєстрації
// ============================

describe("validateRegister", () => {
  it("повертає valid=true для коректних даних", () => {
    const result = validateRegister({
      name: "Тест",
      email: "test@example.com",
      password: "password123",
    });
    expect(result.valid).toBe(true);
  });

  it("повертає valid=true коли паролі збігаються", () => {
    const result = validateRegister({
      name: "Тест",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.valid).toBe(true);
  });

  it("повертає помилку коли name порожнє", () => {
    const result = validateRegister({
      name: "",
      email: "test@example.com",
      password: "password123",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Ім'я");
  });

  it("повертає помилку коли email порожній", () => {
    const result = validateRegister({
      name: "Тест",
      email: "",
      password: "password123",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Email");
  });

  it("повертає помилку для невалідного email", () => {
    const result = validateRegister({
      name: "Тест",
      email: "not-an-email",
      password: "password123",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("формат");
  });

  it("повертає помилку коли пароль відсутній", () => {
    const result = validateRegister({
      name: "Тест",
      email: "test@example.com",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Пароль");
  });

  it("повертає помилку коли пароль занадто короткий", () => {
    const result = validateRegister({
      name: "Тест",
      email: "test@example.com",
      password: "12345",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("6");
  });

  it("повертає помилку коли паролі не збігаються", () => {
    const result = validateRegister({
      name: "Тест",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "different",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("збігаються");
  });
});

// ============================
// Валідація профілю
// ============================

describe("validateProfile", () => {
  it("повертає valid=true для коректних даних", () => {
    const result = validateProfile({
      name: "Нове ім'я",
      age: 25,
      bio: "Про себе",
    });
    expect(result.valid).toBe(true);
  });

  it("повертає valid=true без жодного поля", () => {
    const result = validateProfile({});
    expect(result.valid).toBe(true);
  });

  it("повертає помилку коли name порожній рядок", () => {
    const result = validateProfile({ name: "" });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Ім'я");
  });

  it("повертає помилку коли вік менше 1", () => {
    const result = validateProfile({ age: 0 });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Вік");
  });

  it("повертає помилку коли вік більше 120", () => {
    const result = validateProfile({ age: 121 });
    expect(result.valid).toBe(false);
  });

  it("дозволяє age = null", () => {
    const result = validateProfile({ age: null });
    expect(result.valid).toBe(true);
  });

  it("повертає помилку коли bio занадто довге", () => {
    const result = validateProfile({ bio: "x".repeat(501) });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("500");
  });
});

// ============================
// Валідація зміни пароля
// ============================

describe("validatePasswordChange", () => {
  it("повертає valid=true для коректних даних", () => {
    const result = validatePasswordChange({
      currentPassword: "old123",
      newPassword: "new123",
      confirmPassword: "new123",
    });
    expect(result.valid).toBe(true);
  });

  it("повертає помилку без поточного пароля", () => {
    const result = validatePasswordChange({
      newPassword: "new123",
      confirmPassword: "new123",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("поточний");
  });

  it("повертає помилку без нового пароля", () => {
    const result = validatePasswordChange({
      currentPassword: "old123",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("новий");
  });

  it("повертає помилку коли новий пароль занадто короткий", () => {
    const result = validatePasswordChange({
      currentPassword: "old123",
      newPassword: "ab",
      confirmPassword: "ab",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("6");
  });

  it("повертає помилку коли паролі не збігаються", () => {
    const result = validatePasswordChange({
      currentPassword: "old123",
      newPassword: "new123",
      confirmPassword: "different",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("збігаються");
  });
});

// ============================
// Перевірка категорій
// ============================

describe("isValidCategory", () => {
  it("повертає true для існуючої категорії", () => {
    expect(isValidCategory("Програмування")).toBe(true);
    expect(isValidCategory("Веброзробка")).toBe(true);
    expect(isValidCategory("DevOps")).toBe(true);
  });

  it("повертає false для неіснуючої категорії", () => {
    expect(isValidCategory("Неіснуюча")).toBe(false);
    expect(isValidCategory("")).toBe(false);
  });
});

describe("ARTICLE_CATEGORIES", () => {
  it("містить 10 категорій", () => {
    expect(ARTICLE_CATEGORIES).toHaveLength(10);
  });

  it("починається з Програмування", () => {
    expect(ARTICLE_CATEGORIES[0]).toBe("Програмування");
  });

  it("закінчується на Інше", () => {
    expect(ARTICLE_CATEGORIES[ARTICLE_CATEGORIES.length - 1]).toBe("Інше");
  });
});

// ============================
// Парсинг ID
// ============================

describe("parseArticleId", () => {
  it("повертає число для валідного ID", () => {
    expect(parseArticleId("1")).toBe(1);
    expect(parseArticleId("42")).toBe(42);
    expect(parseArticleId("100")).toBe(100);
  });

  it("повертає null для невалідного ID", () => {
    expect(parseArticleId("abc")).toBeNull();
    expect(parseArticleId("")).toBeNull();
    expect(parseArticleId("0")).toBeNull();
    expect(parseArticleId("-1")).toBeNull();
  });

  it("повертає число для рядка з провідним нулем", () => {
    expect(parseArticleId("01")).toBe(1);
  });
});
