const KEY = "expenses";

function safeParse(json) {
  try {
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

function getAllExpenses() {
  return safeParse(localStorage.getItem(KEY));
}

// expects "7", "30", "all"
function inRange(expense, range) {
  if (range === "all") return true;

  const days = Number(range);
  if (!Number.isFinite(days)) return true;

  const created = expense.createdAt ? new Date(expense.createdAt) : null;
  if (!created || Number.isNaN(created.getTime())) return true;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return created >= cutoff;
}

function toYyyyMmDd(date) {
  // local date → YYYY-MM-DD
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const api = {
  // optional: if other parts of your app call api.expenses()
  async expenses() {
    return getAllExpenses();
  },

  async createExpense(expense) {
    const all = getAllExpenses();
    const next = [expense, ...all];
    localStorage.setItem(KEY, JSON.stringify(next));
    return expense;
  },

  async deleteExpense(id) {
    const all = getAllExpenses();
    const next = all.filter((e) => e.id !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
  },

  // Charts.jsx expects: [{ category, total }]
  async byCategory(range = "30") {
    const expenses = getAllExpenses().filter((e) => inRange(e, range));
    const map = new Map();

    for (const e of expenses) {
      const cat = (e.category || "Uncategorized").trim() || "Uncategorized";
      const amt = Number(e.amount || 0);
      map.set(cat, (map.get(cat) || 0) + (Number.isFinite(amt) ? amt : 0));
    }

    return Array.from(map.entries()).map(([category, total]) => ({
      category,
      total: Number(total.toFixed(2)),
    }));
  },

  // Charts.jsx expects: [{ date: "YYYY-MM-DD", total }]
  async overTime(range = "30") {
    const expenses = getAllExpenses().filter((e) => inRange(e, range));
    const map = new Map();

    for (const e of expenses) {
      const created = e.createdAt ? new Date(e.createdAt) : null;
      const dayKey = created && !Number.isNaN(created.getTime())
        ? toYyyyMmDd(created)
        : "Unknown";

      const amt = Number(e.amount || 0);
      map.set(dayKey, (map.get(dayKey) || 0) + (Number.isFinite(amt) ? amt : 0));
    }

    // If you have "Unknown", keep it but it may sort oddly; you can remove if you prefer.
    return Array.from(map.entries())
      .filter(([date]) => date !== "Unknown")
      .map(([date, total]) => ({
        date,
        total: Number(total.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
};




// const API_BASE = "http://localhost:8000";

// async function request(path, options = {}) {
//   const res = await fetch(`${API_BASE}${path}`, {
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//     ...options,
//   });

//   if (res.status === 204) return null;

//   const data = await res.json().catch(() => null);

//   if (!res.ok) {
//     const message = data?.detail || "Request failed";
//     throw new Error(message);
//   }

//   return data;
// }

// const qs = (params) => {
//   const s = new URLSearchParams();
//   Object.entries(params || {}).forEach(([k, v]) => {
//     if (v !== undefined && v !== null && v !== "") s.set(k, String(v));
//   });
//   const out = s.toString();
//   return out ? `?${out}` : "";
// };


// export const api = {
//   listExpenses: (params) => request(`/expenses${qs(params)}`),
//   createExpense: (payload) =>
//     request("/expenses", { method: "POST", body: JSON.stringify(payload) }),
//   deleteExpense: (id) => request(`/expenses/${id}`, { method: "DELETE" }),
//   byCategory: (range) => request(`/insights/by-category${qs({ range })}`),
//   overTime: (range) => request(`/insights/over-time${qs({ range })}`),


//   // optional later
//   updateExpense: (id, payload) =>
//     request(`/expenses/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),

//   summary: () => request("/insights/summary"),
//   byCategory: (range) => request(`/insights/by-category${qs({ range })}`),
// };
