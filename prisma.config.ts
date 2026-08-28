import { defineConfig } from "prisma/config";
import path from "path";
import dotenv from "dotenv";

// Завантажуємо змінні з .env.local (Next.js convention)
dotenv.config({ path: path.resolve(__dirname, ".env.local") });
// Фолбек на .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
