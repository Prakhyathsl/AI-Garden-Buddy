"""Garden Plan Generation Endpoint powered by Gemma."""

import datetime
from fastapi import APIRouter, HTTPException, status
from app.models.garden import PlanRequest
from app.models.plan import GardenPlan
from app.services.weather_service import fetch_weather_and_season
from app.services.prompt_builder import build_garden_plan_prompt
from app.services.gemma_provider import GemmaProvider

router = APIRouter(tags=["Garden Planner"])


@router.post("/api/garden/plan", response_model=GardenPlan)
async def generate_garden_plan(request: PlanRequest):
    # 1. Fetch real weather & seasonal context for location
    weather_info = await fetch_weather_and_season(request.profile.location)
    
    # 2. Build structured prompt for Gemma
    prompt = build_garden_plan_prompt(request, weather_info)
    
    # 3. Call Gemma inference provider
    try:
        raw_plan, model_id, inference_mode = await GemmaProvider.generate_response(
            prompt=prompt,
            is_health_check=False,
            force_demo=request.use_sample_data
        )
    except TimeoutError as te:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=f"Gemma model inference timed out: {str(te)}. Please try again or check system load."
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Gemma model output could not be parsed into structured format: {str(ve)}."
        )
    except RuntimeError as re:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Gemma inference engine unavailable: {str(re)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error during plan generation: {str(e)}"
        )

    # 4. Attach metadata & timestamps
    raw_plan["generated_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    raw_plan["model_id"] = model_id
    raw_plan["inference_mode"] = inference_mode
    
    # Ensure tasks have ids
    if "weekly_tasks" in raw_plan:
        for idx, task in enumerate(raw_plan["weekly_tasks"], start=1):
            if "id" not in task or not task["id"]:
                task["id"] = f"task-day{idx}"
            if "day_number" not in task:
                task["day_number"] = idx
            if "day_label" not in task:
                task["day_label"] = f"Day {idx}"
            if "completed" not in task:
                task["completed"] = False

    # 5. Strict Pydantic validation
    try:
        validated_plan = GardenPlan(**raw_plan)
        return validated_plan
    except Exception as validation_err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Model output failed schema validation: {str(validation_err)}"
        )
