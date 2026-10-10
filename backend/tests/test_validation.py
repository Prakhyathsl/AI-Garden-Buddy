import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_invalid_garden_profile_missing_fields():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Missing required field "garden_name" and "location"
        response = await ac.post("/api/garden/plan", json={
            "profile": {
                "garden_type": "balcony"
            }
        })
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


@pytest.mark.asyncio
async def test_invalid_time_budget():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/garden/plan", json={
            "profile": {
                "garden_name": "My Balcony",
                "location": "Mangalore, India",
                "time_budget_mins_per_day": 0  # Below ge=5 constraint
            }
        })
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_invalid_health_request_empty_symptoms():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/garden/diagnose", json={
            "plant_name": "Tulsi",
            "symptoms": []  # Requires at least 1 symptom
        })
    assert response.status_code == 422
