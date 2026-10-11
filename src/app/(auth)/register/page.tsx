"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Паролі не збігаються");
      return;
    }

    if (password.length < 6) {
      setError("Пароль має бути не менше 6 символів");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Помилка реєстрації");
      }

      // Автоматичний вхід після реєстрації
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Реєстрація пройшла, але автовхід не спрацював
        router.push("/login");
      } else {
        router.push("/articles");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка реєстрації");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-lg font-bold text-white">
            S
          </div>
          <span className="text-2xl font-bold text-white">StudyHub</span>
        </div>
        <h1 className="text-xl font-semibold text-white/90">
          Створити акаунт
        </h1>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              Ім&apos;я
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше ім'я"
              required
              className={inputStyles}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className={inputStyles}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1.5"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Мінімум 6 символів"
              required
              className={inputStyles}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1.5"
            >
              Підтвердження пароля
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторіть пароль"
              required
              className={inputStyles}
            />
          </div>

          {error && (
            <p className="text-sm text-error text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Реєстрація..." : "Зареєструватися"}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Вже маєте акаунт?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:text-primary-dark transition-colors"
          >
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}
