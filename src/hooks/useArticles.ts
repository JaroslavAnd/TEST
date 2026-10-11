import useSWR from "swr";
import { Article, PaginatedResponse } from "@/types";

// Загальний fetcher для SWR
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Помилка завантаження");
    return res.json();
  });

interface UseArticlesParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

// Хук для отримання списку статей
export function useArticles(params?: UseArticlesParams) {
  const searchParams = new URLSearchParams();
  
  if (params?.search) searchParams.set("search", params.search);
  if (params?.category) searchParams.set("category", params.category);
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  
  const queryString = searchParams.toString();
  const url = queryString ? `/api/articles?${queryString}` : "/api/articles";

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Article>>(
    url,
    fetcher
  );

  return {
    data,
    articles: data?.data ?? [],
    pagination: data?.pagination,
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
