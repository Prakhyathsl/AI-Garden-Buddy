from typing import List, Optional
from pydantic import BaseModel, Field


class GardenProfile(BaseModel):
    garden_name: str = Field(..., min_length=2, max_length=100, description="Friendly name for the garden")
    location: str = Field(..., min_length=2, max_length=150, description="City, region, and country (e.g. Mangalore, Coastal Karnataka, India)")
    country: str = Field(default="India", max_length=100)
    garden_type: str = Field(
        default="balcony",
        description="balcony, terrace, backyard, raised_bed, indoor, or community_garden"
    )
    space_sq_ft: Optional[float] = Field(default=40.0, ge=1.0, le=10000.0, description="Approximate growing space in sq ft")
    containers_count: Optional[int] = Field(default=6, ge=1, le=500, description="Number of pots or planters")
    sunlight_exposure: str = Field(
        default="partial_sun",
        description="full_sun (6+ hrs), partial_sun (3-6 hrs), partial_shade, or shade"
    )
    soil_medium: str = Field(
        default="potting_mix",
        description="potting_mix, garden_soil, compost_mix, red_soil, coco_peat"
    )
    water_availability: str = Field(
        default="moderate",
        description="high (tap/piped), moderate, limited, or rainwater_harvested"
    )
    experience_level: str = Field(
        default="beginner",
        description="beginner, intermediate, or experienced"
    )
    preferred_plants: List[str] = Field(
        default_factory=lambda: ["Holy Basil (Tulsi)", "Mint (Pudina)", "Cherry Tomatoes", "Green Chillies"],
        description="Plants the gardener would love to grow"
    )
    gardening_goals: List[str] = Field(
        default_factory=lambda: ["Fresh herbs", "Daily tea leaves", "Pollinator support", "Stress relief"],
        description="Main objectives for the garden"
    )
    time_budget_mins_per_day: int = Field(
        default=20,
        ge=5,
        le=240,
        description="Realistic time gardener can spend per day"
    )
    current_season_notes: Optional[str] = Field(
        default=None,
        description="Optional local weather notes or seasonal indicators"
    )


class PlanRequest(BaseModel):
    profile: GardenProfile
    planning_period: str = Field(default="This Week", description="Planning horizon, e.g., 'This Week' or 'Next 7 Days'")
    custom_focus: Optional[str] = Field(default=None, description="Optional custom priority, e.g., 'repotted seedlings care' or 'monsoon prep'")
    use_sample_data: bool = Field(default=False, description="Explicitly request the pre-verified demo fixture for testing without inference")
