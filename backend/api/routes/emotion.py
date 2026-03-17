from fastapi import APIRouter

try:
    from ..app import SessionLocal, Expense
except ImportError:
    from backend.app import SessionLocal, Expense

try:
    from ..services.emotion_insights import build_emotion_insight
except ImportError:
    from api.services.emotion_insights import build_emotion_insight

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
