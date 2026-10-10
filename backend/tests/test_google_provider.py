import json
import pytest
from httpx import Response, Request, ASGITransport, AsyncClient
from unittest.mock import patch
from app.main import app
from app.config import settings
from app.services.gemma_provider import GemmaProvider


@pytest.mark.asyncio
async def test_google_provider_selection_when_ollama_unavailable():
    with patch.object(GemmaProvider, "probe_ollama", return_value=(False, [])):
        with patch.object(settings, "gemini_api_key", "mock-test-key-123"):
            with patch.object(settings, "gemma_backend", "auto"):
                status = await GemmaProvider.get_provider_status()
                assert status["active_mode"] == "gemini_api"
                assert status["active_model"] == f"{settings.gemini_model} (Google AI Studio)"
                assert status["remote_providers_configured"]["google_ai_studio"] is True
                assert status["is_local_inference"] is False


@pytest.mark.asyncio
async def test_google_provider_custom_model_configuration():
    custom_model = "gemma-4-31b-it"
    with patch.object(GemmaProvider, "probe_ollama", return_value=(False, [])):
        with patch.object(settings, "gemini_api_key", "mock-test-key-123"):
            with patch.object(settings, "gemini_model", custom_model):
                status = await GemmaProvider.get_provider_status()
                assert status["active_mode"] == "gemini_api"
                assert status["active_model"] == f"{custom_model} (Google AI Studio)"


@pytest.mark.asyncio
async def test_google_provider_generate_response_mocked_http():
    mock_payload = {
        "summary": "Google AI Studio Gemma plan",
        "recommended_plants": [],
        "weekly_tasks": []
    }
    mock_gemini_response = {
        "candidates": [
            {
                "content": {
                    "parts": [
                        {"text": f"```json\n{json.dumps(mock_payload)}\n```"}
                    ]
                }
            }
        ]
    }

    with patch.object(GemmaProvider, "probe_ollama", return_value=(False, [])):
        with patch.object(settings, "gemini_api_key", "mock-secret-key-456"):
            with patch.object(settings, "gemini_model", "gemma-4-26b-a4b-it"):
                with patch("httpx.AsyncClient.post") as mock_post:
                    mock_post.return_value = Response(
                        status_code=200,
                        json=mock_gemini_response,
                        request=Request("POST", "http://test")
                    )

                    parsed, model_id, mode = await GemmaProvider.generate_response(
                        prompt="Generate plan",
                        is_health_check=False,
                        force_demo=False
                    )

                    assert mode == "gemini_api"
                    assert "gemma-4-26b-a4b-it" in model_id
                    assert "Google AI Studio" in model_id
                    assert parsed["summary"] == "Google AI Studio Gemma plan"
                    assert mock_post.called

                    called_args, called_kwargs = mock_post.call_args
                    called_url = called_args[0]
                    called_headers = called_kwargs.get("headers", {})

                    # Verify model endpoint and x-goog-api-key header
                    assert "https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent" == called_url
                    assert "mock-secret-key-456" not in called_url
                    assert called_headers.get("x-goog-api-key") == "mock-secret-key-456"


@pytest.mark.asyncio
async def test_google_provider_api_error_handling():
    with patch.object(GemmaProvider, "probe_ollama", return_value=(False, [])):
        with patch.object(settings, "gemini_api_key", "invalid-key"):
            with patch("httpx.AsyncClient.post") as mock_post:
                mock_post.return_value = Response(
                    status_code=403,
                    json={"error": {"message": "API key not valid."}},
                    request=Request("POST", "http://test")
                )

                with pytest.raises(RuntimeError) as exc_info:
                    await GemmaProvider.generate_response(
                        prompt="Test prompt",
                        is_health_check=False,
                        force_demo=False
                    )
                assert "Google AI Studio Gemma error (403)" in str(exc_info.value)


@pytest.mark.asyncio
async def test_google_provider_route_integration():
    mock_plan = {
        "summary": "Verified Google AI Studio plan",
        "garden_assessment": "Assessed by Gemma",
        "recommended_plants": [
            {
                "name": "Holy Basil (Tulsi)",
                "scientific_name": "Ocimum tenuiflorum",
                "reason": "Optimal for balcony",
                "sunlight_fit": "Morning sun",
                "container_or_spacing": "10-inch pot",
                "sowing_or_care_advice": "Pinch terminal shoots",
                "watering_guidance": "Water daily",
                "days_to_harvest_estimate": "30 days"
            }
        ],
        "weekly_tasks": [
            {
                "id": "task-day1",
                "day_number": 1,
                "day_label": "Day 1 (Monday)",
                "title": "Moisture check",
                "description": "Check moisture 2 inches down",
                "estimated_minutes": 15,
                "materials": ["Gloves"],
                "outdoor_mission": "Breathe fresh air and feel the soil texture"
            }
        ],
        "soil_and_compost_guidance": "Compost enriched mix",
        "pest_prevention_tips": ["Neem spray"],
        "materials_needed": ["Gloves"],
        "assumptions": ["Good drainage"],
        "safety_notes": ["Wash hands"],
        "sources": ["ICAR"]
    }

    with patch.object(
        GemmaProvider,
        "generate_response",
        return_value=(mock_plan, "gemma-4-26b-a4b-it (Google AI Studio)", "gemini_api")
    ):
        plan_req = {
            "profile": {
                "garden_name": "Integration Test Garden",
                "location": "Mangalore, India",
                "garden_type": "balcony"
            },
            "use_sample_data": False
        }
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            resp = await ac.post("/api/garden/plan", json=plan_req)

        assert resp.status_code == 200
        data = resp.json()
        assert data["inference_mode"] == "gemini_api"
        assert "gemma-4-26b-a4b-it" in data["model_id"]
        assert "Google AI Studio" in data["model_id"]
        assert len(data["weekly_tasks"]) == 1
        assert data["weekly_tasks"][0]["outdoor_mission"] == "Breathe fresh air and feel the soil texture"
