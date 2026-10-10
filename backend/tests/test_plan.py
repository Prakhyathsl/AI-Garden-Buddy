import pytest
from httpx import ASGITransport, AsyncClient
from unittest.mock import patch
from app.main import app
from app.services.gemma_provider import GemmaProvider


@pytest.mark.asyncio
async def test_demo_fixture_plan_generation():
    payload = {
        "profile": {
            "garden_name": "Mangalore Coastal Balcony",
            "location": "Mangalore, Karnataka, India",
            "country": "India",
            "garden_type": "balcony",
            "space_sq_ft": 40.0,
            "containers_count": 6,
            "sunlight_exposure": "partial_sun",
            "soil_medium": "potting_mix",
            "water_availability": "moderate",
            "experience_level": "beginner",
            "preferred_plants": ["Holy Basil", "Mint"],
            "gardening_goals": ["Fresh herbs"],
            "time_budget_mins_per_day": 20
        },
        "planning_period": "This Week",
        "use_sample_data": True
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/garden/plan", json=payload)
    assert response.status_code == 200
    plan = response.json()
    assert plan["inference_mode"] == "demo_mode"
    assert "gemma" in plan["model_id"].lower()
    assert len(plan["recommended_plants"]) >= 3
    assert len(plan["weekly_tasks"]) == 7
    # Verify every day has an outdoor mission
    for task in plan["weekly_tasks"]:
        assert "outdoor_mission" in task
        assert len(task["outdoor_mission"]) > 10
        assert task["estimated_minutes"] <= 30
    assert len(plan["safety_notes"]) > 0
    assert len(plan["assumptions"]) > 0


@pytest.mark.asyncio
async def test_model_unavailable_error():
    # Force gemma_backend to non-existent ollama call
    with patch.object(GemmaProvider, "get_provider_status", return_value={"active_mode": "ollama_local", "active_model": "gemma2:9b", "is_local_inference": True, "ollama_running": False, "ollama_models": [], "remote_providers_configured": {}, "privacy_guarantee": ""}):
        payload = {
            "profile": {
                "garden_name": "Test Garden",
                "location": "Mangalore, India",
                "garden_type": "balcony",
                "time_budget_mins_per_day": 15
            },
            "use_sample_data": False
        }
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/api/garden/plan", json=payload)
        # Should return 503 Service Unavailable when local Ollama cannot be reached
        assert response.status_code == 503
        data = response.json()
        assert "Ollama" in data["detail"] or "unavailable" in data["detail"]


@pytest.mark.asyncio
async def test_malformed_model_output_error():
    # If the provider encounters invalid json from model
    with patch.object(GemmaProvider, "generate_response", side_effect=ValueError("Invalid JSON token")):
        payload = {
            "profile": {
                "garden_name": "Test Garden",
                "location": "Mangalore, India",
                "garden_type": "balcony"
            },
            "use_sample_data": False
        }
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/api/garden/plan", json=payload)
        assert response.status_code == 422
        assert "parsed into structured format" in response.json()["detail"]
