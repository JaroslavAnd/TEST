import { test, expect } from "@playwright/test";

test.describe("Головна сторінка", () => {
  test("відкривається та містить StudyHub у заголовку", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("StudyHub");
  });

  test("містить кнопку переходу до матеріалів", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Читати матеріали" })).toBeVisible();
  });

  test("навігація до статей працює", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Читати матеріали" }).click();
    await expect(page).toHaveURL(/\/articles/);
  });

  test("показує блок «Нове в зошиті» із засіяними статтями", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Нове в зошиті" })).toBeVisible();
    await expect(page.getByRole("link", { name: /REST API/ }).first()).toBeVisible();
  });

  test("містить footer зі StudyHub", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toContainText("StudyHub");
  });
});
