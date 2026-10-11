import useSWR from "swr";
import { Comment } from "@/types";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Помилка завантаження");
    return res.json();
  });

export function useComments(articleId: number | string) {
  const { data, error, isLoading, mutate } = useSWR<Comment[]>(
    `/api/articles/${articleId}/comments`,
    fetcher
  );

  return {
    comments: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
