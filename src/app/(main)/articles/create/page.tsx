"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Snackbar, Alert } from "@mui/material";

const categories = [
  "Програмування",
  "Веброзробка",
  "Бази даних",
  "Алгоритми",
  "DevOps",
  "Математика",
  "Фізика",
  "Історія",
  "Мови",
  "Інше",
];

export default function CreateArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, excerpt, category }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Помилка створення");
      }

      setShowSuccess(true);
      setTitle("");
      setContent("");
      setExcerpt("");
      setCategory("");

      // Перенаправити до списку через 2 секунди
      setTimeout(() => router.push("/articles"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка створення");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyles =
    "w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-1">Створити матеріал</h1>
      <p className="text-text-muted mb-6">
        Заповніть форму для публікації нової статті
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-surface rounded-xl border border-border p-5 space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1.5">
            Назва матеріалу
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введіть назву..."
            required
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-1.5">
            Короткий опис
          </label>
          <input
            id="excerpt"
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Опишіть матеріал коротко..."
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1.5">
            Зміст
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Повний текст матеріалу..."
            required
            rows={6}
            className={`${inputStyles} resize-y`}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1.5">
            Категорія
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={inputStyles}
          >
            <option value="" disabled>Оберіть категорію</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-error text-center font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {submitting ? "Створення..." : "Створити матеріал"}
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
          Матеріал успішно створено! Перенаправлення до списку...
        </Alert>
      </Snackbar>
    </div>
  );
}
