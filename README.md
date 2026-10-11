# StudyHub — Навчальна платформа

**Курсова робота** з дисципліни «Фулл-стек розробка» (3 курс)

Сучасна веб-платформа для публікації, читання та управління навчальними матеріалами, побудована на Next.js 16 із серверним рендерингом, автентифікацією, RBAC та повноцінним REST API.

---

## Зміст

- [Технологічний стек](#-технологічний-стек)
- [Функціональність](#-функціональність)
- [Архітектура](#-архітектура)
- [Структура проекту](#-структура-проекту)
- [Встановлення та запуск](#-встановлення-та-запуск)
- [API документація](#-api-документація)
- [База даних](#-база-даних)
- [Тестування](#-тестування)

---

## 🛠 Технологічний стек

| Технологія | Версія | Призначення |
|------------|--------|-------------|
| **Next.js** | 16.3 | React-фреймворк з App Router, SSR/SSG |
| **React** | 19.2 | UI-бібліотека |
| **TypeScript** | 5.x | Статична типізація |
| **PostgreSQL** | — | Реляційна база даних |
| **Prisma ORM** | 7.9 | ORM для роботи з БД, міграції, типобезпечні запити |
| **NextAuth.js** | 5 (beta) | Автентифікація (Google, GitHub, Email/Password) |
| **SWR** | 2.5 | Клієнтський data-fetching з кешуванням |
| **Tailwind CSS** | 4.x | Utility-first CSS фреймворк |
| **MUI (Material UI)** | 9.3 | Компоненти інтерфейсу (Avatar, Icons) |
| **bcryptjs** | 3.x | Хешування паролів |
| **Jest** | 30.x | Юніт-тестування |
| **Playwright** | 1.62 | E2E тестування |
| **ESLint** | 9.x | Лінтинг коду |
| **GitHub Actions** | — | CI/CD pipeline |

---

##  Функціональність

###  Автентифікація та авторизація
- Вхід через **Google**, **GitHub** або **Email/Password**
- Реєстрація з хешуванням паролів (bcrypt)
- JWT-сесії з Prisma Adapter
- Захист маршрутів через Proxy (Next.js 16)
- RBAC: ролі `USER` та `ADMIN`

###  Управління статтями (CRUD)
- Створення, перегляд, редагування, видалення статей
- 10 категорій: Програмування, Веброзробка, Бази даних, Алгоритми та інші
- Прив'язка статті до автора
- Тільки автор може редагувати/видаляти свої статті
- Збереження в обране (localStorage)

###  Пошук, фільтрація та пагінація
- Повнотекстовий пошук за заголовком та вмістом (case-insensitive)
- Фільтрація за категорією (chip-кнопки)
- Серверна пагінація (skip/take, configurable limit)
- Debounce пошуку (400мс)
- Лічильник результатів

###  Система коментарів
- Додавання коментарів до статей (авторизовані користувачі)
- Видалення власних коментарів
- Каскадне видалення при видаленні статті/користувача
- Валідація (непорожній, max 1000 символів)
- Skeleton-loading

###  Адмін-панель
- Дашборд зі статистикою (користувачі, статті, коментарі)
- Управління користувачами: перегляд, зміна ролі, видалення
- Модерація статей: перегляд, видалення будь-якої статті
- Пошук та пагінація в адмін-таблицях
- Захист від самовидалення/самопониження адміна
- Перевірка ролі через БД (не тільки JWT)

###  Профіль користувача
- Редагування імені, віку, біографії
- Зміна паролю (з перевіркою поточного)
- Аватар з OAuth провайдерів

---

##  Архітектура

```
┌─────────────────────────────────────────────────────┐
│                    Клієнт (Browser)                  │
│  React 19 + SWR + Tailwind CSS + MUI                │
└────────────────────────┬────────────────────────────┘
                         │ HTTP / fetch
┌────────────────────────▼────────────────────────────┐
│              Next.js 16 (App Router)                 │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │  Proxy   │  │   Pages   │  │  Route Handlers  │  │
│  │(auth     │  │  (SSR /   │  │  (REST API)      │  │
│  │ guard)   │  │  client)  │  │                  │  │
│  └──────────┘  └───────────┘  └────────┬─────────┘  │
│                                         │            │
│  ┌──────────────────────────────────────▼─────────┐  │
│  │         NextAuth.js v5 (JWT + Prisma Adapter)  │  │
│  └──────────────────────────────────────┬─────────┘  │
│                                         │            │
│  ┌──────────────────────────────────────▼─────────┐  │
│  │         Prisma ORM 7 (Type-safe queries)       │  │
│  └──────────────────────────────────────┬─────────┘  │
└─────────────────────────────────────────┼────────────┘
                                          │ TCP
┌─────────────────────────────────────────▼────────────┐
│                  PostgreSQL Database                  │
│  Users, Articles, Comments, Sessions, Accounts       │
└──────────────────────────────────────────────────────┘
```

---

##  Структура проекту

```
studyhub/
├── prisma/
│   ├── schema.prisma          # Схема бази даних
│   ├── seed.ts                # Наповнення БД тестовими даними
│   └── migrations/            # Міграції Prisma
├── src/
│   ├── auth.ts                # Конфігурація NextAuth.js
│   ├── proxy.ts               # Proxy (захист маршрутів, Next.js 16)
│   ├── app/
│   │   ├── layout.tsx         # Кореневий layout
│   │   ├── page.tsx           # Головна сторінка (Landing)
│   │   ├── globals.css        # Глобальні стилі + CSS-змінні + Tailwind
│   │   ├── (auth)/            # Route group: автентифікація
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (main)/            # Route group: основний контент
│   │   │   ├── layout.tsx     # Layout з Header + Navigation
│   │   │   ├── admin/         # Адмін-панель (RBAC)
│   │   │   │   ├── page.tsx           # Дашборд
│   │   │   │   ├── users/page.tsx     # Управління юзерами
│   │   │   │   └── articles/page.tsx  # Модерація статей
│   │   │   ├── articles/      # Статті
│   │   │   │   ├── page.tsx           # Список (пошук + фільтри + пагінація)
│   │   │   │   ├── create/page.tsx    # Створення
│   │   │   │   ├── favorite/page.tsx  # Обране
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx       # Деталі + коментарі
│   │   │   │       ├── edit/page.tsx  # Редагування
│   │   │   │       └── not-found.tsx  # 404
│   │   │   └── profile/       # Профіль
│   │   │       ├── page.tsx           # Редагування профілю
│   │   │       └── security/page.tsx  # Зміна паролю
│   │   └── api/               # REST API (Route Handlers)
│   │       ├── articles/              # CRUD статей
│   │       ├── articles/[id]/comments # Коментарі
│   │       ├── comments/[id]/         # Видалення коментаря
│   │       ├── admin/                 # Адмін API (stats, users, articles)
│   │       ├── auth/                  # NextAuth handler
│   │       ├── profile/               # Профіль API
│   │       └── register/              # Реєстрація
│   ├── components/            # React компоненти
│   │   ├── Header.tsx                 # Шапка з аватаром і меню
│   │   ├── SearchBar.tsx              # Пошук з debounce
│   │   ├── CategoryFilter.tsx         # Фільтр категорій
│   │   ├── Pagination.tsx             # Пагінація
│   │   ├── ArticleCard.tsx            # Картка статті
│   │   ├── FavoriteArticle.tsx        # Кнопка "Обране"
│   │   ├── SessionProvider.tsx        # Провайдер сесії
│   │   ├── Comments/                  # Система коментарів
│   │   │   ├── CommentForm.tsx
│   │   │   ├── CommentList.tsx
│   │   │   └── CommentsSection.tsx
│   │   └── Navigation/               # Бічна + мобільна навігація
│   ├── hooks/                 # Кастомні React хуки
│   │   ├── useArticles.ts            # SWR хук для статей
│   │   └── useComments.ts            # SWR хук для коментарів
│   ├── lib/                   # Утиліти
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   ├── admin.ts                  # requireAdmin() helper
│   │   ├── validation.ts             # Валідація + категорії
│   │   └── format.ts                 # Форматування дат і тексту
│   └── types/
│       └── index.ts                  # TypeScript інтерфейси
├── tests/
│   └── e2e/                   # Playwright E2E тести
├── .github/
│   └── workflows/             # GitHub Actions CI/CD
├── jest.config.js             # Конфігурація Jest
├── playwright.config.ts       # Конфігурація Playwright
├── next.config.ts             # Конфігурація Next.js
├── tsconfig.json              # Конфігурація TypeScript
└── package.json
```

---

##  Встановлення та запуск

### Передумови
- **Node.js** >= 18.x
- **PostgreSQL** >= 14
- **npm** або **yarn**

### 1. Клонування репозиторію
```bash
git clone <repository-url>
cd studyhub
```

### 2. Встановлення залежностей
```bash
npm install
```

### 3. Налаштування змінних оточення

Скопіюйте `.env.example` в `.env` та заповніть:

```env
# База даних
DATABASE_URL="postgresql://user:password@localhost:5432/studyhub?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth провайдери (опціонально)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

### 4. Створення бази даних та міграція
```bash
npx prisma migrate dev
```

### 5. Наповнення тестовими даними
```bash
npm run db:seed
```

### 6. Запуск dev-сервера
```bash
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000) у браузері.

### Корисні команди

| Команда | Опис |
|---------|------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Production build |
| `npm run start` | Запуск production сервера |
| `npm run lint` | Перевірка ESLint |
| `npm test` | Юніт-тести (Jest) |
| `npm run test:coverage` | Тести з покриттям |
| `npm run e2e` | E2E тести (Playwright) |
| `npm run db:migrate` | Міграція БД |
| `npm run db:seed` | Наповнення БД |
| `npm run db:studio` | Відкрити Prisma Studio |

---

##  API документація

### Публічні endpoints

| Метод | Шлях | Опис | Query параметри |
|-------|------|------|-----------------|
| GET | `/api/articles` | Список статей (пагінація) | `?page=1&limit=9&search=&category=` |
| GET | `/api/articles/[id]` | Деталі статті | — |
| GET | `/api/articles/[id]/comments` | Коментарі до статті | — |
| POST | `/api/register` | Реєстрація | Body: `{ name, email, password }` |

### Авторизовані endpoints (потрібен JWT)

| Метод | Шлях | Опис |
|-------|------|------|
| POST | `/api/articles` | Створити статтю |
| PATCH | `/api/articles/[id]` | Оновити статтю (лише автор) |
| DELETE | `/api/articles/[id]` | Видалити статтю (лише автор) |
| POST | `/api/articles/[id]/comments` | Додати коментар |
| DELETE | `/api/comments/[id]` | Видалити коментар (лише автор) |
| GET | `/api/profile` | Дані профілю |
| PATCH | `/api/profile` | Оновити профіль |
| PATCH | `/api/profile/password` | Змінити пароль |

### Адмін endpoints (роль ADMIN)

| Метод | Шлях | Опис |
|-------|------|------|
| GET | `/api/admin/stats` | Статистика платформи |
| GET | `/api/admin/users` | Список користувачів |
| PATCH | `/api/admin/users/[id]` | Зміна ролі користувача |
| DELETE | `/api/admin/users/[id]` | Видалення користувача |
| GET | `/api/admin/articles` | Список статей для модерації |
| DELETE | `/api/admin/articles/[id]` | Видалення статті адміном |

---

##  База даних

### ER-діаграма

```mermaid
erDiagram
    User {
        String id PK
        String name
        String email UK
        DateTime emailVerified
        String image
        String password
        Role role
        Int age
        String bio
        DateTime createdAt
        DateTime updatedAt
    }

    Article {
        Int id PK
        String title
        String content
        String excerpt
        String category
        String authorId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Comment {
        Int id PK
        String content
        Int articleId FK
        String authorId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Account {
        String id PK
        String userId FK
        String type
        String provider
        String providerAccountId
    }

    Session {
        String id PK
        String sessionToken UK
        String userId FK
        DateTime expires
    }

    VerificationToken {
        String identifier
        String token
        DateTime expires
    }

    User ||--o{ Article : "автор"
    User ||--o{ Comment : "автор"
    User ||--o{ Account : "OAuth акаунти"
    User ||--o{ Session : "сесії"
    Article ||--o{ Comment : "коментарі"
```

### Enum Role
- `USER` — звичайний користувач (за замовчуванням)
- `ADMIN` — адміністратор з повним доступом

---

##  Тестування

### Юніт-тести (Jest)
```bash
npm test                    # Запуск
npm run test:coverage       # З покриттям
npm run test:watch          # Watch-режим
```

### E2E тести (Playwright)
```bash
npm run e2e                 # Запуск
npm run e2e:ui              # З UI-інтерфейсом
```

### CI/CD
Проект використовує **GitHub Actions** для автоматичного запуску тестів та лінтингу при push/PR.

---

##  Ліцензія

Курсова робота — 2026. StudyHub.
