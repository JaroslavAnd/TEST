import { Article, CreateArticleData, UpdateArticleData, ArticleAuthor } from "@/types";

describe("Article types", () => {
  it("Article має всі обов'язкові поля", () => {
    const article: Article = {
      id: 1,
      title: "Test",
      content: "Content",
      excerpt: "Excerpt",
      category: "Програмування",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    expect(article.id).toBe(1);
    expect(article.title).toBe("Test");
    expect(article.content).toBe("Content");
    expect(article.excerpt).toBe("Excerpt");
    expect(article.category).toBe("Програмування");
    expect(article.createdAt).toBeDefined();
    expect(article.updatedAt).toBeDefined();
  });

  it("Article може мати опціональні поля author та authorId", () => {
    const article: Article = {
      id: 1,
      title: "Test",
      content: "Content",
      excerpt: "Excerpt",
      category: "Програмування",
      authorId: "user1",
      author: { id: "user1", name: "Author", image: null },
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    expect(article.authorId).toBe("user1");
    expect(article.author?.name).toBe("Author");
  });

  it("CreateArticleData не містить id та дати", () => {
    const data: CreateArticleData = {
      title: "New Article",
      content: "Content",
      excerpt: "Excerpt",
      category: "Веброзробка",
    };

    expect(data.title).toBe("New Article");
    expect(data).not.toHaveProperty("id");
    expect(data).not.toHaveProperty("createdAt");
  });

  it("UpdateArticleData має всі поля опціональними", () => {
    const partial: UpdateArticleData = { title: "Updated" };
    expect(partial.title).toBe("Updated");
    expect(partial.content).toBeUndefined();

    const empty: UpdateArticleData = {};
    expect(Object.keys(empty)).toHaveLength(0);
  });

  it("ArticleAuthor має id, name та image", () => {
    const author: ArticleAuthor = {
      id: "user1",
      name: "Test Author",
      image: "https://example.com/avatar.jpg",
    };

    expect(author.id).toBe("user1");
    expect(author.name).toBe("Test Author");
    expect(author.image).toContain("avatar");
  });

  it("ArticleAuthor допускає null для name та image", () => {
    const author: ArticleAuthor = {
      id: "user1",
      name: null,
      image: null,
    };

    expect(author.name).toBeNull();
    expect(author.image).toBeNull();
  });
});
