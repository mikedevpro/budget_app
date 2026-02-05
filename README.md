
# Budget App (Full‑Stack)

A full‑stack personal budgeting application built with **React** on the frontend and **Python (FastAPI)** on the backend. The app allows users to manually track expenses, filter by category, and view spending summaries and charts. Data is persisted via a Python API and SQLite database.

This project was intentionally designed to demonstrate **clean frontend/backend separation**, real API design, and practical full‑stack architecture suitable for production‑style applications.

---

## ✨ Features

* Add, view, filter, and delete expenses
* Category‑based filtering
* Real‑time summaries and charts
* Persistent storage via backend API
* Clean, accessible UI
* Toast notifications for user feedback

---

## 🧠 Architecture Overview

```
React (Frontend)
   │
   │  HTTP (JSON)
   ▼
FastAPI (Backend)
   │
   ▼
SQLite Database
```

* **Frontend (React)** handles UI, forms, filtering, and visualization
* **Backend (FastAPI)** owns data persistence, validation, and analytics
* **SQLite** provides lightweight, file‑based storage for development

This separation mirrors real‑world full‑stack applications and makes the system easy to extend (authentication, CSV import, ML categorization, etc.).

---

## 🛠 Tech Stack

### Frontend

* React
* JavaScript (ES6+)
* HTML & CSS

### Backend

* Python 3.14
* FastAPI
* Pydantic (v2)
* SQLAlchemy
* SQLite

---

## 📡 API Endpoints

### Expenses

* `GET /expenses` – Fetch all expenses
* `POST /expenses` – Create a new expense
* `DELETE /expenses/{id}` – Delete an expense

### Insights

* `GET /insights/summary` – Total spent, count, and average expense
* `GET /insights/by-category` – Aggregated totals per category

FastAPI provides interactive documentation at:

```
http://localhost:8000/docs
```

---

## 🚀 Running the Project Locally

### Prerequisites

* Node.js
* Python 3.11+

---

### Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Backend runs at:

```
http://localhost:8000
```

---

### Frontend Setup

```bash
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🧪 Data Flow Example

1. User submits an expense in the React UI
2. React sends a `POST /expenses` request to FastAPI
3. FastAPI validates and stores the expense in SQLite
4. React fetches updated data via `GET /expenses`
5. Charts and summaries re‑render automatically

---

## 📈 Why This Project

This app was built as a **flagship portfolio project** to demonstrate:

* Full‑stack thinking
* Clean API contracts
* Frontend ↔ backend integration
* Practical state management
* Realistic project structure

Rather than focusing on complexity for its own sake, the goal was to build something **clear, extensible, and production‑adjacent**.

---

## 🔮 Future Improvements

* Move all analytics logic fully to the backend
* CSV import for bank transactions
* Rule‑based and ML‑assisted expense categorization
* Authentication and multi‑user support
* Deployment (Docker + cloud hosting)

---

## 👤 Author

**Michael Nobles**
Career‑switching full‑stack developer with a focus on clean architecture and practical applications.

