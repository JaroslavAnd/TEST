import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryFilter from "@/components/CategoryFilter";
import { ARTICLE_CATEGORIES } from "@/lib/validation";

describe("CategoryFilter", () => {
  it("рендерить «Усі теми» та всі категорії", () => {
    render(<CategoryFilter selected={null} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Усі теми" })).toBeInTheDocument();
    for (const category of ARTICLE_CATEGORIES) {
      expect(screen.getByRole("button", { name: category })).toBeInTheDocument();
    }
  });

  it("позначає вибрану категорію через aria-pressed", () => {
    render(<CategoryFilter selected="DevOps" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "DevOps" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Усі теми" })).toHaveAttribute("aria-pressed", "false");
  });

  it("повертає вибір у onChange", () => {
    const onChange = jest.fn();
    render(<CategoryFilter selected="DevOps" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Алгоритми" }));
    expect(onChange).toHaveBeenCalledWith("Алгоритми");

    fireEvent.click(screen.getByRole("button", { name: "Усі теми" }));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });
});
