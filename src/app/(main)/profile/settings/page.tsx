"use client";

import { useState } from "react";

export default function ProfileSettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Реальне збереження буде в наступних ЛР
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyles =
    "w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-1">Налаштування профілю</h1>
      <p className="text-text-muted mb-6">Оновіть свої персональні дані</p>

      <form
        onSubmit={handleSubmit}
        className="bg-surface rounded-xl border border-border p-5 space-y-4"
      >
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
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1.5">
            Короткий опис
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Розкажіть трохи про себе..."
            rows={3}
            className={`${inputStyles} resize-y`}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          Зберегти зміни
        </button>

        {saved && (
          <p className="text-sm text-success text-center font-medium">
            ✓ Зміни збережено
          </p>
        )}
      </form>
    </div>
  );
}
