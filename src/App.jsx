import { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import { useEffect } from 'react';

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleRemoveExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>My Budget App</h1>
        <p style={{ marginTop: 0, opacity: 0.8 }}>Track your monthly expenses</p>

        <ExpenseForm onAddExpense={handleAddExpense} />
        <Summary expenses={expenses} />
        <ExpenseList expenses={expenses} onRemoveExpense={handleRemoveExpense} />
        
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
