import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./api", () => ({
  api: {
    listExpenses: jest.fn().mockResolvedValue([]),
    createExpense: jest.fn(),
    deleteExpense: jest.fn(),
    byCategory: jest.fn().mockResolvedValue([]),
    overTime: jest.fn().mockResolvedValue([]),
    updateExpense: jest.fn(),
    summary: jest.fn(),
  },
}));

test("renders empty-state content after initial load", async () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /my budget app/i })).toBeInTheDocument();
  expect(await screen.findByText(/no expenses match this filter/i)).toBeInTheDocument();
  expect(
    await screen.findByText(/add your first expense to unlock insights/i)
  ).toBeInTheDocument();
});
