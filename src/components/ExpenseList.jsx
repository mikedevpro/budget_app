export default function ExpenseList({ visibleExpenses, onDeleteExpense }) {
  if (!Array.isArray(visibleExpenses) || visibleExpenses.length === 0) {
    return <p style={{ marginTop: '1rem' }}>No expenses yet. Add one above 👆</p>;
  }

  const total = visibleExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <>
      <div
        style={{
          margin: '1rem 0',
          padding: '1rem',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
        }}
      >
        <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Total spent</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${total.toFixed(2)}</div>
      </div>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          marginTop: '1rem',
          display: 'grid',
          gap: '0.5rem',
        }}
      >
        {visibleExpenses.map((exp) => (
          <li
            key={exp.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
            }}
          >
            <div>
              <strong>{exp.name}</strong>
              <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: 2 }}>
                {exp.category} &middot; {new Date(exp.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontWeight: 600 }}>${exp.amount.toFixed(2)}</div>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete "${exp.name}"?`)) onDeleteExpense(exp.id);
                }}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  padding: '0.35rem 0.6rem',
                  cursor: 'pointer',
                  background: '#fff',
                }}
                aria-label={`Delete ${exp.name}`}
                title="Delete"
              >
                &times;
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

