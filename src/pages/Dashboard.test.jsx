import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";

jest.mock("../api", () => ({
  api: {
    emotionRaw: jest.fn(),
  },
}));

const { api } = require("../api");

beforeEach(() => {
  jest.clearAllMocks();
});

function assertInitialLoadingState() {
  expect(screen.getByText("Loading emotion insight...")).toBeInTheDocument();
  expect(screen.queryByText("Local test insight.")).not.toBeInTheDocument();
  expect(screen.queryByText("Emotion-Aware Insight")).not.toBeInTheDocument();
  expect(screen.queryByText("Failed to load emotion insight.")).not.toBeInTheDocument();
}

function assertFinalState({
  mustContain = [],
  mustNotContain = [],
}) {
  for (const expectation of mustContain) {
    expect(screen.getByText(expectation)).toBeInTheDocument();
  }

  for (const expectation of mustNotContain) {
    expect(screen.queryByText(expectation)).not.toBeInTheDocument();
  }
}

test.each([
  {
    name: "success",
    setup: () =>
      api.emotionRaw.mockResolvedValue({
        state: "stable",
        message: "Local test insight.",
      }),
    doneText: "Local test insight.",
    expectedState: {
      mustContain: ["Emotion-Aware Insight", "stable mode", "Local test insight."],
      mustNotContain: ["Failed to load emotion insight."],
    },
  },
  {
    name: "error",
    setup: () =>
      api.emotionRaw.mockRejectedValue(new Error("network down")),
    doneText: "Failed to load emotion insight.",
    expectedState: {
      mustContain: ["Failed to load emotion insight."],
      mustNotContain: ["Emotion-Aware Insight", "Local test insight."],
    },
  },
  {
    name: "partial payload",
    setup: () =>
      api.emotionRaw.mockResolvedValue({
        state: "stable",
        message: "Your spending patterns are stable.",
      }),
    doneText: "Your spending patterns are stable.",
    expectedState: {
      mustContain: ["Emotion-Aware Insight", "stable mode", "Your spending patterns are stable."],
      mustNotContain: ["Failed to load emotion insight."],
    },
  },
])("Dashboard state transition: $name", async ({ setup, doneText, expectedState }) => {
  setup();

  render(<Dashboard />);

  assertInitialLoadingState();

  await screen.findByText(doneText);
  expect(screen.queryByText("Loading emotion insight...")).not.toBeInTheDocument();
  assertFinalState(expectedState);
  expect(api.emotionRaw).toHaveBeenCalledTimes(1);
});
