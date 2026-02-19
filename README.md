# 💰 Budget App (Full-Stack)

A production-style expense tracking application built to demonstrate clean system design, practical API development, and thoughtful frontend UX.

Originally built as a frontend-only React app, it evolved into a full-stack architecture with FastAPI handling validation, persistence, and analytics.

🔗 Live Demo → https://budget-app-lake-omega.vercel.app/

---

## 📸 Screenshots

Dashboard | Add Expense | Filter + List

---

## ✨ Core Features

- Create, edit, delete, and filter expenses
- Category-based filtering
- Analytics:
  - Summary insights
  - By-category aggregation
  - Time-series charts
- CSV transaction import (`/transactions/import`)
- Light / Dark theme
- Dual data mode:
  - Local (localStorage)
  - Backend (API-powered)

---

## 🧠 Architecture Overview

React (Frontend UI)
↓ HTTP/JSON
FastAPI (API Layer)
↓ SQLAlchemy ORM
SQLite (Persistence)


### Design Philosophy

- Frontend is thin and presentation-focused
- Backend owns all business logic, validation, and analytics
- Data aggregation lives server-side
- Architecture mirrors real-world production systems

The goal was not feature volume —  
but clean separation of concerns and extensibility.

---

## 🛠 Tech Stack

**Frontend**
- React
- JavaScript
- CSS

**Backend**
- Python
- FastAPI
- Pydantic v2
- SQLAlchemy
- SQLite

---

## 📡 API Surface

Core endpoints:

GET /expenses
POST /expenses
PATCH /expenses/{id}
DELETE /expenses/{id}

GET /insights/summary
GET /insights/by-category
GET /insights/over-time

POST /transactions/import


Swagger Docs:
http://localhost:8000/docs

---

## 🚀 Running Locally

### 1️⃣ Frontend

npm install
npm start


→ http://localhost:3000

---

### 2️⃣ Backend

python3 -m venv .venv
source .venv/bin/activate
pip install fastapi sqlalchemy pydantic python-multipart uvicorn httpx pytest
uvicorn backend.main:app --reload


→ http://localhost:8000

---

## ⚙️ Environment Variables

Frontend `.env`:

REACT_APP_API_MODE=backend
REACT_APP_API_BASE=http://localhost:8000
VITE_API_URL=http://localhost:8000


Backend:

CORS_ALLOW_ORIGINS="http://localhost:3000"


---

## 🧪 Tests

pytest backend/tests/test_api.py


---

## 📈 Why This Project Matters

This project demonstrates:

- Realistic frontend/backend separation
- Backend-owned business logic
- Structured REST API design
- Incremental architectural evolution
- Interview-ready system explanation

The emphasis was clarity and extensibility — not feature sprawl.

---

## 🔮 Future Enhancements

- Authentication & multi-user support
- Dockerized deployment
- Cloud hosting
- CSV preview + column mapping
- Monthly budgeting & goal tracking
- Automated category suggestions

---

## 🗣 How I Explain It 

> “This is a full-stack budget application built with React and FastAPI.  
> I intentionally moved all business logic into the backend, including validation and analytics, to mirror production architecture.  
> The frontend is thin and UI-focused, while the backend handles persistence and aggregation.  
> I also implemented CSV import to simulate real-world transaction ingestion.”

---

## 👤 Author

Michael Nobles  
Full-stack developer focused on clean architecture and practical systems.
