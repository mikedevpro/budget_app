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

  const categories = [
    'All', 
    ...Array.from(
      new Set(expenses.map((e) => e.category || 'General'))
    ),
  ];

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
    <div className="container">
    <header>
      <h1 style={{ marginBottom: "0.25rem" }}>My Budget App</h1>
      <p className="section-subtitle">Track your monthly expenses</p>
    </header>

    <div className="section card">
      <div className="section-title">Add an expense</div>
      <ExpenseForm onAddExpense={handleAddExpense} />
    </div>

    <div className="section card">
      <div className="section-title">Filter</div>
      <label style={{ display: "block", fontWeight: 500, marginBottom: "0.5rem" }}>
        Category
      </label>
      <select
        className="select"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

    <div className="section card">
      <Summary 
      expenses={expenses} />
    </div>

    <div className="section card">
      <Charts 
      expenses={visibleExpenses} />
    </div>

    <div className="section card">
      <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />
      <div className="section-title">Expenses</div>
      <ExpenseList 
      visibleExpenses={visibleExpenses} 
      onDeleteExpense={handleDeleteExpense} />
    </div>
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
