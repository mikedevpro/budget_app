type EmotionInsight = {
  state: string;
  message: string;
  suggested_action?: string;
  confidence?: number;
};

type EmotionInsightCardProps = {
  insight: EmotionInsight;
  loading?: boolean;
};

export default function EmotionInsightCard({
  insight,
  loading = false,
}: EmotionInsightCardProps) {
  if (loading) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Emotion-Aware Insight
        </p>
        <h3 className="text-lg font-semibold capitalize text-slate-900 dark:text-slate-100">
          {insight.state} mode
        </h3>
      </div>

      <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
        {insight.message}
      </p>

      {typeof insight.confidence === "number" && (
        <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          Confidence: {Math.round(insight.confidence * 100)}%
        </p>
      )}

      {insight.suggested_action && (
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">
          Suggested action: {insight.suggested_action}
        </p>
      )}
    </section>
  );
}
