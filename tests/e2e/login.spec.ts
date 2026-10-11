import { test, expect } from "@playwright/test";

test.describe("Login flow", () => {
  test("сторінка login відкривається", async ({ page }) => {
    await page.goto("/login");

    // Заголовок "Вхід в акаунт"
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Вхід"
    );
  });

  test("містить поле email", async ({ page }) => {
    await page.goto("/login");

    const emailInput = page.getByLabel("Email");
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute("type", "email");
  });

  test("містить поле password", async ({ page }) => {
    await page.goto("/login");

    const passwordInput = page.getByLabel("Пароль");
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("містить кнопку входу", async ({ page }) => {
    await page.goto("/login");

    const loginButton = page.getByRole("button", { name: "Увійти", exact: true });
    await expect(loginButton).toBeVisible();
  });

  test("містить кнопки OAuth", async ({ page }) => {
    await page.goto("/login");

    // Кнопки Google та GitHub
    await expect(page.getByText(/Google/i)).toBeVisible();
    await expect(page.getByText(/GitHub/i)).toBeVisible();
  });

  test("містить посилання на реєстрацію", async ({ page }) => {
    await page.goto("/login");

    const registerLink = page.getByRole("link", { name: /зареєструватися/i });
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute("href", "/register");
  });

  test("можна заповнити форму", async ({ page }) => {
    await page.goto("/login");

    // Заповнити поля
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Пароль").fill("password123");

    // Перевірити значення
    await expect(page.getByLabel("Email")).toHaveValue("test@example.com");
    await expect(page.getByLabel("Пароль")).toHaveValue("password123");
  });
});
