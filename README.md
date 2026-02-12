# Budget App (Full-Stack)

A full-stack personal budgeting application with a React frontend and a FastAPI backend.

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
