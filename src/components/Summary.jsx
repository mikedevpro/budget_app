export default function Summary({ expenses }) {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <div style={{ fontWeight: 700 }}>Total Spent</div>
      <div style={{ fontSize: 24 }}>${total.toFixed(2)}</div>
    </div>
  );
}