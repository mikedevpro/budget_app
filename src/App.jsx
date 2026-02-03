import { useEffect, useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import Charts from './components/Charts';

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(expenses.map((e) => e.category)))];

  const visibleExpenses =
    categoryFilter === 'All'
      ? expenses
      : expenses.filter((e) => e.category === categoryFilter);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.25rem' }}>My Budget App</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>Track your monthly expenses</p>

      <ExpenseForm onAddExpense={handleAddExpense} />

      <label style={{ display: 'block', marginTop: '1rem', fontWeight: 500 }}>
        Filter by category
      </label>
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        style={{
          margin: '0.5rem 0 1rem',
          padding: '0.5rem',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
        }}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <Summary expenses={expenses} />
      <Charts expenses={expenses} />

      <ExpenseList
        visibleExpenses={visibleExpenses}
        onDeleteExpense={handleDeleteExpense}
      />
    </div>
  );
}
























// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
