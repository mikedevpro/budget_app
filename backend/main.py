from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic import ConfigDict

from sqlalchemy import Column, DateTime, Float, String, create_engine, select, func
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./budget.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False, default="General")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

class ExpenseCreate(BaseModel):
    name: str = Field(min_length=1)
    amount: float = Field(gt=0)
    category: str = Field(default="General", min_length=1)

class ExpenseUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1)
    amount: Optional[float] = Field(default=None, gt=0)
    category: Optional[str] = Field(default=None, min_length=1)

class ExpenseOut(BaseModel):
    id: str
    name: str
    amount: float
    category: str
    created_at: datetime = Field(alias="createdAt")
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class SummaryOut(BaseModel):
    total_spent: float
    expense_count: int
    avg_expense: float

class CategoryTotalOut(BaseModel):
    category: str
    total: float

app = FastAPI(title="Budget Insights API")

# Works for CRA (3000) or Vite (5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/expenses", response_model=List[ExpenseOut])
def list_expenses():
    with SessionLocal() as db:
        stmt = select(Expense).order_by(Expense.created_at.desc())
        return db.execute(stmt).scalars().all()

@app.post("/expenses", response_model=ExpenseOut, status_code=201)
def create_expense(payload: ExpenseCreate):
    with SessionLocal() as db:
        exp = Expense(
            id=str(uuid4()),
            name=payload.name.strip(),
            amount=float(payload.amount),
            category=payload.category.strip(),
            created_at=datetime.utcnow(),
        )
        db.add(exp)
        db.commit()
        db.refresh(exp)
        return exp

@app.patch("/expenses/{expense_id}", response_model=ExpenseOut)
def update_expense(expense_id: str, payload: ExpenseUpdate):
    with SessionLocal() as db:
        exp = db.get(Expense, expense_id)
        if not exp:
            raise HTTPException(status_code=404, detail="Expense not found")

        if payload.name is not None:
            exp.name = payload.name.strip()
        if payload.amount is not None:
            exp.amount = float(payload.amount)
        if payload.category is not None:
            exp.category = payload.category.strip()

        db.commit()
        db.refresh(exp)
        return exp

@app.delete("/expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: str):
    with SessionLocal() as db:
        exp = db.get(Expense, expense_id)
        if not exp:
            raise HTTPException(status_code=404, detail="Expense not found")
        db.delete(exp)
        db.commit()
        return

@app.get("/insights/summary", response_model=SummaryOut)
def summary():
    with SessionLocal() as db:
        total = db.execute(select(func.coalesce(func.sum(Expense.amount), 0.0))).scalar_one()
        count = db.execute(select(func.count(Expense.id))).scalar_one()
        avg = (float(total) / int(count)) if count else 0.0
        return SummaryOut(total_spent=float(total), expense_count=int(count), avg_expense=float(avg))

@app.get("/insights/by-category", response_model=List[CategoryTotalOut])
def by_category():
    with SessionLocal() as db:
        stmt = (
            select(Expense.category, func.coalesce(func.sum(Expense.amount), 0.0).label("total"))
            .group_by(Expense.category)
            .order_by(func.sum(Expense.amount).desc())
        )
        rows = db.execute(stmt).all()
        return [{"category": r[0], "total": float(r[1])} for r in rows]
