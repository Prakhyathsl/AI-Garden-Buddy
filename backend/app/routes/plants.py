"""Plant library search and detail endpoints."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.services.plant_database import CURATED_PLANTS, PlantRecord, search_plants, get_plant_by_id

router = APIRouter(tags=["Plant Library"])


@router.get("/api/plants", response_model=List[PlantRecord])
async def list_plants(
    query: Optional[str] = Query(None, description="Search term for common or scientific name"),
    category: Optional[str] = Query(None, description="Filter by Herb, Vegetable, Flower, etc."),
    container_only: Optional[bool] = Query(None, description="Only show container-friendly plants"),
    difficulty: Optional[str] = Query(None, description="Filter by Easy, Moderate, Challenging"),
    sunlight: Optional[str] = Query(None, description="Filter by sunlight requirements")
):
    return search_plants(
        query=query,
        category=category,
        container_only=container_only,
        difficulty=difficulty,
        sunlight=sunlight
    )


@router.get("/api/plants/{plant_id}", response_model=PlantRecord)
async def get_plant_detail(plant_id: str):
    plant = get_plant_by_id(plant_id)
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Plant with ID '{plant_id}' not found in curated database."
        )
    return plant
