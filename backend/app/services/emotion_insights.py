from collections import defaultdict

def detect_user_state(expenses: list[dict]) -> str:
    if not expenses:
        return "stable"

    total_spend = sum(float(expense.get("amount", 0)) for expense in expenses)

    category_totals = defaultdict(float)
    for expense in expenses:
        category = (expense.get("category") or "Other").lower()
        category_totals[category] += float(expense.get("amount", 0))

    fun_spend = (
        category_totals.get("entertainment", 0)
        + category_totals.get("shopping", 0)
        + category_totals.get("dining", 0)
    )

    essentials_spend = (
        category_totals.get("rent", 0)
        + category_totals.get("utilities", 0)
        + category_totals.get("groceries", 0)
        + category_totals.get("transportation", 0)
    )

    fun_ratio = fun_spend / total_spend if total_spend else 0

    if total_spend > 3000 and essentials_spend / total_spend > 0.6:
        return "stressed"
    if fun_ratio > 0.35:
        return "impulsive"
    return "stable"


def generate_emotion_message(state: str) -> str:
    messages = {
        "stressed": "Your essential spending is running high this period. A few small adjustments could ease the pressure.",
        "impulsive": "Your discretionary spending is elevated right now. This may be a good time to set a soft limit.",
        "stable": "Your spending looks balanced overall. Keep building on these steady habits.",
    }
    return messages.get(state, messages["stable"])


def build_emotion_insight(expenses: list[dict]) -> dict:
    state = detect_user_state(expenses)
    return {
        "state": state,
        "message": generate_emotion_message(state),
    }