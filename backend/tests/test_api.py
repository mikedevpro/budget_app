from httpx import ASGITransport, AsyncClient
import pytest

try:
    from backend.app import app
except ImportError:
    from app import app

@pytest.mark.anyio
async def test_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        r = await ac.get("/health")
        assert r.status_code == 200
        assert r.json()["ok"] is True

@pytest.mark.anyio
async def test_create_and_list_expenses():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
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
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        r = await ac.get("/insights/summary")
        assert r.status_code == 200
        data = r.json()
        assert "total_spent" in data
        assert "expense_count" in data
        assert "avg_expense" in data
