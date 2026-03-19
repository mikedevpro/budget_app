export default function EmotionInsightCard({ insight, loading = false, onRetry }) {
  if (loading) {
    return null;
  }

  if (!insight) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Emotion-Aware Insight unavailable.
        </p>

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Retry
          </button>
        ) : null}
      </section>
    );
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
