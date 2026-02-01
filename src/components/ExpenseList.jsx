export default function ExpenseList({ expenses, onRemoveExpense }) {
    if (expenses.length === 0) {
        return <p style={{ marginTop: '1rem' }}>No expenses yet. Add one above 👆</p>;
    }

    return (
      <ul 
        style={{ 
          listStyle: 'none', 
          padding: 0, 
          marginTop: '1rem', 
          display: 'grid', 
          gap: '0.5rem' 
        }}
    >
        {expenses.map((exp) => (
          <li
            key={exp.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',  
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: '0.75rem 1rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{exp.name}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                ${exp.amount.toFixed(2)}
              </div>
            </div>

            <button type='button' onClick={() => onRemoveExpense(exp.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    );
} 
