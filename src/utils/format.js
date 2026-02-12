export function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "$0.00";

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatMoneyCompact(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "$0";

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatShortDate(yyyyMmDd) {
  if (!yyyyMmDd) return "";

  const [y, m, d] = String(yyyyMmDd).split("-").map(Number);
  if (!y || !m || !d) return "";

  const dt = new Date(y, m - 1, d);
  if (Number.isNaN(dt.getTime())) return "";

  return dt.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
