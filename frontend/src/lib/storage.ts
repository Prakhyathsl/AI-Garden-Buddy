import { GardenProfile, GardenPlan, JournalEntry } from '../types';

export const DEFAULT_GARDEN_PROFILE: GardenProfile = {
  garden_name: 'Mangalore Coastal Balcony',
  location: 'Mangalore, Coastal Karnataka, India',
  country: 'India',
  garden_type: 'balcony',
  space_sq_ft: 40.0,
  containers_count: 6,
  sunlight_exposure: 'partial_sun',
  soil_medium: 'potting_mix',
  water_availability: 'moderate',
  experience_level: 'beginner',
  preferred_plants: ['Holy Basil (Tulsi)', 'Mint (Pudina)', 'Cherry Tomatoes', 'Green Chillies'],
  gardening_goals: ['Fresh herbs', 'Daily tea leaves', 'Pollinator support'],
  time_budget_mins_per_day: 20,
  current_season_notes: 'Warm tropical maritime air; 4 hours of bright morning sun'
};

const STORAGE_KEYS = {
  PROFILE: 'ai_garden_profile_v1',
  ACTIVE_PLAN: 'ai_garden_active_plan_v1',
  MY_PLANTS: 'ai_garden_my_plants_v1',
  JOURNAL: 'ai_garden_journal_v1',
  COMPLETED_TASKS: 'ai_garden_completed_tasks_v1'
};

export function loadStoredProfile(): GardenProfile {
  if (typeof window === 'undefined') return DEFAULT_GARDEN_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading profile from localStorage', e);
  }
  return DEFAULT_GARDEN_PROFILE;
}

export function saveStoredProfile(profile: GardenProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed saving profile', e);
  }
}

export function loadStoredPlan(): GardenPlan | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_PLAN);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed loading stored plan', e);
  }
  return null;
}

export function saveStoredPlan(plan: GardenPlan): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error('Failed saving plan', e);
  }
}

export function loadMyPlants(): string[] {
  if (typeof window === 'undefined') return ['tulsi', 'mint', 'cherry-tomato'];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MY_PLANTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed loading my plants', e);
  }
  return ['tulsi', 'mint', 'cherry-tomato'];
}

export function saveMyPlants(plantIds: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MY_PLANTS, JSON.stringify(plantIds));
  } catch (e) {
    console.error('Failed saving my plants', e);
  }
}

export function loadCompletedTasks(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_TASKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed loading completed tasks', e);
  }
  return {};
}

export function saveCompletedTasks(tasks: Record<string, boolean>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed saving completed tasks', e);
  }
}

export function loadJournalEntries(): JournalEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed loading journal entries', e);
  }
  return [
    {
      id: 'j-init-1',
      date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      plant_name: 'Holy Basil (Tulsi)',
      category: 'Observation',
      notes: 'Noticed tiny new leaf buds forming after Tuesday apex pinching. Zero pests under morning leaves.',
      outdoor_minutes: 15
    },
    {
      id: 'j-init-2',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      plant_name: 'Spearmint (Pudina)',
      category: 'Watering',
      notes: 'Added fresh compost layer and watered thoroughly. Fragrant menthol scent filled the balcony.',
      outdoor_minutes: 20
    }
  ];
}

export function saveJournalEntries(entries: JournalEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed saving journal entries', e);
  }
}

export function resetAllLocalData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_PLAN);
  localStorage.removeItem(STORAGE_KEYS.MY_PLANTS);
  localStorage.removeItem(STORAGE_KEYS.JOURNAL);
  localStorage.removeItem(STORAGE_KEYS.COMPLETED_TASKS);
}
