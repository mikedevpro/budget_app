import { useEffect, useRef, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";
import Charts from "./components/Charts";
import { api } from "./api";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") dismissToast();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const loadExpenses = async () => {
    setError("");
    setLoading(true);
    try {
      const list = await api.listExpenses();
      setExpenses(list);
    } catch (e) {
      setError(e.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(expenses.map((e) => e.category || "General"))),
  ];

  const visibleExpenses =
    categoryFilter === "All"
      ? expenses
      : expenses.filter((e) => (e.category || "General") === categoryFilter);

  const handleAddExpense = async (newExpense) => {
    setError("");

    // Be flexible: if ExpenseForm currently creates id/createdAt, we ignore them.
    const payload = {
      name: (newExpense?.name || "").trim(),
      amount: Number(newExpense?.amount),
      category: (newExpense?.category || "General").trim(),
    };

    if (!payload.name) return;
    if (!Number.isFinite(payload.amount) || payload.amount <= 0) return;

    try {
      const created = await api.createExpense(payload);

      // Optimistic update (no refetch needed)
      setExpenses((prev) => [created, ...prev]);

      setToast({
        title: "Expense Added ✅",
        body: `${created.name} • $${Number(created.amount || 0).toFixed(2)}`,
      });
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(dismissToast, 2200);
    } catch (e) {
      setError(e.message || "Failed to add expense");
    }
  };

  const handleDeleteExpense = async (id) => {
    setError("");
    // Optimistic remove
    const prev = expenses;
    setExpenses((cur) => cur.filter((e) => e.id !== id));

    try {
      await api.deleteExpense(id);
    } catch (e) {
      // Revert on failure
      setExpenses(prev);
      setError(e.message || "Failed to delete expense");
    }
  };

  return (
    <div className="container">
      <header>
        <h1 style={{ marginBottom: "0.25rem" }}>My Budget App</h1>
        <p className="section-subtitle">Track your monthly expenses</p>
      </header>

      {error ? (
        <div
          className="section card"
          style={{ border: "1px solid #fecaca", background: "#fef2f2" }}
          role="alert"
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Something went wrong</div>
          <div style={{ marginBottom: 12 }}>{error}</div>
          <button type="button" className="btn" onClick={loadExpenses}>
            Retry
          </button>
        </div>
      ) : null}

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
          disabled={loading}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="section card">
        {/* Keeping your Summary as-is (it computes from expenses) */}
        <Summary expenses={expenses} />
      </div>

      <div className="section card">
        <Charts expenses={visibleExpenses} />
      </div>

      <div className="section card">
        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />
        <div className="section-title">Expenses</div>

        {loading ? (
          <div style={{ opacity: 0.8 }}>Loading…</div>
        ) : (
          <ExpenseList
            visibleExpenses={visibleExpenses}
            onDeleteExpense={handleDeleteExpense}
          />
        )}
      </div>

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <div style={{ flex: 1 }}>
              <p className="toast-title">{toast.title}</p>
              <p className="toast-body">{toast.body}</p>
            </div>

            <button
              type="button"
              className="btn"
              onClick={dismissToast}
              aria-label="Dismiss notification"
              title="Dismiss"
              style={{ padding: "0.25rem 0.5rem" }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
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
