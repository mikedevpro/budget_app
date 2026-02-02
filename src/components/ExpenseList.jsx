export default function ExpenseList({ expenses, onRemoveExpense }) {
    if (expenses.length === 0) {
        return <p style={{ marginTop: '1rem' }}>No expenses yet. Add one above 👆</p>;
    }

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    <div style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: 12 }}>
      <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Total spent</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${total.toFixed(2)}</div>
    </div>


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
              <strong>{exp.name}</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontWeight: 600 }}>${exp.amount.toFixed(2)}</div>
              </div>
            

            <button 
              type='button' 
              onClick={() => onRemoveExpense(exp.id)}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: '0.35rem 0.6rem',
                cursor: 'pointer',
                background: 'white',
              }}
              aria-label={`Delete ${exp.name}`}
              title='Delete'
            >
              &times;
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
} 
