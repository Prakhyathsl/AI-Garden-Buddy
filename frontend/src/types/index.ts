export interface GardenProfile {
  garden_name: string;
  location: string;
  country: string;
  garden_type: 'balcony' | 'terrace' | 'backyard' | 'raised_bed' | 'indoor' | 'community_garden';
  space_sq_ft: number;
  containers_count: number;
  sunlight_exposure: 'full_sun' | 'partial_sun' | 'partial_shade' | 'shade';
  soil_medium: 'potting_mix' | 'garden_soil' | 'compost_mix' | 'red_soil' | 'coco_peat';
  water_availability: 'high' | 'moderate' | 'limited' | 'rainwater_harvested';
  experience_level: 'beginner' | 'intermediate' | 'experienced';
  preferred_plants: string[];
  gardening_goals: string[];
  time_budget_mins_per_day: number;
  current_season_notes?: string;
}

export interface RecommendedPlant {
  name: string;
  scientific_name?: string;
  reason: string;
  sunlight_fit: string;
  container_or_spacing: string;
  sowing_or_care_advice: string;
  watering_guidance: string;
  days_to_harvest_estimate?: string;
}

export interface WeeklyTask {
  id: string;
  day_number: number;
  day_label: string;
  title: string;
  description: string;
  estimated_minutes: number;
  materials: string[];
  outdoor_mission: string;
  completed?: boolean;
  completed_at?: string;
}

export interface GardenPlan {
  summary: string;
  garden_assessment: string;
  recommended_plants: RecommendedPlant[];
  weekly_tasks: WeeklyTask[];
  soil_and_compost_guidance: string;
  pest_prevention_tips: string[];
  materials_needed: string[];
  assumptions: string[];
  safety_notes: string[];
  sources: string[];
  generated_at: string;
  model_id: string;
  inference_mode: string;
}

export interface PlantRecord {
  id: string;
  common_name: string;
  scientific_name?: string;
  category: string;
  container_friendly: boolean;
  sunlight_requirement: string;
  watering_needs: string;
  difficulty: string;
  growing_period_days?: string;
  ideal_temperature_range: string;
  suitable_soil: string;
  container_depth_inches?: number;
  spacing_inches?: number;
  planting_summary: string;
  harvesting_summary: string;
  common_problems: string[];
  preventive_care: string[];
  companion_plants: string[];
  caution_or_toxicity_notes?: string;
  horticultural_sources: string[];
}

export interface SuspectedCause {
  cause_name: string;
  rank: number;
  likelihood: string;
  reasoning: string;
}

export interface HealthAssessmentResponse {
  plant_name: string;
  symptoms_evaluated: string[];
  possible_causes: SuspectedCause[];
  distinguishing_questions: string[];
  low_risk_checks: string[];
  action_steps: string[];
  when_to_seek_expert: string;
  safety_notes: string[];
  model_id: string;
  inference_mode: string;
  disclaimer: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  plant_name?: string;
  category: 'Observation' | 'Watering' | 'Harvest' | 'Pest Check' | 'Composting';
  notes: string;
  outdoor_minutes: number;
}
