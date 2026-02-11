import type { Expense } from "../types/expense";

type SummaryProps = {
  expenses: Expense[];
};

export default function Summary({ expenses }: SummaryProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <section>
      <h2>Summary</h2>
      <p>Total: ${total.toFixed(2)}</p>
    </section>
  );
}


