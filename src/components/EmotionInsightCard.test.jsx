import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EmotionInsightCard from "./EmotionInsightCard";

jest.mock("../api", () => ({
  api: {
    emotion: jest.fn(),
  },
}));

describe("EmotionInsightCard", () => {
  const { api } = require("../api");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading text then a resolved emotion insight", async () => {
    api.emotion.mockResolvedValueOnce({
      state: "impulsive",
      message: "Your discretionary spending is elevated.",
    });

    render(<EmotionInsightCard />);

    expect(screen.getByText(/analyzing spending emotion/i)).toBeInTheDocument();

    expect(await screen.findByText(/Emotion Insight/i)).toBeInTheDocument();
    expect(screen.getByText(/Discretionary spending is elevated/i)).toBeInTheDocument();
    expect(screen.getByText(/Impulsive/i)).toBeInTheDocument();
  });

  it("renders an error message when request fails", async () => {
    api.emotion.mockRejectedValueOnce(new Error("failed to fetch"));

    render(<EmotionInsightCard />);

    expect(await screen.findByText(/unable to load emotion insight right now/i)).toBeInTheDocument();
  });

  it("shows a fallback when no insight is returned", async () => {
    api.emotion.mockResolvedValueOnce(null);

    render(<EmotionInsightCard />);

    await waitFor(() => {
      expect(screen.getByText(/No emotion data available yet./i)).toBeInTheDocument();
    });
  });

  it("refetches when range is changed", async () => {
    const onRangeChange = jest.fn();

    api.emotion
      .mockResolvedValueOnce({
        state: "stable",
        message: "First insight",
      })
      .mockResolvedValueOnce({
        state: "impulsive",
        message: "Second insight",
      });

    render(<EmotionInsightCard onRangeChange={onRangeChange} />);

    expect(await screen.findByText(/Emotion Insight/i)).toBeInTheDocument();

    const rangeSelect = screen.getByRole("combobox");
    fireEvent.change(rangeSelect, { target: { value: "7" } });

    expect(onRangeChange).toHaveBeenCalledWith("7");

    await waitFor(() => {
      expect(api.emotion).toHaveBeenCalledTimes(2);
      expect(api.emotion).toHaveBeenNthCalledWith(1, "30");
      expect(api.emotion).toHaveBeenNthCalledWith(2, "7");
    });
  });
});
