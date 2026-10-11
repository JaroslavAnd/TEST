import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const articles = [
  {
    title: "Основи TypeScript для початківців",
    content:
      "TypeScript — це надмножина JavaScript, яка додає статичну типізацію. У цій статті ми розглянемо основні типи даних: string, number, boolean, array та object. Типізація допомагає знаходити помилки ще до запуску коду, що робить розробку більш надійною. Ви дізнаєтесь, як оголошувати змінні з типами, створювати інтерфейси та використовувати дженерики.",
    excerpt: "Вступ до TypeScript: типи даних, інтерфейси та переваги статичної типізації.",
    category: "Програмування",
  },
  {
    title: "React Hooks: useState та useEffect",
    content:
      "React Hooks змінили спосіб написання компонентів. useState дозволяє додавати стан до функціональних компонентів, а useEffect — виконувати побічні ефекти. У цій статті ми розглянемо практичні приклади використання цих хуків, поширені помилки та найкращі практики. Також торкнемося теми залежностей useEffect та правильного очищення ефектів.",
    excerpt: "Практичний гайд по React Hooks: як працюють useState та useEffect.",
    category: "Веброзробка",
  },
  {
    title: "SQL для початківців: SELECT, JOIN, WHERE",
    content:
      "SQL — мова запитів до реляційних баз даних. Основні оператори: SELECT для вибірки даних, WHERE для фільтрації, JOIN для об'єднання таблиць. У цій статті ви навчитесь писати прості та складні запити, використовувати агрегатні функції COUNT, SUM, AVG, а також підзапити. Практичні приклади на PostgreSQL.",
    excerpt: "Базові SQL-запити: вибірка, фільтрація та об'єднання таблиць.",
    category: "Бази даних",
  },
  {
    title: "Алгоритми сортування: від бульбашки до швидкого",
    content:
      "Сортування — одна з фундаментальних задач програмування. Ми розглянемо алгоритми від простих (бульбашкове, вставками) до ефективних (швидке сортування, злиттям). Для кожного алгоритму наведена складність O(n), пояснення принципу роботи та приклади коду на JavaScript. Порівняння продуктивності на різних обсягах даних.",
    excerpt: "Огляд алгоритмів сортування з аналізом складності та прикладами коду.",
    category: "Алгоритми",
  },
  {
    title: "Docker для розробників: перші кроки",
    content:
      "Docker дозволяє пакувати додатки у контейнери для однакового запуску на будь-якому середовищі. Ви дізнаєтесь, як створити Dockerfile, зібрати образ, запустити контейнер та використовувати Docker Compose для багатосервісних додатків. Також розглянемо типові сценарії: контейнеризація Node.js додатку та PostgreSQL бази даних.",
    excerpt: "Вступ до Docker: контейнери, образи та Docker Compose на практиці.",
    category: "DevOps",
  },
  {
    title: "Next.js App Router: маршрутизація та layout",
    content:
      "App Router у Next.js — це новий підхід до маршрутизації на основі файлової системи. Кожна папка в app/ стає маршрутом. Layout-файли дозволяють створювати спільні обгортки для груп сторінок. У статті розглянемо: створення сторінок, динамічні маршрути, групи маршрутів, loading та error стани, а також серверні та клієнтські компоненти.",
    excerpt: "Повний гайд по App Router: маршрути, layout, серверні та клієнтські компоненти.",
    category: "Веброзробка",
  },
  {
    title: "Git для командної роботи",
    content:
      "Git — система контролю версій, необхідна для командної розробки. У статті розглянемо: створення гілок, merge та rebase, вирішення конфліктів, pull request workflow. Також торкнемося Git Flow та trunk-based development підходів. Практичні поради: як писати хороші commit-повідомлення та організовувати роботу в команді.",
    excerpt: "Git workflow для командної розробки: гілки, merge, pull requests.",
    category: "DevOps",
  },
  {
    title: "Prisma ORM: робота з базою даних у Node.js",
    content:
      "Prisma — сучасний ORM для Node.js та TypeScript. Він спрощує роботу з базами даних через декларативну схему та типобезпечний клієнт. У статті ми розглянемо: створення моделей, міграції, CRUD-операції, фільтрацію та зв'язки між таблицями. Prisma підтримує PostgreSQL, MySQL, SQLite та MongoDB.",
    excerpt: "Практичний гайд по Prisma: від схеми до CRUD-операцій з TypeScript.",
    category: "Бази даних",
  },
  {
    title: "Структури даних: масиви, стеки та черги",
    content:
      "Структури даних — основа ефективного програмування. Масиви забезпечують доступ за індексом O(1), стеки працюють за принципом LIFO, а черги — FIFO. У статті розглянемо реалізацію кожної структури на JavaScript, типові задачі та їх застосування в реальних проєктах: від обробки подій до алгоритмів обходу графів.",
    excerpt: "Базові структури даних з реалізацією та прикладами застосування.",
    category: "Алгоритми",
  },
  {
    title: "REST API: принципи проєктування",
    content:
      "REST — архітектурний стиль для побудови веб-API. Основні принципи: використання HTTP-методів (GET, POST, PUT, DELETE), статусних кодів, правильне іменування ресурсів. У статті розглянемо: як проєктувати endpoints, валідацію даних, обробку помилок, пагінацію та версіонування API. Приклади на Next.js Route Handlers.",
    excerpt: "Проєктування REST API: методи, статуси, валідація та найкращі практики.",
    category: "Веброзробка",
  },
];

async function main() {
  console.log("🌱 Seed: видаляємо старі дані...");
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log("🌱 Seed: створюємо тестового користувача...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      name: "Тестовий Студент",
      email: "student@studyhub.com",
      password: hashedPassword,
      age: 20,
      bio: "Студент КПІ, вивчаю веброзробку та TypeScript.",
    },
  });

  console.log(`✅ Створено користувача: ${user.email} (пароль: password123)`);

  // Без адміністратора в сідах до адмін-панелі неможливо потрапити
  const adminPassword = await bcrypt.hash("admin12345", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Адміністратор",
      email: "admin@studyhub.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Створено адміністратора: ${admin.email} (пароль: admin12345)`);

  console.log("🌱 Seed: додаємо навчальні матеріали...");
  const created = [];
  for (const article of articles) {
    created.push(
      await prisma.article.create({
        data: {
          ...article,
          authorId: user.id,
        },
      })
    );
  }

  console.log("🌱 Seed: додаємо коментарі...");
  await prisma.comment.createMany({
    data: [
      { articleId: created[0].id, authorId: admin.id, content: "Корисний вступ. Було б добре додати приклад із generics." },
      { articleId: created[0].id, authorId: user.id, content: "Дякую! Додам приклад у наступному оновленні." },
    ],
  });

  const count = await prisma.article.count();
  console.log(`✅ Seed завершено: додано ${count} статей`);
}

main()
  .catch((e) => {
    console.error("❌ Seed помилка:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
