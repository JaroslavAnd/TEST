// Безпечний розбір параметрів пагінації з query string.
// Захищає від NaN, від'ємних значень та надвеликого limit.

export interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

export function parsePagination(
  searchParams: URLSearchParams,
  { defaultLimit = 9, maxLimit = 50 }: PaginationOptions = {}
): { page: number; limit: number; skip: number } {
  const toInt = (value: string | null, fallback: number) => {
    const n = Number.parseInt(value ?? "", 10);
    return Number.isFinite(n) ? n : fallback;
  };

  const page = Math.max(1, toInt(searchParams.get("page"), 1));
  const limit = Math.min(maxLimit, Math.max(1, toInt(searchParams.get("limit"), defaultLimit)));

  return { page, limit, skip: (page - 1) * limit };
}
