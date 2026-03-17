import { useEffect, useState } from "react";
import EmotionInsightCard from "../components/EmotionInsightCard";
import { api } from "../api";

export default function Dashboard() {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInsight() {
      try {
        const data = await api.emotionRaw();
        setInsight(data);
      } catch (error) {
        console.error("Failed to load emotion insight:", error);
        setError("Failed to load emotion insight.");
      } finally {
        setLoading(false);
      }
    }

    loadInsight();
  }, []);

  return (
    <div className="space-y-6">
      {loading && <p>Loading emotion insight...</p>}
      {error && <p style={{ color: "var(--danger, #dc2626)" }}>{error}</p>}
      {insight && <EmotionInsightCard insight={insight} loading={loading} />}
    </div>
  );
}
