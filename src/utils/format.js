export function formatMoney(value) {
  const n = Number(value || 0);
  return `$${n.toFixed(2)}`;
}

export function formatShortDate(yyyyMmDd) {
  const [y, m, d] = String(yyyyMmDd || "").split("-").map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
