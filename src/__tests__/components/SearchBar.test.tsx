import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchBar from "@/components/SearchBar";

describe("SearchBar", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("показує початкове значення з URL", () => {
    render(<SearchBar defaultValue="docker" onSearch={() => {}} />);
    expect(screen.getByRole("searchbox", { name: "Пошук матеріалів" })).toHaveValue("docker");
  });

  it("викликає onSearch один раз після паузи у введенні (debounce)", () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} delay={300} />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "d" } });
    fireEvent.change(input, { target: { value: "do" } });
    fireEvent.change(input, { target: { value: " dock " } });
    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("dock");
  });

  it("не викликає onSearch без введення — регресія: раніше ефект скидав сторінку пагінації", () => {
    const onSearch = jest.fn();
    const { rerender } = render(<SearchBar defaultValue="" onSearch={onSearch} />);

    // Батько перерендерюється з новою функцією (як при зміні сторінки)
    rerender(<SearchBar defaultValue="" onSearch={() => onSearch()} />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("Enter відправляє пошук одразу", () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "sql" } });
    fireEvent.submit(screen.getByRole("search"));
    expect(onSearch).toHaveBeenCalledWith("sql");
  });
});
