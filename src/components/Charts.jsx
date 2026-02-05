import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { api } from "../api";

function formatMoney(value) {
  const n = Number(value || 0);
  return `$${n.toFixed(2)}`;
}

function formatShortDate(yyyyMmDd) {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Charts({ refreshToken }) {
  const [range, setRange] = useState("30"); // "7", "30", "all"

  const [byCategory, setByCategory] = useState([]);
  const [overTime, setOverTime] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hasAnyData = useMemo(() => {
    return (byCategory?.length || 0) > 0 || (overTime?.length || 0) > 0;
  }, [byCategory, overTime]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [cats, time] = await Promise.all([
          api.byCategory(range),     // expects [{ category, total }]
          api.overTime(range),       // expects [{ date: "YYYY-MM-DD", total }]
        ]);

        if (!isMounted) return;

        setByCategory(
          Array.isArray(cats)
            ? cats
                .map((x) => ({ category: x.category, total: Number(x.total || 0) }))
                .sort((a, b) => b.total - a.total)
            : []
        );

        setOverTime(
          Array.isArray(time)
            ? time
                .map((x) => ({ date: x.date, total: Number(x.total || 0) }))
                .sort((a, b) => a.date.localeCompare(b.date))
            : []
        );
      } catch (e) {
        if (isMounted) setError("Failed to load charts");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [range, refreshToken]);

  if (loading) {
    return <div style={{ marginTop: "1rem", opacity: 0.8 }}>Loading insights…</div>;
  }

  if (error) {
    return (
      <div style={{ marginTop: "1rem", opacity: 0.9 }}>
        <div style={{ color: "red" }}>{error}</div>
      </div>
    );
  }

  if (!hasAnyData) {
    return (
      <div style={{ marginTop: "1rem", opacity: 0.8 }}>
        Add your first expense to unlock insights 📊
      </div>
    );
  }

  if (byCategory.length === 0 && overTime.length === 0) {
    return (
      <div style={{ marginTop: "1rem", opacity: 0.8 }}>
        No expenses in the selected range.
        <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Try expanding the range or add more expenses.
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
      {/* Header + range control */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>Charts</div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          style={{
            marginLeft: "auto",
            padding: "0.4rem",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Spending by Category */}
      <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Spending by Category</div>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={byCategory} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={formatMoney} />
              <Tooltip formatter={(v) => formatMoney(v)} />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spending Over Time */}
      <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Spending Over Time</div>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={overTime} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatShortDate} />
              <YAxis tickFormatter={formatMoney} />
              <Tooltip
                formatter={(v) => formatMoney(v)}
                labelFormatter={(label) => formatShortDate(label)}
              />
              <Line type="monotone" dataKey="total" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

