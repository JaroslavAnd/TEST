// Типи для StudyHub

// Автор статті
export interface ArticleAuthor {
  id: string;
  name: string | null;
  image: string | null;
}

// Тип статті з бази даних
export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  authorId?: string | null;
  author?: ArticleAuthor | null;
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
