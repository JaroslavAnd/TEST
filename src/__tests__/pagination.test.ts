import { parsePagination } from "@/lib/pagination";

const params = (query: string) => new URLSearchParams(query);

describe("parsePagination", () => {
  it("повертає значення за замовчуванням", () => {
    expect(parsePagination(params(""))).toEqual({ page: 1, limit: 9, skip: 0 });
  });

  it("рахує skip з page і limit", () => {
    expect(parsePagination(params("page=3&limit=10"))).toEqual({ page: 3, limit: 10, skip: 20 });
  });

  it("не дозволяє page < 1 та нечислові значення (раніше давало NaN → 500)", () => {
    expect(parsePagination(params("page=0")).page).toBe(1);
    expect(parsePagination(params("page=-5")).page).toBe(1);
    expect(parsePagination(params("page=abc")).page).toBe(1);
    expect(parsePagination(params("limit=abc")).limit).toBe(9);
  });

  it("обмежує limit зверху", () => {
    expect(parsePagination(params("limit=100000")).limit).toBe(50);
    expect(parsePagination(params("limit=100000"), { maxLimit: 20 }).limit).toBe(20);
  });

  it("limit не менший за 1", () => {
    expect(parsePagination(params("limit=0")).limit).toBe(1);
  });
});
