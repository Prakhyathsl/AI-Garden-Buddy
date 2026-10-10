"""Plant Health Guidance and Symptom Diagnostic Route."""

from fastapi import APIRouter, HTTPException, status
from app.models.health import HealthAssessmentRequest, HealthAssessmentResponse
from app.services.prompt_builder import build_health_assessment_prompt
from app.services.gemma_provider import GemmaProvider

router = APIRouter(tags=["Plant Health Assistant"])


@router.post("/api/garden/diagnose", response_model=HealthAssessmentResponse)
async def diagnose_plant_symptoms(request: HealthAssessmentRequest):
    prompt = build_health_assessment_prompt(request)
    
    try:
        raw_diagnosis, model_id, inference_mode = await GemmaProvider.generate_response(
            prompt=prompt,
            is_health_check=True,
            force_demo=request.use_sample_data
        )
    except TimeoutError as te:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=f"Plant health inference timed out: {str(te)}"
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Could not parse health diagnostic response: {str(ve)}"
        )
    except RuntimeError as re:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Gemma model unavailable: {str(re)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in diagnostic assistant: {str(e)}"
        )

    raw_diagnosis["model_id"] = model_id
    raw_diagnosis["inference_mode"] = inference_mode
    if "plant_name" not in raw_diagnosis or not raw_diagnosis["plant_name"]:
        raw_diagnosis["plant_name"] = request.plant_name
    if "symptoms_evaluated" not in raw_diagnosis:
        raw_diagnosis["symptoms_evaluated"] = request.symptoms

    try:
        validated = HealthAssessmentResponse(**raw_diagnosis)
        return validated
    except Exception as validation_err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Health diagnostic failed schema validation: {str(validation_err)}"
        )
