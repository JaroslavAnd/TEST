import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination, { getPageItems } from "@/components/Pagination";

describe("getPageItems", () => {
  it("показує всі сторінки, коли їх мало", () => {
    expect(getPageItems(1, 3)).toEqual([1, 2, 3]);
  });

  it("додає пропуски з обох боків", () => {
    expect(getPageItems(6, 12)).toEqual([1, "gap", 4, 5, 6, 7, 8, "gap", 12]);
  });

  it("не робить пропуск, якщо сторінки йдуть поспіль", () => {
    expect(getPageItems(1, 6)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe("Pagination", () => {
  it("нічого не рендерить для однієї сторінки", () => {
    const { container } = render(<Pagination page={1} totalPages={1} onChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("позначає поточну сторінку та викликає onChange", () => {
    const onChange = jest.fn();
    render(<Pagination page={2} totalPages={4} onChange={onChange} />);

    expect(screen.getByRole("button", { name: "Сторінка 2" })).toHaveAttribute("aria-current", "page");

    fireEvent.click(screen.getByRole("button", { name: "Далі" }));
    expect(onChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole("button", { name: "Назад" }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("блокує «Назад» на першій і «Далі» на останній сторінці", () => {
    const { rerender } = render(<Pagination page={1} totalPages={3} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Назад" })).toBeDisabled();

    rerender(<Pagination page={3} totalPages={3} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Далі" })).toBeDisabled();
  });
});
