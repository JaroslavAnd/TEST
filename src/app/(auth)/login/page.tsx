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
    "field";

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Вхід в акаунт</h1>
        <p className="mt-2 text-text-muted">Увійдіть, щоб писати статті й коментувати.</p>
      </div>

      <div className="sheet p-6 sm:p-7">
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
            className="btn btn-primary w-full"
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
            className="btn btn-secondary w-full"
          >
            <Google fontSize="small" />
            Увійти через Google
          </button>

          <button
            onClick={() => handleOAuth("github")}
            className="btn btn-secondary w-full"
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
