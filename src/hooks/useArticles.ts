import useSWR from "swr";
import { Article } from "@/types";

// Загальний fetcher для SWR
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Помилка завантаження");
    return res.json();
  });

// Хук для отримання списку статей
export function useArticles() {
  const { data, error, isLoading, mutate } = useSWR<Article[]>(
    "/api/articles",
    fetcher
  );

  return {
    articles: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Хук для отримання однієї статті за ID
export function useArticle(id: string | number) {
  const { data, error, isLoading, mutate } = useSWR<Article>(
    `/api/articles/${id}`,
    fetcher
  );

  return {
    article: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
