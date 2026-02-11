export default function Summary ({ expenses = [] }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <section>
      <h2>Summary</h2>
      <p>Total: ${total.toFixed(2)}</p>
    </section>
  );
}


