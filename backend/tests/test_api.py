from httpx import AsyncClient
import pytest
import csv
import io
from fastapi import File, UploadFile

from app import app

@pytest.mark.anyio
async def test_health():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.get("/health")
        assert r.status_code == 200
        assert r.json()["ok"] is True

@pytest.mark.anyio
async def test_create_and_list_expenses():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # create
        r = await ac.post("/expenses", json={"name": "Coffee", "amount": 4.50, "category": "Food"})
        assert r.status_code == 201
        body = r.json()
        assert body["name"] == "Coffee"
        assert body["category"] == "Food"
        assert "id" in body
        assert "createdAt" in body  # your alias

        # list
        r2 = await ac.get("/expenses")
        assert r2.status_code == 200
        items = r2.json()
        assert isinstance(items, list)
        assert any(x["id"] == body["id"] for x in items)

@pytest.mark.anyio
async def test_insights_summary():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.get("/insights/summary")
        assert r.status_code == 200
        data = r.json()
        assert "total_spent" in data
        assert "expense_count" in data
        assert "avg_expense" in data

@app.post("/transactions/import")
async def import_transactions(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Please upload a .csv file")

    content = await file.read()
    text = content.decode("utf-8", errors="replace")
    reader = csv.DictReader(io.StringIO(text))

    required = {"name", "amount", "category"}
    if not required.issubset(set((reader.fieldnames or []))):
        raise HTTPException(
            status_code=400,
            detail="CSV must include columns: name, amount, category",
        )

    inserted = 0
    with SessionLocal() as db:
        for row in reader:
            name = (row.get("name") or "").strip()
            category = (row.get("category") or "General").strip()
            try:
                amount = float(row.get("amount"))
            except:
                continue

            if not name or amount <= 0:
                continue

            exp = Expense(
                id=str(uuid4()),
                name=name,
                amount=float(amount),
                category=category,
                created_at=datetime.utcnow(),
            )
            db.add(exp)
            inserted += 1

        db.commit()

    return {"inserted": inserted}
