import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_get_all_plants():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/plants")
    assert response.status_code == 200
    plants = response.json()
    assert len(plants) >= 5
    first = plants[0]
    assert "common_name" in first
    assert "sunlight_requirement" in first
    assert "watering_needs" in first
    assert "container_friendly" in first


@pytest.mark.asyncio
async def test_search_and_filter_plants():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Search by query
        response = await ac.get("/api/plants?query=tulsi")
        assert response.status_code == 200
        results = response.json()
        assert len(results) >= 1
        assert "tulsi" in results[0]["id"].lower()

        # Filter by category
        res_cat = await ac.get("/api/plants?category=Herb")
        assert res_cat.status_code == 200
        for p in res_cat.json():
            assert p["category"].lower() == "herb"


@pytest.mark.asyncio
async def test_plant_detail_not_found():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/plants/nonexistent-plant-id")
    assert response.status_code == 404
