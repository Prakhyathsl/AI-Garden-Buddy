"""AI Garden Buddy - Main FastAPI Application.
Hacktoberfest 2026 - Best Use of Gemma submission.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import health, plan, plants, diagnose, weather

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "Practical, personalized garden planning and plant health assistant "
        "powered by Google's open-weight Gemma model. Designed for Hacktoberfest 2026."
    ),
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router)
app.include_router(plan.router)
app.include_router(plants.router)
app.include_router(diagnose.router)
app.include_router(weather.router)


@app.get("/")
def root():
    return {
        "project": "AI Garden Buddy",
        "tagline": "Grow smarter. Waste less. Get outside.",
        "hackathon": "Hacktoberfest 2026 - Best Use of Gemma",
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/api/health"
    }
