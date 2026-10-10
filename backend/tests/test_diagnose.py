import pytest
from httpx import ASGITransport, AsyncClient
from unittest.mock import patch
from app.main import app
from app.services.gemma_provider import GemmaProvider


@pytest.mark.asyncio
async def test_diagnose_demo_fixture():
    payload = {
        "plant_name": "Holy Basil (Tulsi)",
        "symptoms": ["Yellowing lower leaves", "Brown leaf margins"],
        "symptom_duration": "3-5 days",
        "watering_habit": "every day (morning)",
        "sunlight_condition": "4 hours morning sun",
        "soil_condition": "moist to touch",
        "use_sample_data": True
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/garden/diagnose", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["plant_name"] == "Holy Basil (Tulsi)"
    assert data["inference_mode"] == "demo_mode"
    assert "gemma" in data["model_id"].lower()
    assert len(data["possible_causes"]) >= 2
    assert len(data["distinguishing_questions"]) >= 2
    assert len(data["low_risk_checks"]) >= 2
    assert len(data["action_steps"]) >= 2
    assert len(data["safety_notes"]) >= 1


@pytest.mark.asyncio
async def test_diagnose_model_unavailable():
    with patch.object(GemmaProvider, "get_provider_status", return_value={"active_mode": "ollama_local", "active_model": "gemma2:9b", "is_local_inference": True, "ollama_running": False, "ollama_models": [], "remote_providers_configured": {}, "privacy_guarantee": ""}):
        payload = {
            "plant_name": "Tomato",
            "symptoms": ["Wilting leaves"],
            "use_sample_data": False
        }
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/api/garden/diagnose", json=payload)
        assert response.status_code == 503
        assert "unavailable" in response.json()["detail"].lower() or "ollama" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_diagnose_model_timeout():
    with patch.object(GemmaProvider, "generate_response", side_effect=TimeoutError("Model timed out")):
        payload = {
            "plant_name": "Tomato",
            "symptoms": ["Curled leaves"],
            "use_sample_data": False
        }
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/api/garden/diagnose", json=payload)
        assert response.status_code == 504
        assert "timed out" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_diagnose_malformed_output():
    with patch.object(GemmaProvider, "generate_response", side_effect=ValueError("Invalid JSON from model")):
        payload = {
            "plant_name": "Tomato",
            "symptoms": ["Spots on leaves"],
            "use_sample_data": False
        }
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/api/garden/diagnose", json=payload)
        assert response.status_code == 422
        assert "parse" in response.json()["detail"].lower()
