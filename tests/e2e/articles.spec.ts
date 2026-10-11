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
    // Заголовок кожної картки — посилання на статтю
    const articleLinks = page.locator('article a[href^="/articles/"]');
    await expect(articleLinks.first()).toBeVisible({ timeout: 10000 });

    // Має бути хоча б 1 стаття
    const count = await articleLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("стаття має категорію", async ({ page }) => {
    await page.goto("/articles");

    // Чекаємо завантаження
    await expect(page.locator('article a[href^="/articles/"]').first()).toBeVisible({
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
    await expect(page.locator('article a[href^="/articles/"]').first()).toBeVisible({
      timeout: 10000,
    });

    // Клікнути на першу статтю
    await page.locator('article a[href^="/articles/"]').first().click();

    // Має перейти на /articles/[id]
    await expect(page).toHaveURL(/\/articles\/\d+/);
  });
});

test.describe("Пошук, фільтри та пагінація", () => {
  test("фільтр за темою зберігається в URL", async ({ page }) => {
    await page.goto("/articles");
    await page.getByRole("button", { name: "DevOps" }).click();
    await expect(page).toHaveURL(/category=DevOps/);
    await expect(page.getByText(/Знайдено \d+ матеріал/)).toBeVisible();
  });

  test("пошук знаходить статтю за словом із заголовка", async ({ page }) => {
    await page.goto("/articles");
    await page.getByRole("searchbox", { name: "Пошук матеріалів" }).fill("Docker");
    await expect(page).toHaveURL(/q=Docker/);
    await expect(page.getByRole("link", { name: /Docker для розробників/ })).toBeVisible();
  });

  test("друга сторінка не скидається на першу (регресія)", async ({ page }) => {
    await page.goto("/articles");
    await page.getByRole("button", { name: "Сторінка 2" }).click();
    await expect(page).toHaveURL(/page=2/);
    // Раніше debounce у SearchBar через ~400мс повертав page=1
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/page=2/);
  });
});
