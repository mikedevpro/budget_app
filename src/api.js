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

export const api = {
  listExpenses: () => request("/expenses"),
  createExpense: (payload) =>
    request("/expenses", { method: "POST", body: JSON.stringify(payload) }),
  deleteExpense: (id) => request(`/expenses/${id}`, { method: "DELETE" }),

  // optional later
  updateExpense: (id, payload) =>
    request(`/expenses/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),

  summary: () => request("/insights/summary"),
  byCategory: () => request("/insights/by-category"),
};
