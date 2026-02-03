import { useState } from 'react';

export default function ExpenseForm({ onAddExpense }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [category, setCategory] = useState('General');

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
      category,
      createdAt: new Date().toISOString(),
    });

    setName('');
    setAmount('');
    setCategory('General');
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (error) setError('');
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    if (error) setError('');
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    if (error) setError('');
  };

  const isDisabled = !name.trim() || Number(amount) <= 0;


  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ display: 'grid', gap: '0.75rem', maxWidth: 420}}
    >
      <select value={category} onChange={handleCategoryChange}>
        <option value="General">General</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Shopping">Shopping</option>
        <option value="Utilities">Utilities</option>
        <option value="Health">Health</option>
        <option value="Other">Other</option>
      </select>

      <input 
        value={name}
        onChange={handleNameChange}
        placeholder='Expense Name (e.g., Coffee)'
        required
      />
      
      <input 
        value={amount}
        onChange={handleAmountChange}
        type='number'
        inputMode='decimal'
        step='0.01'
        min='0.01'
        placeholder='Amount'
        required
      />

      {error && (
        <p style={{ color: 'red', margin: 0 }}>
          {error}
        </p>
      )}

      <button type='submit' className='btn btn-primary' disabled={isDisabled}>
        Add Expense
      </button>

    </form>
  );
}

