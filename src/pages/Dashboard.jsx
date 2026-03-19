import { useEffect, useState } from "react";
import EmotionInsightCard from "../components/EmotionInsightCard";
import { api } from "../api";

/**
 * @typedef {Object} EmotionInsight
 * @property {string} state
 * @property {string} message
 * @property {string} [suggested_action]
 * @property {number} [confidence]
 */

export default function Dashboard() {
  /** @type {[EmotionInsight | null, (value: EmotionInsight | null) => void]} */
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadInsight() {
    setLoading(true);
    setError("");

    try {
      const data = await api.emotionRaw();
      setInsight(data);
    } catch (error) {
      console.error("Failed to load emotion insight:", error);
      setError("Failed to load emotion insight.");
      setInsight(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInsight();
  }, []);

  return (
    <div className="space-y-6">
      {loading && <p>Loading emotion insight...</p>}
      {error && <p style={{ color: "var(--danger, #dc2626)" }}>{error}</p>}
      {!loading && <EmotionInsightCard insight={insight} loading={loading} onRetry={loadInsight} />}
    </div>
  );
}
