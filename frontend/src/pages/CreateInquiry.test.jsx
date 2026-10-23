/**
 * @vitest-environment jsdom
 */

import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import CreateInquiry from "./CreateInquiry";

vi.mock("../api/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("../components/Layout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

describe("Create Inquiry Form", () => {
  test("requires all four inquiry fields", () => {
    const { container } = render(
      <MemoryRouter>
        <CreateInquiry />
      </MemoryRouter>,
    );

    const fields = [
      screen.getByLabelText(/Customer Name/i),
      screen.getByLabelText(/Contact Details/i),
      screen.getByLabelText(/Subject/i),
      screen.getByLabelText(/Description/i),
    ];

    fields.forEach((field) => {
      expect(field).toBeRequired();
    });

    expect(container.querySelector("form").checkValidity()).toBe(false);
  });

  test("enforces maximum lengths for inquiry fields", () => {
    render(
      <MemoryRouter>
        <CreateInquiry />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/Customer Name/i)).toHaveAttribute(
      "maxlength",
      "100",
    );

    expect(screen.getByLabelText(/Contact Details/i)).toHaveAttribute(
      "maxlength",
      "100",
    );

    expect(screen.getByLabelText(/Subject/i)).toHaveAttribute(
      "maxlength",
      "150",
    );

    expect(screen.getByLabelText(/Description/i)).toHaveAttribute(
      "maxlength",
      "2000",
    );
  });
});
