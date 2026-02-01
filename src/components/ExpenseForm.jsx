import { useState } from 'react';

export default function ExpenseForm({ onAddExpense }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    const numericAmount = Number(amount);

    if (!trimmed) return;
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return;

    onAddExpense({
      id: crypto.randomUUID(),
      name: trimmed,
      amount: numericAmount,
      createdAt: new Date().toISOString(),
    });

    setName('');
    setAmount('');
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ display: 'grid', gap: '0.75rem', maxWidth: 420}}
    >
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Expense Name (e.g., Coffee)'
      />
      
      <input 
        value={amount}
        onChange={(e) => {
          console.log('AMOUNT INPUT:', e.target.value);
          setAmount(e.target.value);
        }}
        type='number'
        step='0.01'
        min='0'
        placeholder='Amount (e.g., 42.50)'
      />

      <button type='submit'>Add Expense</button>
    </form>
  );
}

