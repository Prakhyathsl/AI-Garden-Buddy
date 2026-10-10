"""Weather and seasonal intelligence route."""

from fastapi import APIRouter, Query
from app.services.weather_service import fetch_weather_and_season

router = APIRouter(tags=["Weather & Seasons"])


@router.get("/api/weather")
async def get_weather(
    location: str = Query("Mangalore, Karnataka, India", description="Location name to geocode and retrieve forecast for")
):
    return await fetch_weather_and_season(location)
