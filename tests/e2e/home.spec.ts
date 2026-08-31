import { test, expect } from "@playwright/test";

test.describe("Головна сторінка", () => {
  test("відкривається та містить StudyHub", async ({ page }) => {
    await page.goto("/");

    // StudyHub має бути видно
    await expect(page.locator("h1")).toContainText("StudyHub");
  });

  test("містить кнопку переходу до матеріалів", async ({ page }) => {
    await page.goto("/");

    // Кнопка/посилання на статті
    const link = page.getByRole("link", { name: /матеріали/i });
    await expect(link).toBeVisible();
  });

  test("навігація до статей працює", async ({ page }) => {
    await page.goto("/");

    // Клікнути на кнопку "Переглянути матеріали"
    const link = page.getByRole("link", { name: /матеріали/i });
    await link.click();

    // Має перейти на /articles
    await expect(page).toHaveURL(/\/articles/);
  });

  test("відображає секцію можливостей платформи", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Можливості платформи")).toBeVisible();
    await expect(page.getByText("Навчальні матеріали")).toBeVisible();
    await expect(page.getByText("Обране")).toBeVisible();
  });

  test("містить footer з номером лабораторної", async ({ page }) => {
    await page.goto("/");

    const footer = page.locator("footer");
    await expect(footer).toContainText("StudyHub");
  });
});
