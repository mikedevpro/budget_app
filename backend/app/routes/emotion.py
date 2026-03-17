import os
import sqlite3
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Query

from app.services.emotion_insights import build_emotion_insight

router = APIRouter()

DB_PATH = os.getenv("DB_PATH", "budget.db")


@router.get("/emotion")
def get_emotion_insight(range: str = Query("30")):
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        query = "SELECT amount, category FROM expenses"
        params: tuple = ()

        if range != "all":
            days = int(range)
            cutoff = datetime.now(timezone.utc) - timedelta(days=days)
            query += " WHERE created_at >= ?"
            params = (cutoff.isoformat(sep=\" \"),)

        expenses = conn.execute(query, params).fetchall()

    expense_payload = [
        {"amount": float(row["amount"]), "category": row["category"] or "Other"}
        for row in expenses
    ]

    return build_emotion_insight(expense_payload)


@router.get("/insights/emotion")
def get_insight_by_range(range: str = Query("30")):
    return get_emotion_insight(range)
