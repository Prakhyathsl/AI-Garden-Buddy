import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_weather_endpoint_safe_response():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/weather?location=Mangalore,India")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "source" in data
    assert "resolved_location" in data
    assert "gardening_advice_implication" in data
