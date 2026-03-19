import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmotionInsightCard from "./EmotionInsightCard";

describe("EmotionInsightCard", () => {
  it("renders nothing while loading", () => {
    const { container } = render(
      <EmotionInsightCard
        insight={{ state: "stable", message: "Local test insight." }}
        loading={true}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders insight state and message", () => {
    render(
      <EmotionInsightCard
        insight={{
          state: "impulsive",
          message: "Discretionary spending is elevated.",
          confidence: 0.78,
        }}
      />
    );

    expect(screen.getByText("Emotion-Aware Insight")).toBeInTheDocument();
    expect(screen.getByText("impulsive mode")).toBeInTheDocument();
    expect(screen.getByText("Discretionary spending is elevated.")).toBeInTheDocument();
    expect(screen.getByText("Confidence: 78%")).toBeInTheDocument();
  });

  it("renders optional suggested action when provided", () => {
    render(
      <EmotionInsightCard
        insight={{
          state: "stressed",
          message: "Your essential spending is running high this period.",
          suggested_action: "Review your biggest fixed expenses this week.",
        }}
      />
    );

    expect(screen.getByText("Suggested action: Review your biggest fixed expenses this week.")).toBeInTheDocument();
  });

  it("renders retry button when insight is unavailable", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();

    render(<EmotionInsightCard insight={null} onRetry={onRetry} />);

    expect(screen.getByText("Emotion-Aware Insight unavailable.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
