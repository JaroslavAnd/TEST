import {
  formatDate,
  generateExcerpt,
  formatAuthorName,
  getInitials,
  truncateText,
  isArticleAuthor,
  canEditArticle,
  readingTimeMinutes,
  pluralize,
} from "@/lib/format";

// ============================
// Форматування дати
// ============================

describe("formatDate", () => {
  it("форматує ISO дату в українському форматі", () => {
    const result = formatDate("2026-01-15T10:00:00Z");
    // Перевіряємо, що повертає рядок з роком
    expect(result).toContain("2026");
  });

  it("повертає оригінальний рядок для невалідної дати", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("обробляє порожній рядок без помилки", () => {
    const result = formatDate("");
    expect(typeof result).toBe("string");
  });
});

// ============================
// Генерація excerpt
// ============================

describe("generateExcerpt", () => {
  it("повертає повний текст якщо він коротший за maxLength", () => {
    expect(generateExcerpt("Короткий текст", 200)).toBe("Короткий текст");
  });

  it("обрізає текст та додає …", () => {
    const longText = "a".repeat(300);
    const result = generateExcerpt(longText, 200);
    expect(result.length).toBeLessThanOrEqual(201); // 200 + "…"
    expect(result).toContain("…");
  });

  it("використовує 200 за замовчуванням", () => {
    const longText = "b".repeat(300);
    const result = generateExcerpt(longText);
    expect(result.length).toBeLessThanOrEqual(201);
  });

  it("повертає порожній рядок для порожнього input", () => {
    expect(generateExcerpt("")).toBe("");
  });

  it("повертає порожній рядок для undefined-like input", () => {
    expect(generateExcerpt("")).toBe("");
  });
});

// ============================
// Форматування імені автора
// ============================

describe("formatAuthorName", () => {
  it("повертає ім'я автора", () => {
    expect(formatAuthorName("Іван Петренко")).toBe("Іван Петренко");
  });

  it("повертає 'Анонімний автор' для null", () => {
    expect(formatAuthorName(null)).toBe("Анонімний автор");
  });

  it("повертає 'Анонімний автор' для undefined", () => {
    expect(formatAuthorName(undefined)).toBe("Анонімний автор");
  });

  it("повертає 'Анонімний автор' для порожнього рядка", () => {
    expect(formatAuthorName("")).toBe("Анонімний автор");
  });
});

// ============================
// Отримання ініціалів
// ============================

describe("getInitials", () => {
  it("повертає дві літери для повного імені", () => {
    expect(getInitials("Іван Петренко")).toBe("ІП");
  });

  it("повертає одну літеру для одного слова", () => {
    expect(getInitials("Іван")).toBe("І");
  });

  it("повертає U для null", () => {
    expect(getInitials(null)).toBe("U");
  });

  it("повертає U для undefined", () => {
    expect(getInitials(undefined)).toBe("U");
  });

  it("повертає великі літери", () => {
    const result = getInitials("john doe");
    expect(result).toBe("JD");
  });
});

// ============================
// Обрізання тексту
// ============================

describe("truncateText", () => {
  it("не обрізає короткий текст", () => {
    expect(truncateText("Hello", 10)).toBe("Hello");
  });

  it("обрізає довгий текст і додає …", () => {
    expect(truncateText("Hello World!", 5)).toBe("Hello…");
  });

  it("не обрізає текст точної довжини", () => {
    expect(truncateText("Hello", 5)).toBe("Hello");
  });
});

// ============================
// Перевірка авторства
// ============================

describe("isArticleAuthor", () => {
  it("повертає true коли userId = authorId", () => {
    expect(isArticleAuthor("user1", "user1")).toBe(true);
  });

  it("повертає false коли userId ≠ authorId", () => {
    expect(isArticleAuthor("user1", "user2")).toBe(false);
  });

  it("повертає false коли userId undefined", () => {
    expect(isArticleAuthor(undefined, "user1")).toBe(false);
  });

  it("повертає false коли authorId null", () => {
    expect(isArticleAuthor("user1", null)).toBe(false);
  });

  it("повертає false коли обидва undefined/null", () => {
    expect(isArticleAuthor(undefined, null)).toBe(false);
  });
});

// ============================
// Право на редагування
// ============================

describe("canEditArticle", () => {
  it("дозволяє автору редагувати свою статтю", () => {
    expect(canEditArticle("user1", "user1")).toBe(true);
  });

  it("забороняє іншому користувачу редагувати", () => {
    expect(canEditArticle("user1", "user2")).toBe(false);
  });

  it("дозволяє адміністратору редагувати будь-яку статтю", () => {
    expect(canEditArticle("admin1", "user2", "ADMIN")).toBe(true);
    expect(canEditArticle("admin1", null, "ADMIN")).toBe(true);
  });

  it("статтю без автора може редагувати лише адміністратор", () => {
    expect(canEditArticle("user1", null)).toBe(false);
    expect(canEditArticle("user1", undefined)).toBe(false);
    expect(canEditArticle("user1", null, "USER")).toBe(false);
  });

  it("забороняє неавторизованому користувачу", () => {
    expect(canEditArticle(undefined, null)).toBe(false);
    expect(canEditArticle(undefined, "user1")).toBe(false);
    expect(canEditArticle(undefined, "user1", "ADMIN")).toBe(false);
  });
});

describe("readingTimeMinutes", () => {
  it("повертає щонайменше 1 хвилину", () => {
    expect(readingTimeMinutes("")).toBe(1);
    expect(readingTimeMinutes("кілька слів")).toBe(1);
  });

  it("округлює вгору за ~180 слів на хвилину", () => {
    expect(readingTimeMinutes("слово ".repeat(180))).toBe(1);
    expect(readingTimeMinutes("слово ".repeat(181))).toBe(2);
    expect(readingTimeMinutes("слово ".repeat(900))).toBe(5);
  });
});

describe("pluralize", () => {
  const forms: [string, string, string] = ["матеріал", "матеріали", "матеріалів"];

  it("вибирає правильну форму для українських числівників", () => {
    expect(pluralize(1, forms)).toBe("матеріал");
    expect(pluralize(2, forms)).toBe("матеріали");
    expect(pluralize(4, forms)).toBe("матеріали");
    expect(pluralize(5, forms)).toBe("матеріалів");
    expect(pluralize(0, forms)).toBe("матеріалів");
  });

  it("обробляє 11–14 та складені числа", () => {
    expect(pluralize(11, forms)).toBe("матеріалів");
    expect(pluralize(14, forms)).toBe("матеріалів");
    expect(pluralize(21, forms)).toBe("матеріал");
    expect(pluralize(22, forms)).toBe("матеріали");
    expect(pluralize(111, forms)).toBe("матеріалів");
  });
});
