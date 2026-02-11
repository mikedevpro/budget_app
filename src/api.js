const MODE = (process.env.REACT_APP_API_MODE || "local").toLowerCase(); // "local" | "backend"
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";
const KEY = "expenses";

const qs = (params) => {
  const s = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") s.set(k, String(v));
  });
  const out = s.toString();
  return out ? `?${out}` : "";
};

function ensureArray(v) {
  return Array.isArray(v) ? v : [];
}

function normalizeExpense(e) {
  return {
    id: e?.id ?? crypto.randomUUID(),
    name: String(e?.name ?? ""),
    amount: Number(e?.amount ?? 0),
    category: String(e?.category ?? "Uncategorized"),
    createdAt: e?.createdAt ?? new Date().toISOString(),
  };
}

function readAllLocal() {
  const saved = localStorage.getItem(KEY);
  let parsed = [];
  try {
    parsed = saved ? JSON.parse(saved) : [];
  } catch {
    parsed = [];
  }
  return ensureArray(parsed).map(normalizeExpense);
}

function writeAllLocal(expenses) {
  localStorage.setItem(KEY, JSON.stringify(ensureArray(expenses).map(normalizeExpense)));
}

function inRange(expense, range) {
  if (range === "all") return true;

  const days = Number(range);
  if (!Number.isFinite(days)) return true;

  const dt = expense?.createdAt ? new Date(expense.createdAt) : null;
  if (!dt || Number.isNaN(dt.getTime())) return true;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return dt >= cutoff;
}

function toYyyyMmDd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ---------- backend request ----------
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.detail || "Request failed";
    throw new Error(message);
  }

  return data;
}

// ---------- local insights ----------
function localByCategory(range = "30") {
  const expenses = readAllLocal().filter((e) => inRange(e, range));
  const map = new Map();

  for (const e of expenses) {
    const cat = (e.category || "Uncategorized").trim() || "Uncategorized";
    map.set(cat, (map.get(cat) || 0) + Number(e.amount || 0));
  }

  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total: Number(total.toFixed(2)) }))
    .sort((a, b) => b.total - a.total);
}

function localOverTime(range = "30") {
  const expenses = readAllLocal().filter((e) => inRange(e, range));
  const map = new Map();

  for (const e of expenses) {
    const dt = e.createdAt ? new Date(e.createdAt) : null;
    if (!dt || Number.isNaN(dt.getTime())) continue;

    const key = toYyyyMmDd(dt);
    map.set(key, (map.get(key) || 0) + Number(e.amount || 0));
  }

  return Array.from(map.entries())
    .map(([date, total]) => ({ date, total: Number(total.toFixed(2)) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function localSummary(range = "all") {
  const expenses = readAllLocal().filter((e) => inRange(e, range));
  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  return { total: Number(total.toFixed(2)), count: expenses.length };
}

async function getInsights(range) {
  const [byCategory, overTime] = await Promise.all([
    api.byCategory(range),
    api.overTime(range),
  ]);
  return { byCategory, overTime };
}

// ---------- public API ----------
export const api = {
  // Expenses
  listExpenses: async (params) => {
    if (MODE === "backend") {
      const list = await request(`/expenses${qs(params)}`);
      return ensureArray(list).map(normalizeExpense);
    }
    // local ignores params for now; you can add filter/sort later if needed
    return readAllLocal();
  },

  createExpense: async (payload) => {
    const exp = normalizeExpense(payload);
    if (MODE === "backend") {
      const created = await request("/expenses", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return normalizeExpense(created);
    }
    const all = readAllLocal();
    writeAllLocal([exp, ...all]);
    return exp;
  },

  deleteExpense: async (id) => {
    if (MODE === "backend") return request(`/expenses/${id}`, { method: "DELETE" });
    const next = readAllLocal().filter((e) => e.id !== id);
    writeAllLocal(next);
    return null;
  },

  updateExpense: async (id, payload) => {
    if (MODE === "backend") {
      const updated = await request(`/expenses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      return normalizeExpense(updated);
    }
    const all = readAllLocal();
    const next = all.map((e) => (e.id === id ? normalizeExpense({ ...e, ...payload }) : e));
    writeAllLocal(next);
    return next.find((e) => e.id === id) || null;
  },

  // Insights (Charts.jsx depends on these)
  byCategory: async (range) => {
    if (MODE === "backend") return request(`/insights/by-category${qs({ range })}`);
    return localByCategory(range);
  },

  overTime: async (range) => {
    if (MODE === "backend") return request(`/insights/over-time${qs({ range })}`);
    return localOverTime(range);
  },

  summary: async (range = "all") => {
    if (MODE === "backend") return request(`/insights/summary${qs({ range })}`);
    return localSummary(range);
  },

  insights: getInsights,
};
