const API_BASE = "http://localhost:8000";

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

const qs = (params) => {
  const s = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") s.set(k, String(v));
  });
  const out = s.toString();
  return out ? `?${out}` : "";
};


export const api = {
  listExpenses: (params) => request(`/expenses${qs(params)}`),
  createExpense: (payload) =>
    request("/expenses", { method: "POST", body: JSON.stringify(payload) }),
  deleteExpense: (id) => request(`/expenses/${id}`, { method: "DELETE" }),
  byCategory: (range) => request(`/insights/by-category${qs({ range })}`),
  overTime: (range) => request(`/insights/over-time${qs({ range })}`),
  updateExpense: (id, payload) =>
    request(`/expenses/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  summary: () => request("/insights/summary"),
};
