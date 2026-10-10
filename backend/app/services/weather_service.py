"""Weather and seasonal intelligence service using Open-Meteo.
Provides real-time temperature, precipitation, and seasonal context without requiring API keys.
Gracefully handles offline or unreachable states.
"""

from typing import Dict, Any, Optional
import httpx


async def fetch_weather_and_season(location_query: str) -> Dict[str, Any]:
    """Fetches real weather data from Open-Meteo geocoding and forecast APIs.
    Returns structured weather and seasonal data, or honest offline indicators.
    """
    clean_query = location_query.split(",")[0].strip() if location_query else "Mangalore"
    
    # 1. Geocode location via Open-Meteo Geocoding API
    geocoding_url = f"https://geocoding-api.open-meteo.com/v1/search?name={clean_query}&count=1&language=en&format=json"
    
    lat = None
    lon = None
    resolved_name = location_query
    
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            geo_resp = await client.get(geocoding_url)
            if geo_resp.status_code == 200:
                geo_data = geo_resp.json()
                if geo_data.get("results") and len(geo_data["results"]) > 0:
                    first = geo_data["results"][0]
                    lat = first.get("latitude")
                    lon = first.get("longitude")
                    resolved_name = f"{first.get('name')}, {first.get('admin1', '')}, {first.get('country', '')}".replace(", ,", ",")
    except Exception as e:
        # Network unreachable or timeout
        pass

    # If geocoding failed or offline, return honest offline fallback
    if lat is None or lon is None:
        return {
            "status": "offline_or_unresolved",
            "source": "Local Seasonal Fallback (Live API Unreachable)",
            "resolved_location": location_query,
            "latitude": None,
            "longitude": None,
            "current_temp_c": None,
            "current_humidity": None,
            "weather_condition": "Unknown (Live weather unavailable)",
            "rain_forecast_next_7_days_mm": None,
            "gardening_advice_implication": (
                "Unable to reach live meteorological sensor. Rely on manual soil moisture checks "
                "and observed daily temperature before watering."
            ),
            "is_live_data": False
        }

    # 2. Fetch Forecast from Open-Meteo Weather API
    forecast_url = (
        f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,precipitation,weather_code"
        f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto"
    )
    
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            fc_resp = await client.get(forecast_url)
            if fc_resp.status_code == 200:
                fc_data = fc_resp.json()
                current = fc_data.get("current", {})
                daily = fc_data.get("daily", {})
                
                temp_c = current.get("temperature_2m")
                humidity = current.get("relative_humidity_2m")
                precip = current.get("precipitation")
                
                # Sum next 7 days rainfall
                rainfall_7d = sum(daily.get("precipitation_sum", [0])[:7])
                max_temp = max(daily.get("temperature_2m_max", [temp_c])) if daily.get("temperature_2m_max") else temp_c
                min_temp = min(daily.get("temperature_2m_min", [temp_c])) if daily.get("temperature_2m_min") else temp_c
                
                # Derive practical gardening guidance based on real readings
                advice = []
                if rainfall_7d > 25.0:
                    advice.append(f"Significant rain forecast ({rainfall_7d:.1f} mm expected over 7 days). Check container drainage to prevent waterlogging.")
                elif rainfall_7d < 2.0:
                    advice.append("Dry week ahead. Inspect potted soil daily; container plants lose moisture quickly.")
                    
                if max_temp and max_temp > 33.0:
                    advice.append("High afternoon temperatures. Delicate seedlings (e.g. coriander) benefit from light afternoon shade.")
                elif min_temp and min_temp < 10.0:
                    advice.append("Cool overnight temperatures. Bring sensitive tropicals indoors or shield from drafts.")
                    
                advice_str = " ".join(advice) if advice else "Moderate conditions. Standard seasonal watering schedule applies."

                return {
                    "status": "live",
                    "source": "Open-Meteo Weather API (CC-BY 4.0)",
                    "resolved_location": resolved_name,
                    "latitude": lat,
                    "longitude": lon,
                    "current_temp_c": temp_c,
                    "current_humidity": humidity,
                    "current_precip_mm": precip,
                    "temp_range_7d": f"{min_temp}°C - {max_temp}°C",
                    "rain_forecast_next_7_days_mm": round(rainfall_7d, 1),
                    "gardening_advice_implication": advice_str,
                    "is_live_data": True
                }
    except Exception:
        pass

    return {
        "status": "offline_or_unresolved",
        "source": "Local Fallback",
        "resolved_location": resolved_name,
        "latitude": lat,
        "longitude": lon,
        "current_temp_c": None,
        "current_humidity": None,
        "weather_condition": "Live forecast network timeout",
        "rain_forecast_next_7_days_mm": None,
        "gardening_advice_implication": "Verify container soil moisture manually with finger test.",
        "is_live_data": False
    }
