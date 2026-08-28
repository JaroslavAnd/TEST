// Типи для StudyHub

// Тип статті з бази даних
export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  authorId?: number | null;
  createdAt: string;
  updatedAt: string;
}

// Тип для створення статті (без id, createdAt, updatedAt)
export interface CreateArticleData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
}

// Тип для оновлення статті (всі поля опціональні)
export interface UpdateArticleData {
  title?: string;
  content?: string;
  excerpt?: string;
  category?: string;
}

// Тип коментаря (залишаємо для сумісності з ЛР1 — JSONPlaceholder)
export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}
