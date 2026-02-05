import { useEffect, useMemo, useRef, useState } from 'react';

export default function ExpenseForm({ onAddExpense }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [category, setCategory] = useState('General');
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

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
      // id: crypto.randomUUID(),
      name: trimmed,
      amount: Number(numericAmount.toFixed(2)),
      category,
      // createdAt: new Date().toISOString(),
    });

    setName('');
    setAmount('');
    setCategory('General');
    nameRef.current?.focus();
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

  // const isDisabled = !name.trim() || Number(amount) <= 0;

  const isDisabled = useMemo(() => {
    const trimmed = name.trim();
    const numericAmount = Number(amount);
    return !trimmed || !Number.isFinite(numericAmount) || numericAmount <= 0;
  }, [name, amount]);

  const nameId = "expense-name";
  const amountId = "expense-amount";
  const categoryId = "expense-category";
  const errorId = "expense-form-error";

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem', maxWidth: 420 }}>
    <div style={{ display: 'grid', gap: '0.35rem' }}>
      <label htmlFor={categoryId} style={{ fontWeight: 600 }}>
        Category
      </label>
      <select
        id={categoryId}
        className="select"
        value={category}
        onChange={handleCategoryChange}
      >
        <option value="General">General</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Shopping">Shopping</option>
        <option value="Utilities">Utilities</option>
        <option value="Health">Health</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div style={{ display: 'grid', gap: '0.35rem' }}>
      <label htmlFor={nameId} style={{ fontWeight: 600 }}>
        Expense name
      </label>
      <input
        id={nameId}
        ref={nameRef}
        className="input"
        value={name}
        onChange={handleNameChange}
        placeholder="Expense Name (e.g., Coffee)"
        autoComplete="off"
        required
        aria-invalid={Boolean(error) && !name.trim()}
        aria-describedby={error ? errorId : undefined}
      />
    </div>

    <div style={{ display: 'grid', gap: '0.35rem' }}>
      <label htmlFor={amountId} style={{ fontWeight: 600 }}>
        Amount
      </label>
      <input
        id={amountId}
        className="input"
        value={amount}
        onChange={handleAmountChange}
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0.01"
        placeholder="Amount"
        required
        aria-invalid={Boolean(error) && !(Number(amount) > 0)}
        aria-describedby={error ? errorId : undefined}
      />
      <div style={{ fontSize: '0.85rem', opacity: 0.75 }}>
        Amount must be greater than $0.00
      </div>
    </div>

    {error && (
      <p id={errorId} role="alert" style={{ color: 'red', margin: 0 }}>
        {error}
      </p>
    )}

      <button type='submit' className='btn btn-primary' disabled={isDisabled}>
        Add expense
      </button>
    </form>
  );
}

