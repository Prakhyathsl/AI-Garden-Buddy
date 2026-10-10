from typing import List, Optional
from pydantic import BaseModel, Field


class HealthAssessmentRequest(BaseModel):
    plant_name: str = Field(..., min_length=2, max_length=100, description="Common name of the affected plant")
    symptoms: List[str] = Field(..., min_length=1, description="List of observed symptoms (e.g. 'yellowing lower leaves', 'white powder')")
    symptom_duration: str = Field(default="3-5 days", description="How long symptoms have been visible")
    watering_habit: str = Field(default="every 2 days", description="How often and how much the plant is watered")
    sunlight_condition: str = Field(default="partial sun (4 hours)", description="Light received")
    soil_condition: str = Field(default="moist to touch", description="e.g., dry, soggy, crusty, well-draining")
    location_notes: Optional[str] = Field(default="Balcony facing east", description="Microclimate notes")
    additional_observations: Optional[str] = Field(default=None, description="Any pests spotted, fertilizer used, etc.")
    use_sample_data: bool = Field(default=False, description="Use sample verified assessment fixture")


class SuspectedCause(BaseModel):
    cause_name: str
    rank: int = Field(..., ge=1, le=5)
    likelihood: str = Field(..., description="High, Moderate, or Low")
    reasoning: str


class HealthAssessmentResponse(BaseModel):
    plant_name: str
    symptoms_evaluated: List[str]
    possible_causes: List[SuspectedCause]
    distinguishing_questions: List[str] = Field(
        ...,
        description="Key diagnostic questions to help distinguish between possible causes"
    )
    low_risk_checks: List[str] = Field(
        ...,
        description="Gentle, zero-risk checks (e.g., finger moisture test, leaf underside check)"
    )
    action_steps: List[str] = Field(
        ...,
        description="Safe, non-toxic practical steps to restore plant health"
    )
    when_to_seek_expert: str = Field(
        ...,
        description="Threshold when a local agricultural extension or master gardener should be consulted"
    )
    safety_notes: List[str] = Field(
        ...,
        description="Warnings regarding chemical avoidance, pesticide toxicity, and pet safety"
    )
    model_id: str
    inference_mode: str
    disclaimer: str = (
        "AI Garden Buddy guidance is advisory and educational. It is not an agricultural diagnostic certification. "
        "Never apply unlabeled or hazardous chemicals."
    )
