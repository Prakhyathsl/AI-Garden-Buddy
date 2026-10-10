"""Prompt generation service for Gemma models.
Designs structured, context-rich prompts requiring strict JSON outputs.
"""

import json
from typing import Dict, Any
from app.models.garden import GardenProfile, PlanRequest
from app.models.health import HealthAssessmentRequest


def build_garden_plan_prompt(request: PlanRequest, weather_data: Dict[str, Any]) -> str:
    profile: GardenProfile = request.profile
    
    context = {
        "garden_name": profile.garden_name,
        "location": profile.location,
        "country": profile.country,
        "garden_type": profile.garden_type,
        "growing_space_sq_ft": profile.space_sq_ft,
        "container_count": profile.containers_count,
        "sunlight_exposure": profile.sunlight_exposure,
        "soil_medium": profile.soil_medium,
        "water_availability": profile.water_availability,
        "experience_level": profile.experience_level,
        "preferred_plants": profile.preferred_plants,
        "gardening_goals": profile.gardening_goals,
        "daily_time_budget_minutes": profile.time_budget_mins_per_day,
        "planning_period": request.planning_period,
        "custom_focus": request.custom_focus or "General weekly balance",
        "live_weather": {
            "is_live_data": weather_data.get("is_live_data", False),
            "current_temp_c": weather_data.get("current_temp_c"),
            "current_humidity": weather_data.get("current_humidity"),
            "rain_forecast_next_7_days_mm": weather_data.get("rain_forecast_next_7_days_mm"),
            "meteorological_notes": weather_data.get("gardening_advice_implication", "")
        }
    }
    
    prompt = f"""You are the horticulturist engine inside AI Garden Buddy, powered by Google's open-weight Gemma model.
Your mission is to help people grow plants successfully while spending more time outdoors and less time on screens ("Touch Grass").
Generate a personalized, practical 7-day garden plan in strict JSON format.

### GARDEN CONTEXT:
{json.dumps(context, indent=2)}

### INSTRUCTIONS:
1. Provide a realistic assessment tailored to the user's specific space ({profile.space_sq_ft} sq ft, {profile.containers_count} containers), sunlight ({profile.sunlight_exposure}), and location ({profile.location}).
2. Recommend 3 to 4 plants that suit this space, sunlight, and the gardener's stated goals and experience ({profile.experience_level}). Include reasons, container size, and harvest expectations.
3. Design a daily 7-day task schedule. For EVERY day (Day 1 through Day 7), keep the task within the user's daily budget of {profile.time_budget_mins_per_day} minutes.
4. Each day MUST include an "outdoor_mission" that inspires the gardener to put down their phone, step outside, touch the soil, observe leaves, or watch pollinators.
5. Provide practical, non-chemical soil/compost guidance and gentle pest prevention.
6. Clearly state your assumptions (e.g., drainage in pots, tap water pH) and safety notes (toxicity to pets, washing hands, sun hydration).
7. List horticultural reference sources (e.g. ICAR, RHS, Extension services).

### OUTPUT REQUIREMENT:
Respond with ONLY valid JSON (no markdown formatting, no code fences, no conversational preface). The JSON must match this structure:
{{
  "summary": "Concise weekly summary",
  "garden_assessment": "Space, sunlight, and climate analysis",
  "recommended_plants": [
    {{
      "name": "Plant common name",
      "scientific_name": "Botanical name or null",
      "reason": "Why this fits their garden",
      "sunlight_fit": "Sunlight compatibility note",
      "container_or_spacing": "Pot size or spacing recommendation",
      "sowing_or_care_advice": "Actionable starter advice",
      "watering_guidance": "Specific watering advice",
      "days_to_harvest_estimate": "Estimated days to harvest"
    }}
  ],
  "weekly_tasks": [
    {{
      "id": "task-day1",
      "day_number": 1,
      "day_label": "Day 1 (Monday)",
      "title": "Clear action title",
      "description": "Step-by-step garden activity",
      "estimated_minutes": {min(profile.time_budget_mins_per_day, 20)},
      "materials": ["Item 1", "Item 2"],
      "outdoor_mission": "Screen-free outdoor observation or sensory task"
    }}
  ],
  "soil_and_compost_guidance": "Practical organic soil advice",
  "pest_prevention_tips": ["Tip 1", "Tip 2", "Tip 3"],
  "materials_needed": ["List of all items needed for the week"],
  "assumptions": ["Assumption 1", "Assumption 2"],
  "safety_notes": ["Safety note 1", "Safety note 2"],
  "sources": ["Agricultural extension or botanical reference"]
}}
Ensure exactly 7 tasks are generated (one for each day 1 through 7)."""

    return prompt


def build_health_assessment_prompt(request: HealthAssessmentRequest) -> str:
    prompt = f"""You are the plant health advisory engine in AI Garden Buddy, powered by Google's open-weight Gemma model.
Provide an educational, cautious, and practical symptom analysis for the affected plant.

### PLANT SYMPTOMS:
- Plant: {request.plant_name}
- Symptoms: {", ".join(request.symptoms)}
- Duration: {request.symptom_duration}
- Watering Routine: {request.watering_habit}
- Sunlight Exposure: {request.sunlight_condition}
- Soil Condition: {request.soil_condition}
- Location & Microclimate: {request.location_notes}
- Additional Notes: {request.additional_observations or "None"}

### INSTRUCTIONS:
1. Rank up to 3 most probable causes (e.g. overwatering, nutrient deficiency, fungal spore, light scorch).
2. Propose 2-3 distinguishing diagnostic questions that help differentiate causes.
3. Propose 3 gentle, low-risk checks the gardener can perform immediately with their hands/eyes (e.g. soil depth check, leaf underside inspection).
4. Outline safe, organic action steps. Do NOT recommend synthetic chemical poisons or unverified pesticide dosages.
5. State clearly when to contact a local master gardener or university agricultural extension.
6. Emphasize plant safety and pet precautions.

### OUTPUT REQUIREMENT:
Respond with ONLY valid JSON (no markdown fences, no preface):
{{
  "plant_name": "{request.plant_name}",
  "symptoms_evaluated": {json.dumps(request.symptoms)},
  "possible_causes": [
    {{
      "cause_name": "Name of condition",
      "rank": 1,
      "likelihood": "High",
      "reasoning": "Reason based on symptoms and watering habits"
    }}
  ],
  "distinguishing_questions": ["Question 1", "Question 2"],
  "low_risk_checks": ["Check 1", "Check 2", "Check 3"],
  "action_steps": ["Step 1", "Step 2", "Step 3"],
  "when_to_seek_expert": "Description of threshold requiring local specialist",
  "safety_notes": ["Organic precaution", "Pet safety warning"]
}}"""
    return prompt
