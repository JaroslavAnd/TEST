"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useArticle } from "@/hooks/useArticles";
import Link from "next/link";
import { Snackbar, Alert } from "@mui/material";
import { Article } from "@/types";

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

// Окремий компонент форми — ініціалізує стан з props, без useEffect
function EditForm({ article }: { article: Article }) {
  const router = useRouter();
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [excerpt, setExcerpt] = useState(article.excerpt);
  const [category, setCategory] = useState(article.category);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, excerpt, category }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Помилка збереження");
      }

      setShowSuccess(true);
      setTimeout(() => router.push(`/articles/${article.id}`), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка збереження");
    } finally {
      setSaving(false);
    }
  };

  const inputStyles =
    "w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-1">Редагувати матеріал</h1>
      <p className="text-text-muted mb-6">
        Внесіть зміни до статті #{article.id}
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
            required
            rows={8}
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

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Збереження..." : "Зберегти зміни"}
          </button>
          <Link
            href={`/articles/${article.id}`}
            className="py-2.5 px-4 text-sm font-medium text-text-muted border border-border rounded-lg hover:bg-surface transition-colors text-center"
          >
            Скасувати
          </Link>
        </div>
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
          Матеріал успішно оновлено!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default function EditArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const { article, isLoading, isError } = useArticle(id);

  if (isLoading) {
    return (
      <div className="max-w-xl animate-pulse">
        <div className="h-8 w-48 bg-border rounded mb-2" />
        <div className="h-5 w-64 bg-border rounded mb-6" />
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-border rounded mb-1.5" />
              <div className="h-10 w-full bg-border rounded-lg" />
            </div>
          ))}
          <div className="h-10 w-full bg-border rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📄</div>
        <h2 className="text-xl font-bold mb-2">Статтю не знайдено</h2>
        <Link
          href="/articles"
          className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          ← Повернутися до списку
        </Link>
      </div>
    );
  }

  // key={article.id} гарантує ре-створення компонента при зміні ID
  return <EditForm key={article.id} article={article} />;
}
