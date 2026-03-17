import { useEffect, useState } from "react";
import { api } from "../api";

const stateStyles = {
  stressed: {
    label: "Stressed",
    tone: "⚠️ High pressure",
    bg: "#fff7ed",
  },
  impulsive: {
    label: "Impulsive",
    tone: "🚨 Watch spending",
    bg: "#eef2ff",
  },
  stable: {
    label: "Stable",
    tone: "✅ Steady",
    bg: "#ecfeff",
  },
  neutral: {
    label: "Neutral",
    tone: "🟢 Balanced",
    bg: "#f0fdf4",
  },
};

export default function EmotionInsightCard({
  initialRange = "30",
  refreshToken = 0,
  onRangeChange,
  useRawEndpoint = false,
  insight: externalInsight,
  loading: externalLoading,
}) {
  const [range, setRange] = useState(initialRange);
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  if (externalInsight) {
    const state = externalInsight.state || "neutral";
    const style = stateStyles[state] || stateStyles.neutral;

    if (externalLoading) {
      return (
        <div className="card" style={{ minHeight: 92, opacity: 0.8 }}>
          Loading emotion insight...
        </div>
      );
    }

    return (
      <section className="card" style={{ background: style.bg }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
          <strong>Emotion Insight</strong>
        </div>

        <div style={{ marginTop: "0.7rem", display: "grid", gap: "0.35rem" }}>
          <div style={{ fontWeight: 700 }}>{style.label}</div>
          <div style={{ opacity: 0.8 }}>{style.tone}</div>
          <div>{externalInsight.message || "Your spending patterns are stable."}</div>
        </div>
      </section>
    );
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
    const data = useRawEndpoint ? await api.emotionRaw() : await api.emotion(range);
        if (!mounted) return;
        setInsight(data || null);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Unable to load emotion insight right now.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [range, refreshToken, useRawEndpoint]);

  const handleRangeChange = (nextRange) => {
    setRange(nextRange);
    if (typeof onRangeChange === "function") onRangeChange(nextRange);
  };

  if (loading) {
    return (
      <div className="card" style={{ minHeight: 92, opacity: 0.8 }}>
        Analyzing spending emotion…
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ borderColor: "#fecaca", background: "#fef2f2", color: "#b91c1c" }}>
        {error}
      </div>
    );
  }

  if (!insight) {
    return <div className="card">No emotion data available yet.</div>;
  }

  const state = insight.state || "neutral";
  const style = stateStyles[state] || stateStyles.neutral;

  return (
    <section className="card" style={{ background: style.bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
        <strong>Emotion Insight</strong>
        <select className="select" value={range} onChange={(e) => handleRangeChange(e.target.value)}>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div style={{ marginTop: "0.7rem", display: "grid", gap: "0.35rem" }}>
        <div style={{ fontWeight: 700 }}>{style.label}</div>
        <div style={{ opacity: 0.8 }}>{style.tone}</div>
        <div>{insight.message || "Your spending patterns are stable."}</div>
      </div>
    </section>
  );
}
