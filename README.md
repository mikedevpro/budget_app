# Budget App (Full-Stack)

A full-stack personal budgeting application with a React frontend and a FastAPI backend.

## 🔗 Live Demo: https://budget-app-lake-omega.vercel.app/



## 📸 Screenshots

| Dashboard | Add Expense | Filter and list |
|---|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Add Expense](docs/screenshots/add-expense.png) | ![Filter + List](docs/screenshots/filter-list.png) | 

## ✨ Features
- Add, edit, delete, and list expenses
- Category filtering
- Insights: summary, by-category, and over-time charts
- CSV import (`/transactions/import`)
- Light/dark theme
- Local mode and backend mode for frontend data source

## 🧠 Architecture

```text
React (CRA)
  -> HTTP/JSON
FastAPI
  -> SQLAlchemy
SQLite
```

* **Frontend (React)** handles UI, forms, filtering, and visualization
* **Backend (FastAPI)** owns data persistence, validation, and analytics
* **SQLite** provides lightweight, file-based storage for development

This separation mirrors real-world full-stack applications and makes the system easy to extend (authentication, CSV import, ML categorization, etc.). 

The frontend is intentionally thin and presentation-focused. All aggregation, validation, and persistence logic lives in the backend, mirroring real-world production architecture.

## 🛠 Tech Stack
- Frontend: React, JavaScript, CSS
- Backend: Python, FastAPI, Pydantic v2, SQLAlchemy, SQLite

## 📡 API Endpoints
- `GET /health`
- `GET /expenses`
- `POST /expenses`
- `PATCH /expenses/{id}`
- `DELETE /expenses/{id}`
- `GET /insights/summary`
- `GET /insights/by-category?range=7|30|all`
- `GET /insights/over-time?range=7|30|all`
- `GET /insights?range=7|30|all`
- `POST /transactions/import`

API docs:
- `http://localhost:8000/docs`

## 🚀 Local Setup

### 1) Frontend
```bash
npm install
npm start
```
Frontend: `http://localhost:3000`

### 2) Backend
From project root:
```bash
python3 -m venv .venv
./.venv/bin/python -m pip install fastapi sqlalchemy pydantic python-multipart uvicorn httpx pytest
./.venv/bin/python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
Backend: `http://localhost:8000`

## ⚙️ Environment Variables

### Frontend (`.env`)
- `REACT_APP_API_MODE=local|backend`
- `REACT_APP_API_BASE=http://localhost:8000`

Example:
```env
REACT_APP_API_MODE=backend
REACT_APP_API_BASE=http://localhost:8000
```

### Backend
- `CORS_ALLOW_ORIGINS` (comma-separated frontend origins)

Example:
```bash
CORS_ALLOW_ORIGINS="http://localhost:3000,http://localhost:5173" \
./.venv/bin/python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

## 🌐 Run Backend on a Different Server
1. Run backend on target host:
```bash
./.venv/bin/python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```
2. Set frontend `.env`:
```env
REACT_APP_API_MODE=backend
REACT_APP_API_BASE=http://<your-server>:8000
```
3. Set backend CORS for your frontend origin:
```bash
CORS_ALLOW_ORIGINS="http://<your-frontend-host>:3000"
```

## 🧪 Tests
Run backend tests from project root:
```bash
./.venv/bin/python -m pytest -q backend/tests/test_api.py
```

## 📝 Notes
- CSV import is available in `backend` mode.
- In `local` mode, expenses/insights use `localStorage`.

---

## 📈 Why This Project

This project was built as a **flagship portfolio application** to demonstrate practical full-stack engineering skills.

Key goals:

* Clear frontend/backend separation
* Backend-owned business logic
* Realistic API design
* Production-adjacent architecture

Rather than maximizing features, the focus was on building something **clean, extensible, and explainable in an interview setting**.

---

## 🔮 Future Improvements

* Authentication and multi-user support
* CSV column mapping and preview before import
* Monthly budgeting and goal tracking
* Automated category suggestions
* Test database isolation for CI
* Deployment with Docker and cloud hosting

---

## 🗣 Explaining This Project

> “This is a full-stack budget tracking application built with React and a Python FastAPI backend. The frontend is responsible only for UI and user interaction, while all validation, persistence, and analytics logic lives in the backend.
>
> I started with a frontend-only prototype, then progressively moved business logic into the API, including summaries, category aggregation, and time-series analytics. The backend exposes clean REST endpoints and persists data in SQLite.
>
> I also added CSV import support to simulate real-world transaction ingestion, and implemented optimistic UI updates with backend-driven refreshes for a responsive user experience.”

---

## 👤 Author

**Michael Nobles**
Full-stack developer focused on clean architecture, clarity, and practical applications.
