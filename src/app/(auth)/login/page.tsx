"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Google, GitHub } from "@mui/icons-material";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Невірний email або пароль");
      } else {
        router.push("/articles");
        router.refresh();
      }
    } catch {
      setError("Помилка входу. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    signIn(provider, { callbackUrl: "/articles" });
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
        <h1 className="text-xl font-semibold text-white/90">Вхід в акаунт</h1>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Введіть пароль"
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
            {loading ? "Вхід..." : "Увійти"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface px-2 text-text-muted">або</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleOAuth("google")}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Google fontSize="small" />
            Увійти через Google
          </button>

          <button
            onClick={() => handleOAuth("github")}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <GitHub fontSize="small" />
            Увійти через GitHub
          </button>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Немає акаунту?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:text-primary-dark transition-colors"
          >
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
}
