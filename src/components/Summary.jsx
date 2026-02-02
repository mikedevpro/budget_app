export default function Summary({ expenses }) {
  const total = Array.isArray(expenses)
    ? expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
    : 0;

  return (
    <div  
    style={{ 
      marginTop: '1rem', 
      padding: '1rem', 
      border: '1px solid #e5e7eb', 
      borderRadius: 8 
    }}
  >
      <div style={{ fontWeight: 700 }}>All Expenses Total</div>
      <div style={{ fontSize: 24 }}>${total.toFixed(2)}</div>
    </div>
  );
}