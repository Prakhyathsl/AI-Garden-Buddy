'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Settings, 
  Save, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Sun, 
  Droplet, 
  Clock, 
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  loadStoredProfile, 
  saveStoredProfile, 
  DEFAULT_GARDEN_PROFILE, 
  resetAllLocalData 
} from '@/lib/storage';
import { GardenProfile } from '@/types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<GardenProfile>(DEFAULT_GARDEN_PROFILE);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [plantInput, setPlantInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const p = loadStoredProfile();
    setProfile(p);
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!profile.garden_name.trim()) errs.garden_name = 'Garden name is required.';
    if (!profile.location.trim()) errs.location = 'Location is required.';
    if (profile.space_sq_ft <= 0) errs.space_sq_ft = 'Space must be greater than 0 sq ft.';
    if (profile.containers_count <= 0) errs.containers_count = 'Must have at least 1 container.';
    if (profile.time_budget_mins_per_day < 5) errs.time_budget = 'Minimum 5 minutes daily is needed for basic care.';
    if (profile.preferred_plants.length === 0) errs.preferred_plants = 'Select or add at least 1 plant.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    saveStoredProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const loadPreset = (presetName: string) => {
    if (presetName === 'mangalore') {
      setProfile(DEFAULT_GARDEN_PROFILE);
    } else if (presetName === 'bangalore') {
      setProfile({
        garden_name: 'Bangalore Sunny Terrace',
        location: 'Bangalore, Karnataka, India',
        country: 'India',
        garden_type: 'terrace',
        space_sq_ft: 120.0,
        containers_count: 14,
        sunlight_exposure: 'full_sun',
        soil_medium: 'compost_mix',
        water_availability: 'moderate',
        experience_level: 'intermediate',
        preferred_plants: ['Cherry Tomatoes', 'Green Chillies', 'Curry Leaf', 'Marigold', 'Malabar Spinach'],
        gardening_goals: ['Vegetables', 'Culinary herbs', 'Pollinator support'],
        time_budget_mins_per_day: 30,
        current_season_notes: 'Moderate pleasant plateau climate; 6+ hours bright sunlight'
      });
    } else if (presetName === 'indoor') {
      setProfile({
        garden_name: 'Kitchen Windowsill Herb Ledge',
        location: 'Mumbai, Maharashtra, India',
        country: 'India',
        garden_type: 'indoor',
        space_sq_ft: 12.0,
        containers_count: 3,
        sunlight_exposure: 'partial_shade',
        soil_medium: 'coco_peat',
        water_availability: 'high',
        experience_level: 'beginner',
        preferred_plants: ['Spearmint (Pudina)', 'Fenugreek Microgreens', 'Coriander'],
        gardening_goals: ['Fresh tea herbs', 'Microgreens'],
        time_budget_mins_per_day: 10,
        current_season_notes: 'Indirect window light, protected from coastal winds'
      });
    }
  };

  const addPlantChip = () => {
    if (!plantInput.trim()) return;
    if (!profile.preferred_plants.includes(plantInput.trim())) {
      setProfile({
        ...profile,
        preferred_plants: [...profile.preferred_plants, plantInput.trim()]
      });
    }
    setPlantInput('');
  };

  const removePlantChip = (plant: string) => {
    setProfile({
      ...profile,
      preferred_plants: profile.preferred_plants.filter(p => p !== plant)
    });
  };

  const toggleGoal = (goal: string) => {
    const goals = profile.gardening_goals || [];
    if (goals.includes(goal)) {
      setProfile({ ...profile, gardening_goals: goals.filter(g => g !== goal) });
    } else {
      setProfile({ ...profile, gardening_goals: [...goals, goal] });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1b4332] flex items-center gap-2">
          <Settings className="w-7 h-7 text-[#52796f]" /> Garden Profile & Space Settings
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Customize your microclimate and space constraints. Your weekly planner uses these parameters to generate grounded schedules.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="garden-card p-5 bg-[#ffffff] border border-[#e8ebe4] space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#52796f]">
          Quick Presets & Demonstrations
        </span>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => loadPreset('mangalore')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#e8f5e9] text-[#1b4332] hover:bg-[#c8e6c9] transition-all"
          >
            Mangalore Coastal Balcony (40 sq ft)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('bangalore')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#fefae0] text-[#603813] hover:bg-[#faedcd] transition-all"
          >
            Bangalore Sunny Terrace (120 sq ft)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('indoor')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#f0f4f8] text-[#1e3a8a] hover:bg-[#dbeafe] transition-all"
          >
            Kitchen Windowsill Ledge (12 sq ft)
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="garden-card p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-[#1b4332] border-b border-[#e8ebe4] pb-3">
            1. Garden Identity & Geography
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Garden Friendly Name *
              </label>
              <input
                type="text"
                value={profile.garden_name}
                onChange={(e) => setProfile({ ...profile, garden_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                placeholder="e.g. Sunny Balcony"
              />
              {errors.garden_name && <p className="text-xs text-red-600 mt-1">{errors.garden_name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                City, Region & Country *
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                placeholder="e.g. Mangalore, Coastal Karnataka, India"
              />
              {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Garden Setting
              </label>
              <select
                value={profile.garden_type}
                onChange={(e) => setProfile({ ...profile, garden_type: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
              >
                <option value="balcony">Balcony</option>
                <option value="terrace">Rooftop Terrace</option>
                <option value="backyard">Backyard Garden</option>
                <option value="raised_bed">Raised Bed</option>
                <option value="indoor">Indoor Windowsill</option>
                <option value="community_garden">Community Plot</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Approx. Space (sq ft) *
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={profile.space_sq_ft}
                onChange={(e) => setProfile({ ...profile, space_sq_ft: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Containers / Pots Count *
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={profile.containers_count}
                onChange={(e) => setProfile({ ...profile, containers_count: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
              />
            </div>
          </div>
        </div>

        <div className="garden-card p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-[#1b4332] border-b border-[#e8ebe4] pb-3">
            2. Environment & Growing Resources
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Sunlight Exposure
              </label>
              <select
                value={profile.sunlight_exposure}
                onChange={(e) => setProfile({ ...profile, sunlight_exposure: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
              >
                <option value="full_sun">Full Sun (6+ hours)</option>
                <option value="partial_sun">Partial Sun (4-6 hours)</option>
                <option value="partial_shade">Partial Shade (2-4 hours)</option>
                <option value="shade">Dappled / Deep Shade</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Soil Medium
              </label>
              <select
                value={profile.soil_medium}
                onChange={(e) => setProfile({ ...profile, soil_medium: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
              >
                <option value="potting_mix">Standard Potting Mix</option>
                <option value="compost_mix">Compost Enriched Loam</option>
                <option value="coco_peat">Coco-Peat & Aerated Mix</option>
                <option value="red_soil">Coastal Red Soil</option>
                <option value="garden_soil">Native Garden Soil</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Water Availability
              </label>
              <select
                value={profile.water_availability}
                onChange={(e) => setProfile({ ...profile, water_availability: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
              >
                <option value="high">High (Piped tap source)</option>
                <option value="moderate">Moderate (Standard watering can)</option>
                <option value="limited">Limited (Careful conservation)</option>
                <option value="rainwater_harvested">Rainwater Harvested</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Daily Gardening Time Budget: <span className="text-[#1b4332] text-sm font-extrabold">{profile.time_budget_mins_per_day} minutes</span>
              </label>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={profile.time_budget_mins_per_day}
              onChange={(e) => setProfile({ ...profile, time_budget_mins_per_day: parseInt(e.target.value) })}
              className="w-full accent-[#2d6a4f] cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              Daily task schedules are bounded to fit inside this exact window.
            </p>
          </div>
        </div>

        <div className="garden-card p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-[#1b4332] border-b border-[#e8ebe4] pb-3">
            3. Plants & Gardening Objectives
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Preferred Plants
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={plantInput}
                onChange={(e) => setPlantInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPlantChip(); } }}
                className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                placeholder="Type a plant and press Enter (e.g., Lemongrass, Basil)"
              />
              <button
                type="button"
                onClick={addPlantChip}
                className="px-4 py-2 bg-[#2d6a4f] text-white text-xs font-semibold rounded-xl hover:bg-[#1b4332]"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.preferred_plants.map((plant) => (
                <span
                  key={plant}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#e8f5e9] text-[#1b4332] border border-[#c8e6c9]"
                >
                  {plant}
                  <button
                    type="button"
                    onClick={() => removePlantChip(plant)}
                    className="hover:text-red-600 font-bold ml-1 text-sm leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {errors.preferred_plants && <p className="text-xs text-red-600 mt-1">{errors.preferred_plants}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Gardening Goals
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Fresh herbs',
                'Daily tea leaves',
                'Home vegetables',
                'Pollinator support',
                'Medicinal wellness',
                'Stress relief & outdoor time',
                'Zero-chemical greens'
              ].map((goal) => {
                const selected = profile.gardening_goals?.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-[#1b4332] text-white border-[#1b4332]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#2d6a4f]'
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1b4332] text-white text-sm font-bold hover:bg-[#2d6a4f] shadow-md transition-all"
          >
            <Save className="w-4 h-4 text-[#74c69d]" /> Save Profile
          </button>

          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-4 h-4 text-emerald-600" /> Settings saved locally!
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              if (confirm('Reset profile to default coastal balcony preset?')) {
                setProfile(DEFAULT_GARDEN_PROFILE);
                saveStoredProfile(DEFAULT_GARDEN_PROFILE);
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-700 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Default Preset
          </button>
        </div>
      </form>
    </div>
  );
}
