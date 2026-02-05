import { useEffect, useState } from "react";
import { api } from "../api";

export default function Summary({ refreshToken }) {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      setLoading(true);
      setError("");
      try {
        const data = await api.summary();
        if (isMounted) setTotal(Number(data.total_spent || 0));
      } catch {
        if (isMounted) setError("Failed to load summary");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSummary();
    return () => {
      isMounted = false;
    };
  }, [refreshToken]);

  return (
    <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #e5e7eb", borderRadius: 8 }}>
      <div style={{ fontWeight: 700 }}>All Expenses Total</div>
      {loading ? (
        <div style={{ opacity: 0.7 }}>Loading…</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <div style={{ fontSize: 24 }}>${total.toFixed(2)}</div>
      )}
    </div>
  );
}

