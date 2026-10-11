import React from "react";
import { render, screen } from "@testing-library/react";
import Avatar from "@/components/Avatar";
import Footer from "@/components/Footer";

jest.mock("next/link", () => {
  return function MockLink({ children, href, ...rest }: { children: React.ReactNode; href: string }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

describe("Avatar", () => {
  it("показує ініціали, якщо немає фото", () => {
    const { container } = render(<Avatar name="Іван Петренко" />);
    expect(container).toHaveTextContent("ІП");
  });

  it("показує фото, якщо воно є", () => {
    const { container } = render(<Avatar name="Іван" image="https://example.com/a.png" size={40} />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "https://example.com/a.png");
    expect(img).toHaveStyle({ width: "40px", height: "40px" });
  });

  it("не падає без імені", () => {
    const { container } = render(<Avatar />);
    expect(container).toHaveTextContent("U");
  });
});

describe("Footer", () => {
  it("містить назву платформи та навігацію", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toHaveTextContent("StudyHub");
    expect(screen.getByRole("link", { name: "Матеріали" })).toHaveAttribute("href", "/articles");
  });
});
