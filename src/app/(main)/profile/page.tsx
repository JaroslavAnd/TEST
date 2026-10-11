"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Snackbar, Alert, Avatar } from "@mui/material";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  age: number | null;
  bio: string | null;
  hasPassword: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // Поля для редагування
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setName(data.name || "");
          setAge(data.age?.toString() || "");
          setBio(data.bio || "");
        }
      } catch {
        setError("Не вдалося завантажити профіль");
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || null,
          age: age ? parseInt(age) : null,
          bio: bio || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Помилка збереження");
      }

      const updatedProfile = await res.json();
      setProfile((prev) =>
        prev ? { ...prev, ...updatedProfile } : prev
      );
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка збереження");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl animate-pulse">
        <div className="h-8 w-48 bg-border rounded mb-2" />
        <div className="h-5 w-64 bg-border rounded mb-6" />
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-border rounded-full" />
            <div>
              <div className="h-5 w-32 bg-border rounded mb-2" />
              <div className="h-4 w-48 bg-border rounded" />
            </div>
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-border rounded mb-1.5" />
              <div className="h-10 w-full bg-border rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const inputStyles =
    "w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-1">Профіль</h1>
      <p className="text-text-muted mb-6">Керуйте своїми персональними даними</p>

      {/* Інформація про користувача */}
      <div className="bg-surface rounded-xl border border-border p-5 mb-6">
        <div className="flex items-center gap-4">
          <Avatar
            src={profile?.image || undefined}
            alt={profile?.name || "User"}
            sx={{ width: 64, height: 64, fontSize: "1.5rem" }}
          >
            {profile?.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">
              {profile?.name || "Без імені"}
            </h2>
            <p className="text-sm text-text-muted">{profile?.email}</p>
            {memberSince && (
              <p className="text-xs text-text-muted mt-0.5">
                Учасник з {memberSince}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Форма редагування */}
      <form
        onSubmit={handleSubmit}
        className="bg-surface rounded-xl border border-border p-5 space-y-4"
      >
        <h3 className="text-base font-semibold mb-2">Редагувати профіль</h3>

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
            value={profile?.email || ""}
            disabled
            className={`${inputStyles} opacity-60 cursor-not-allowed`}
          />
          <p className="text-xs text-text-muted mt-1">
            Email не можна змінити
          </p>
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium mb-1.5">
            Вік
          </label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Ваш вік"
            min={1}
            max={120}
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1.5">
            Про себе
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

        {error && (
          <p className="text-sm text-error text-center font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Збереження..." : "Зберегти зміни"}
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
          Профіль успішно оновлено!
        </Alert>
      </Snackbar>
    </div>
  );
}
