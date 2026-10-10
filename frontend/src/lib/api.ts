import { GardenProfile, GardenPlan, PlantRecord, HealthAssessmentResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface SystemHealth {
  status: string;
  app_name: string;
  app_version: string;
  ai_engine: {
    model_family: string;
    active_model: string;
    inference_mode: string;
    is_local: boolean;
    ollama_server_reachable: boolean;
    installed_ollama_models: string[];
    remote_providers_configured: Record<string, boolean>;
    privacy_notice: string;
  };
}

export async function fetchSystemHealth(): Promise<SystemHealth> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Health check error: ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      app_name: 'AI Garden Buddy API',
      app_version: '1.0.0',
      ai_engine: {
        model_family: 'Garden Intelligence Engine',
        active_model: 'Backend Unreachable',
        inference_mode: 'offline',
        is_local: false,
        ollama_server_reachable: false,
        installed_ollama_models: [],
        remote_providers_configured: {},
        privacy_notice: 'Backend connection offline. Local demo fixtures remain available.'
      }
    };
  }
}

export async function generateGardenPlan(
  profile: GardenProfile,
  planningPeriod: string = 'This Week',
  customFocus?: string,
  useSampleData: boolean = false
): Promise<GardenPlan> {
  const res = await fetch(`${API_BASE_URL}/api/garden/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      profile,
      planning_period: planningPeriod,
      custom_focus: customFocus,
      use_sample_data: useSampleData
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to generate garden plan (${res.status})`);
  }

  return await res.json();
}

export async function fetchPlants(params?: {
  query?: string;
  category?: string;
  container_only?: boolean;
  difficulty?: string;
  sunlight?: string;
}): Promise<PlantRecord[]> {
  const searchParams = new URLSearchParams();
  if (params?.query) searchParams.append('query', params.query);
  if (params?.category) searchParams.append('category', params.category);
  if (params?.container_only) searchParams.append('container_only', 'true');
  if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
  if (params?.sunlight) searchParams.append('sunlight', params.sunlight);

  const res = await fetch(`${API_BASE_URL}/api/plants?${searchParams.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch plant library');
  return await res.json();
}

export async function fetchPlantDetail(id: string): Promise<PlantRecord> {
  const res = await fetch(`${API_BASE_URL}/api/plants/${id}`);
  if (!res.ok) throw new Error(`Plant not found (${id})`);
  return await res.json();
}

export async function diagnosePlantSymptoms(data: {
  plant_name: string;
  symptoms: string[];
  symptom_duration?: string;
  watering_habit?: string;
  sunlight_condition?: string;
  soil_condition?: string;
  location_notes?: string;
  additional_observations?: string;
  use_sample_data?: boolean;
}): Promise<HealthAssessmentResponse> {
  const res = await fetch(`${API_BASE_URL}/api/garden/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Diagnosis request failed (${res.status})`);
  }

  return await res.json();
}

export async function fetchWeather(location: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/weather?location=${encodeURIComponent(location)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
