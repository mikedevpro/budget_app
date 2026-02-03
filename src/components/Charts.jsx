import { useMemo, useState } from "react";
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

function formatMoney(value) {
  const n = Number(value || 0);
  return `$${n.toFixed(2)}`;
}

function toISODate(dateValue) {
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function formatShortDate(yyyyMmDd) {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Charts({ expenses }) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const [range, setRange] = useState("30"); // "7", "30", "all"

  const filteredForCharts = useMemo(() => {
    if (range === "all") return safeExpenses;

    const days = Number(range);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return safeExpenses.filter((e) => {
      const d = new Date(e.createdAt);
      return !Number.isNaN(d.getTime()) && d >= cutoff;
    });
  }, [safeExpenses, range]);

  // If there are no expenses at all
  if (safeExpenses.length === 0) {
    return (
      <div style={{ marginTop: "1rem", opacity: 0.8 }}>
        Add a few expenses to see charts.
      </div>
    );
  }

  // If there are expenses, but none in the selected time range
  if (filteredForCharts.length === 0) {
    return (
      <div style={{ marginTop: "1rem", opacity: 0.8 }}>
        No expenses in the selected range.
      </div>
    );
  }

  // 1) Category totals
  const categoryMap = new Map();
  for (const exp of filteredForCharts) {
    const category = exp.category || "General";
    const amt = Number(exp.amount || 0);
    categoryMap.set(category, (categoryMap.get(category) || 0) + amt);
  }

  const byCategory = Array.from(categoryMap.entries())
    .map(([category, total]) => ({
      category,
      total: Number(total.toFixed(2)),
    }))
    .sort((a, b) => b.total - a.total);

  // 2) Daily totals (spending over time)
  const dayMap = new Map();
  for (const exp of filteredForCharts) {
    const day = toISODate(exp.createdAt);
    if (!day) continue;

    const amt = Number(exp.amount || 0);
    dayMap.set(day, (dayMap.get(day) || 0) + amt);
  }

  const overTime = Array.from(dayMap.entries())
    .map(([date, total]) => ({
      date,
      total: Number(total.toFixed(2)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

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
        <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
          Spending by Category
        </div>
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
        <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
          Spending Over Time
        </div>
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

