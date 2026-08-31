import { test, expect } from "@playwright/test";

test.describe("Сторінка статей", () => {
  test("відкривається та показує заголовок", async ({ page }) => {
    await page.goto("/articles");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Навчальні матеріали"
    );
  });

  test("відображає список статей", async ({ page }) => {
    await page.goto("/articles");

    // Чекаємо поки завантажиться хоча б одна стаття
    // Кожна стаття має посилання "Переглянути →"
    const articleLinks = page.getByText("Переглянути →");
    await expect(articleLinks.first()).toBeVisible({ timeout: 10000 });

    // Має бути хоча б 1 стаття
    const count = await articleLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("стаття має категорію", async ({ page }) => {
    await page.goto("/articles");

    // Чекаємо завантаження
    await expect(page.getByText("Переглянути →").first()).toBeVisible({
      timeout: 10000,
    });

    // Категорії відображаються
    const categories = [
      "Програмування",
      "Веброзробка",
      "Бази даних",
      "Алгоритми",
      "DevOps",
    ];

    let foundCategory = false;
    for (const cat of categories) {
      const element = page.getByText(cat).first();
      if ((await element.count()) > 0) {
        foundCategory = true;
        break;
      }
    }
    expect(foundCategory).toBe(true);
  });

  test("можна перейти на сторінку статті", async ({ page }) => {
    await page.goto("/articles");

    // Чекаємо завантаження
    await expect(page.getByText("Переглянути →").first()).toBeVisible({
      timeout: 10000,
    });

    // Клікнути на першу статтю
    await page.getByText("Переглянути →").first().click();

    // Має перейти на /articles/[id]
    await expect(page).toHaveURL(/\/articles\/\d+/);
  });
});
