"use client";

import { useState } from "react";

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
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

    // Реальне збереження буде в наступних ЛР
    setSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyles =
    "w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

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
            placeholder="Введіть новий пароль"
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
          className="w-full py-2.5 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          Змінити пароль
        </button>

        {saved && (
          <p className="text-sm text-success text-center font-medium">
            ✓ Пароль змінено
          </p>
        )}
      </form>
    </div>
  );
}
