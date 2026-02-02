import { useState } from 'react';

export default function ExpenseForm({ onAddExpense }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    const numericAmount = Number(amount);

    if (!trimmed) {
      setError('Please enter a valid expense name.');
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }

    setError('');

    onAddExpense({
      id: crypto.randomUUID(),
      name: trimmed,
      amount: Number(numericAmount.toFixed(2)),
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
        onChange={(e) => setAmount(e.target.value)}
        type='number'
        inputMode='decimal'
        step='0.01'
        min='0'
        placeholder='Amount'
      />

      {error && (
        <p style={{ color: 'red', margin: 0 }}>
          {error}
        </p>
      )}

      <button type='submit'>Add Expense</button>
    </form>
  );
}

