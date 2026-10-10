"""Health check and AI provider status endpoint."""

from fastapi import APIRouter
from app.config import settings
from app.services.gemma_provider import GemmaProvider

router = APIRouter(tags=["System & AI Status"])


@router.get("/api/health")
async def health_check():
    provider_status = await GemmaProvider.get_provider_status()
    return {
        "status": "healthy",
        "app_name": settings.app_name,
        "app_version": settings.app_version,
        "ai_engine": {
            "model_family": "Google Gemma Open-Weights",
            "active_model": provider_status["active_model"],
            "inference_mode": provider_status["active_mode"],
            "is_local": provider_status["is_local_inference"],
            "ollama_server_reachable": provider_status["ollama_running"],
            "installed_ollama_models": provider_status["ollama_models"],
            "remote_providers_configured": provider_status["remote_providers_configured"],
            "privacy_notice": provider_status["privacy_guarantee"]
        }
    }
