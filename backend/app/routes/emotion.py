from fastapi import APIRouter

try:
    from main import SessionLocal, Expense
except ImportError:
    from ..main import SessionLocal, Expense

try:
    from app.services.emotion_insights import build_emotion_insight
except ImportError:
    from ..services.emotion_insights import build_emotion_insight

router = APIRouter(prefix="/insights", tags=["emotion"])


@router.get("/emotion")
def get_emotion_insight():
    with SessionLocal() as db:
        expenses = db.query(Expense).all()

        serialized_expenses = [
            {
                "amount": expense.amount,
                "category": expense.category,
            }
            for expense in expenses
        ]

    return build_emotion_insight(serialized_expenses)