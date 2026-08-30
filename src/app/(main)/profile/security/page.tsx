"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Snackbar, Alert } from "@mui/material";

export default function SecurityPage() {
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPassword() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setHasPassword(data.hasPassword);
        }
      } catch {
        // Ігноруємо помилку — покажемо форму за замовчуванням
        setHasPassword(true);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      checkPassword();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Новий пароль і підтвердження не збігаються");
      return;
    }

    if (newPassword.length < 6) {
      setError("Пароль має бути не менше 6 символів");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Помилка зміни пароля");
      }

      setShowSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка зміни пароля");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl animate-pulse">
        <div className="h-8 w-32 bg-border rounded mb-2" />
        <div className="h-5 w-48 bg-border rounded mb-6" />
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 w-32 bg-border rounded mb-1.5" />
              <div className="h-10 w-full bg-border rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const inputStyles =
    "w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

  // OAuth-користувач без локального пароля
  if (hasPassword === false) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-1">Безпека</h1>
        <p className="text-text-muted mb-6">Керування паролем</p>

        <div className="bg-surface rounded-xl border border-border p-5 text-center">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="text-lg font-semibold mb-2">
            Пароль не встановлено
          </h2>
          <p className="text-sm text-text-muted">
            Ви увійшли через OAuth-провайдер (Google або GitHub).
            <br />
            Локальний пароль не використовується для вашого акаунту.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-1">Безпека</h1>
      <p className="text-text-muted mb-6">Змініть свій пароль</p>

      <form
        onSubmit={handleSubmit}
        className="bg-surface rounded-xl border border-border p-5 space-y-4"
      >
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium mb-1.5"
          >
            Поточний пароль
          </label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Введіть поточний пароль"
            required
            className={inputStyles}
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium mb-1.5"
          >
            Новий пароль
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
            Підтвердження нового пароля
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Повторіть новий пароль"
            required
            className={inputStyles}
          />
        </div>

        {error && (
          <p className="text-sm text-error text-center font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Збереження..." : "Змінити пароль"}
        </button>
      </form>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Пароль успішно змінено!
        </Alert>
      </Snackbar>
    </div>
  );
}
