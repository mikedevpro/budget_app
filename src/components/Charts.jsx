import { useEffect, useMemo, useRef, useState } from "react";
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
import { formatMoney, formatMoneyCompact, formatShortDate } from "../utils/format";

function escapeCsv(value) {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function buildInsightsCsv({ range, byCategory, overTime }) {
  const lines = [];

  lines.push(`Range,${escapeCsv(range)}`);
  lines.push("");

  lines.push("Spending by Category");
  lines.push("category,total");
  for (const row of byCategory || []) {
    lines.push(`${escapeCsv(row.category)},${escapeCsv(Number(row.total || 0).toFixed(2))}`);
  }

  lines.push("");
  lines.push("Spending Over Time");
  lines.push("date,total");
  for (const row of overTime || []) {
    lines.push(`${escapeCsv(row.date)},${escapeCsv(Number(row.total || 0).toFixed(2))}`);
  }

  return lines.join("\n");
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

export default function Charts({ refreshToken }) {
  const [range, setRange] = useState("30"); // "7", "30", "all"

  const [byCategory, setByCategory] = useState([]);
  const [overTime, setOverTime] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const hasLoadedOnceRef = useRef(false);

  const hasAnyData = useMemo(() => {
    return (byCategory?.length || 0) > 0 || (overTime?.length || 0) > 0;
  }, [byCategory, overTime]);

  const handleExportCsv = () => {
    const csv = buildInsightsCsv({ range, byCategory, overTime });
    const stamp = new Date().toISOString().slice(0, 10);
    downloadTextFile(`budget-insights-${range}-${stamp}.csv`, csv);
  };

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!hasLoadedOnceRef.current) setLoading(true);
      setIsRefreshing(true);
      setError("");

      try {
        const { byCategory: cats, overTime: time } = await api.insights(range);

        if (!isMounted) return;

        if (Array.isArray(cats)) {
          const sorted = cats
            .map((x) => ({ category: x.category, total: Number(x.total || 0) }))
            .sort((a, b) => b.total - a.total);

          const top = sorted.slice(0, 9);
          const rest = sorted.slice(9);
          const otherTotal = Number(
            rest.reduce((sum, x) => sum + x.total, 0).toFixed(2)
          );

          setByCategory(
            otherTotal > 0 ? [...top, { category: "Other", total: otherTotal }] : top
          );
        } else {
          setByCategory([]);
        }

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
        if (isMounted) {
          setLoading(false);
          setIsRefreshing(false);
          hasLoadedOnceRef.current = true;
          setLastUpdated(new Date());
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [range, refreshToken]);

  


  if (loading) {
    return (
      <div style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
        <div style={{ height: 44, borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", opacity: 0.6 }} />
        <div style={{ height: 320, borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", opacity: 0.6 }} />
        <div style={{ height: 320, borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", opacity: 0.6 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginTop: "1rem", opacity: 0.9 }}>
        <div style={{ color: "red" }}>{error}</div>
      </div>
    );
  }

  if (!hasAnyData && range === "all") {
    return (
      <div style={{ marginTop: "1rem", opacity: 0.8, color: "var(--muted)" }}>
        Add your first expense to unlock insights 📊
        <div style={{ marginTop: "0.75rem" }}>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Add an expense
          </button>
        </div>
      </div>
    );
  }

  if (!hasAnyData) {
    return (
      <div style={{ marginTop: "1rem", opacity: 0.8, color: "var(--muted)" }}>
        No expenses in the selected range.
        <div style={{ fontSize: "0.85rem", marginTop: "0.25rem", color: "var(--muted)" }}>
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

        {isRefreshing && (
          <div style={{ fontSize: "0.85rem", opacity: 0.7, color: "var(--muted)" }}>Updating…</div>
        )}

        {!isRefreshing && lastUpdated && (
          <div style={{ fontSize: "0.85rem", opacity: 0.6, color: "var(--muted)" }}>
            Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}

        <select
          value={range}
          disabled={isRefreshing}
          onChange={(e) => setRange(e.target.value)}
          style={{
            marginLeft: "auto",
            padding: "0.4rem",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--text)",
            opacity: isRefreshing ? 0.7 : 1,
            cursor: isRefreshing ? "not-allowed" : "pointer",
          }}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="all">All time</option>
        </select>

        <button
          type="button"
          onClick={handleExportCsv}
          disabled={!hasAnyData}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--text)",
            cursor: hasAnyData ? "pointer" : "not-allowed",
            opacity: hasAnyData ? 1 : 0.6,
          }}
        >
          Export CSV
        </button>
      </div>

      {/* Spending by Category */}
      <div className="card card-hover" style={{ padding: "1rem" }}>
        <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Spending by Category</div>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={byCategory} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tickFormatter={formatMoneyCompact} />
              <Tooltip formatter={(v) => formatMoney(v)} 
                contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)" }}
              />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spending Over Time */}
      <div className="card card-hover" style={{ padding: "1rem" }}>

        <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Spending Over Time</div>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={overTime} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatShortDate} />
              <YAxis tickFormatter={formatMoneyCompact} />
              <Tooltip
                formatter={(v) => formatMoney(v)}
                contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)" }}
                labelFormatter={(label) => formatShortDate(label)}
              />
              <Line type="monotone" dataKey="total" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
