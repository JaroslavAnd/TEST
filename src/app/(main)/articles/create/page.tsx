"use client";

import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const categories = [
  "Програмування",
  "Математика",
  "Фізика",
  "Історія",
  "Мови",
  "Інше",
];

export default function CreateArticlePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Реальне збереження буде в ЛР2
    setShowSuccess(true);
    setTitle("");
    setContent("");
    setCategory("");
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
          <label htmlFor="content" className="block text-sm font-medium mb-1.5">
            Зміст
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Опишіть матеріал..."
            required
            rows={6}
            className={`${inputStyles} resize-y`}
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium mb-1.5"
          >
            Категорія
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={inputStyles}
          >
            <option value="" disabled>
              Оберіть категорію
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          Створити матеріал
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
          Матеріал успішно створено!
        </Alert>
      </Snackbar>
    </div>
  );
}
