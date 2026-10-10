from typing import List, Optional
from pydantic import BaseModel, Field


class RecommendedPlant(BaseModel):
    name: str = Field(..., description="Common name of the plant")
    scientific_name: Optional[str] = Field(default=None, description="Botanical name if verified")
    reason: str = Field(..., description="Why this plant fits the gardener's space, sunlight, and time")
    sunlight_fit: str = Field(..., description="E.g., Needs 4-6 hrs partial sun; aligns with balcony orientation")
    container_or_spacing: str = Field(..., description="Container size or spacing recommendations")
    sowing_or_care_advice: str = Field(..., description="Practical starting step or ongoing tip")
    watering_guidance: str = Field(..., description="Watering advice tailored to container and climate")
    days_to_harvest_estimate: Optional[str] = Field(default=None, description="Estimated time window to harvest or bloom")


class WeeklyTask(BaseModel):
    id: str = Field(..., description="Unique task identifier, e.g. task-day1")
    day_number: int = Field(..., ge=1, le=7, description="Day 1 to 7")
    day_label: str = Field(..., description="Day header, e.g., 'Day 1 (Monday)'")
    title: str = Field(..., description="Action-oriented task title")
    description: str = Field(..., description="Practical, step-by-step garden instruction")
    estimated_minutes: int = Field(..., ge=5, le=180, description="Estimated time in minutes")
    materials: List[str] = Field(default_factory=list, description="Items or tools needed")
    outdoor_mission: str = Field(..., description="Inspiring prompt to step away from screens and connect with the garden")
    completed: bool = Field(default=False, description="Completion status")
    completed_at: Optional[str] = Field(default=None, description="Timestamp when completed")


class GardenPlan(BaseModel):
    summary: str = Field(..., description="Executive summary of the weekly plan")
    garden_assessment: str = Field(..., description="Analysis of garden space, light, and climate context")
    recommended_plants: List[RecommendedPlant] = Field(..., description="Personalized plant recommendations")
    weekly_tasks: List[WeeklyTask] = Field(..., description="Structured 7-day actionable outdoor task calendar")
    soil_and_compost_guidance: str = Field(..., description="Nutrient and soil structure recommendations")
    pest_prevention_tips: List[str] = Field(..., description="Gentle, ecological pest checks and preventive measures")
    materials_needed: List[str] = Field(default_factory=list, description="List of materials or supplies for the week")
    assumptions: List[str] = Field(..., description="Explicit assumptions made about weather, container drainage, etc.")
    safety_notes: List[str] = Field(..., description="Important safety checks (e.g., toxic leaves, sun exposure, ergonomics)")
    sources: List[str] = Field(default_factory=list, description="Horticultural reference citations")
    generated_at: str = Field(..., description="ISO 8601 timestamp of plan generation")
    model_id: str = Field(..., description="Explicit Gemma model identifier (e.g. gemma2:9b or gemma2-9b-it)")
    inference_mode: str = Field(..., description="'ollama_local', 'groq_api', 'huggingface_api', 'openrouter_api', or 'demo_mode'")
