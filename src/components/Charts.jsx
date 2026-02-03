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

function toISODate(isoString) {
  // Converts "2026-02-03T..." -> "2026-02-03"
  return new Date(isoString).toISOString().slice(0, 10);
}

export default function Charts({ expenses }) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  // 1) Category totals
  const categoryMap = new Map();
  for (const exp of safeExpenses) {
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
  for (const exp of safeExpenses) {
    if (!exp.createdAt) continue;
    const day = toISODate(exp.createdAt);
    const amt = Number(exp.amount || 0);
    dayMap.set(day, (dayMap.get(day) || 0) + amt);
  }

  const overTime = Array.from(dayMap.entries())
    .map(([date, total]) => ({
      date,
      total: Number(total.toFixed(2)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (safeExpenses.length === 0) {
    return (
      <div style={{ marginTop: "1rem", opacity: 0.8 }}>
        Add a few expenses to see charts.
      </div>
    );
  }

  return (
    <div style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
      {/* Spending by Category */}
      <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Spending by Category</div>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={byCategory} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(v) => `$${v}`} />
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
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v) => formatMoney(v)} />
              <Line type="monotone" dataKey="total" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
