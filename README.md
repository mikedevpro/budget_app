
## 📊 Budget Tracker App

- A polished budget tracking app built with **React** that helps users log expenses, explore spending patterns, and stay organized with categories, filters, and charts. Built to showcase product thinking, clean state architecture, and UX polish.

- This project demonstrates how to take a simple idea and evolve it into a production-quality experience through iterative improvements.



> **Goal:** Showcase junior full-stack skills—component-driven UI, data flow, validation, and production-ready project structure.

## ✨ Features
- Add, categorize, and delete expenses
- Persistent data using `localStorage`
- Filter expenses by category
- Summary totals (overall + filtered views)
- Charts (Recharts)
  - Spending by category
  - Spending over time
  - 7 / 30 / All-time range toggle
- UX polish
  - Keyboard-friendly form flow (autofocus + refocus)
  - Disabled submit until valid
  - Toast notifications on add
  - Accessible focus states and labeled inputs

## 🔗 Live Demo
- https://budget-app-lake-omega.vercel.app

## 🛠️ Tech Stack
- **React** (Hooks, functional components) 
- **Recharts** for data visualization  
- **CSS** (lightweight custom styling)

## Architecture Highlights
- **Single source of truth**: `App.jsx` owns `expenses` state
- **Derived state**: filtering, totals, and chart datasets are computed from base state
- **Component boundaries**:
  - `ExpenseForm` handles input + validation
  - `ExpenseList` handles rendering + delete action
  - `Charts` handles aggregation + visualization
  - `Summary` handles totals

  ## What This Project Demonstrates
- Clean, scalable React patterns (derived state, memoization, component responsibility)
- Data transformation for charts (grouping, sorting, time windows)
- UX attention to detail (states, feedback, accessibility)

## 🧠 Design & Engineering Decisions
**State Management**

- App.jsx acts as the single source of truth for expenses
- Derived data (filters, totals, charts) is computed from base state
- Components are kept focused and reusable

**UX & Accessibility**

- Keyboard-first form interaction (autofocus, Enter flow)
- Disabled submit states prevent invalid actions
- Clear empty states that explain what to do next
- ARIA attributes and visible focus states for accessibility

**Data Visualization**

- Charts use derived, memoized data
- Time-based filtering implemented with useMemo
- Graceful handling of empty or invalid data

## 📈 What I Learned
- Structuring React components around responsibility boundaries
- Turning derived state into reusable, testable logic
- Improving UX through micro-interactions and feedback
- Debugging real-world React issues (props, rendering, scope)
- Designing features incrementally instead of over-engineering

## 🔮 Next Steps
- Deploy live using Netlify or Vercel
- Add Python-based analytics (CSV export + deeper insights)
- Enhance chart interactivity and time grouping
- Optional backend integration

## 📸 Screenshots
![Budget App UI](docs/screenshots/dashboard.png)
![Graphical info](docs/screenshots/graphs.png)
![More Graphs!](docs/screenshots/graphs2.png)
![More updates!](docs/screenshots/totalUpdates.png)

## 🚀 Getting Started
### Prerequisites
- Node.js (LTS recommended)
- npm

### Install dependencies
```bash
npm install
npm start
http://localhost:3000

# Example environment variables (do not put secrets in here)
# REACT_APP_API_URL=http://localhost:5000
