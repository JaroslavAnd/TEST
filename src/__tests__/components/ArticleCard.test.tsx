import React from "react";
import { render, screen } from "@testing-library/react";
import ArticleCard from "@/components/ArticleCard";
import { Article } from "@/types";

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

const mockArticle: Article = {
  id: 1,
  title: "Основи TypeScript",
  content: "Повний текст статті про TypeScript...",
  excerpt: "Вступ до TypeScript: типи даних та інтерфейси.",
  category: "Програмування",
  authorId: "user1",
  author: { id: "user1", name: "Іван Петренко", image: null },
  createdAt: "2026-01-15T10:00:00Z",
  updatedAt: "2026-01-15T10:00:00Z",
};

describe("ArticleCard", () => {
  it("відображає назву статті", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("Основи TypeScript")).toBeInTheDocument();
  });

  it("відображає excerpt статті", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(
      screen.getByText("Вступ до TypeScript: типи даних та інтерфейси.")
    ).toBeInTheDocument();
  });

  it("відображає категорію", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("Програмування")).toBeInTheDocument();
  });

  it("відображає ім'я автора", () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("Іван Петренко")).toBeInTheDocument();
  });

  it("містить посилання на статтю", () => {
    render(<ArticleCard article={mockArticle} />);
    const link = screen.getByText("Переглянути →");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/articles/1");
  });

  it("не відображає автора якщо author = null", () => {
    const articleWithoutAuthor: Article = {
      ...mockArticle,
      author: null,
    };
    render(<ArticleCard article={articleWithoutAuthor} />);
    expect(screen.queryByText("Іван Петренко")).not.toBeInTheDocument();
  });

  it("не відображає автора якщо author.name = null", () => {
    const articleNoName: Article = {
      ...mockArticle,
      author: { id: "user1", name: null, image: null },
    };
    render(<ArticleCard article={articleNoName} />);
    // Ім'я null — не показуємо
    expect(screen.queryByText("Іван Петренко")).not.toBeInTheDocument();
  });
});
