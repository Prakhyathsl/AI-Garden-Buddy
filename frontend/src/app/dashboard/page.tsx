'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  CloudSun, 
  Droplets, 
  Thermometer, 
  Wind, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Compass, 
  AlertCircle,
  PlusCircle,
  Check
} from 'lucide-react';
import { 
  loadStoredProfile, 
  loadStoredPlan, 
  loadCompletedTasks, 
  saveCompletedTasks, 
  loadMyPlants 
} from '@/lib/storage';
import { fetchWeather, fetchPlants } from '@/lib/api';
import { GardenProfile, GardenPlan, PlantRecord, WeeklyTask } from '@/types';

export default function DashboardPage() {
  const [profile, setProfile] = useState<GardenProfile | null>(null);
  const [plan, setPlan] = useState<GardenPlan | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [weather, setWeather] = useState<any>(null);
  const [myPlants, setMyPlants] = useState<PlantRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prof = loadStoredProfile();
    setProfile(prof);

    const savedPlan = loadStoredPlan();
    setPlan(savedPlan);

    const storedTasks = loadCompletedTasks();
    setCompletedTasks(storedTasks);

    // Fetch weather for profile location
    fetchWeather(prof.location).then(setWeather).catch(() => {});

    // Fetch plants matching user's stored plant IDs
    const myIds = loadMyPlants();
    fetchPlants().then((allPlants) => {
      const filtered = allPlants.filter(p => myIds.includes(p.id));
      setMyPlants(filtered);
    }).catch(() => {});

    setLoading(false);
  }, []);

  const toggleTask = (taskId: string) => {
    const updated = { ...completedTasks, [taskId]: !completedTasks[taskId] };
    setCompletedTasks(updated);
    saveCompletedTasks(updated);
  };

  const currentTasks = plan?.weekly_tasks || [];
  const completedCount = currentTasks.filter(t => completedTasks[t.id]).length;
  const progressPercent = currentTasks.length > 0 ? Math.round((completedCount / currentTasks.length) * 100) : 0;

  // Active / next task to highlight
  const todayTask: WeeklyTask | undefined = currentTasks.find(t => !completedTasks[t.id]) || currentTasks[0];

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner: Active Garden & Quick Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8ebe4] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-xs font-semibold text-[#52796f] uppercase tracking-wider">Active Space</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1b4332] mt-1">
            {profile?.garden_name || 'My Garden'}
          </h1>
          <p className="text-sm text-gray-600 flex flex-wrap items-center gap-2 mt-1">
            <span>{profile?.location || 'Mangalore, India'}</span>
            <span>•</span>
            <span>{profile?.containers_count || 6} containers</span>
            <span>•</span>
            <span className="capitalize">{profile?.sunlight_exposure?.replace('_', ' ') || 'Partial sun'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/planner"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1b4332] text-white text-sm font-semibold hover:bg-[#2d6a4f] shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#74c69d]" />
            {plan ? 'Update Plan' : 'Plan my week'}
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ffffff] text-[#1b4332] text-sm font-medium border border-[#e8ebe4] hover:bg-[#f4f4ea] transition-all"
          >
            Edit Space
          </Link>
        </div>
      </div>

      {/* Grid: Weather & Touch Grass Outdoor Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <div className="garden-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#52796f]">Microclimate Sensor</span>
              <CloudSun className="w-5 h-5 text-[#dda15e]" />
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-[#1b4332]">
                {weather?.current_temp_c !== null && weather?.current_temp_c !== undefined 
                  ? `${Math.round(weather.current_temp_c)}°C` 
                  : '29°C'}
              </span>
              <span className="text-xs font-medium text-gray-500">
                {weather?.is_live_data ? 'Live Open-Meteo' : 'Seasonal fallback'}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-blue-500" /> Relative Humidity</span>
                <span className="font-semibold text-gray-800">{weather?.current_humidity ? `${weather.current_humidity}%` : '78%'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><CloudSun className="w-3.5 h-3.5 text-amber-500" /> 7-Day Rainfall</span>
                <span className="font-semibold text-gray-800">{weather?.rain_forecast_next_7_days_mm ? `${weather.rain_forecast_next_7_days_mm} mm` : '12.4 mm'}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-[#f4f4ea] text-xs text-[#2d6a4f] leading-relaxed">
            <strong>Horticultural note:</strong> {weather?.gardening_advice_implication || 'Morning sun conditions are active. Ensure container pots have clear bottom drainage.'}
          </div>
        </div>

        {/* Outdoor Mission Spotlight */}
        <div className="lg:col-span-2 rounded-3xl bg-[#1b4332] text-white p-6 sm:p-8 flex flex-col justify-between shadow-md border border-[#2d6a4f]/40">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-[#74c69d] border border-white/20">
              <Sparkles className="w-3.5 h-3.5" /> Today&apos;s Outdoor Mission
            </div>

            {todayTask ? (
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  {todayTask.title}
                </h3>
                <p className="text-base text-[#cad2c5] leading-relaxed font-light">
                  &ldquo;{todayTask.outdoor_mission}&rdquo;
                </p>
                <div className="flex items-center gap-4 text-xs text-[#cad2c5]/90 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#74c69d]" /> {todayTask.estimated_minutes} minutes
                  </span>
                  <span>•</span>
                  <span>{todayTask.day_label}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">No active plan yet</h3>
                <p className="text-sm text-[#cad2c5]">
                  Plan your week to generate a 7-day schedule with daily screen-free outdoor missions.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4">
            {todayTask && (
              <button
                onClick={() => toggleTask(todayTask.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  completedTasks[todayTask.id]
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#74c69d] text-[#132a22] hover:bg-[#52b788]'
                }`}
              >
                {completedTasks[todayTask.id] ? (
                  <>
                    <Check className="w-4 h-4" /> Completed
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Mark complete
                  </>
                )}
              </button>
            )}

            <Link
              href="/tasks"
              className="text-xs font-semibold text-[#74c69d] hover:text-white flex items-center gap-1 transition-colors"
            >
              View 7-day calendar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Weekly Progress Bar */}
      {plan && (
        <div className="garden-card p-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-[#1b4332] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#52796f]" /> Weekly Schedule Progress
            </span>
            <span className="font-semibold text-[#2d6a4f]">
              {completedCount} of {currentTasks.length} tasks completed ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-3 bg-[#e8ebe4] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2d6a4f] to-[#74c69d] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 pt-2">
            {currentTasks.map((t) => {
              const isDone = !!completedTasks[t.id];
              return (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isDone
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                      : 'bg-white border-[#e8ebe4] hover:border-[#84a98c]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>{t.day_label.split(' ')[0]}</span>
                    {isDone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5 text-gray-300" />}
                  </div>
                  <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight">
                    {t.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* My Garden Plants */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1b4332]">My Garden Plants</h2>
            <p className="text-xs text-gray-600">Curated species thriving in your space</p>
          </div>
          <Link
            href="/plants"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2d6a4f] hover:text-[#1b4332]"
          >
            <PlusCircle className="w-4 h-4" /> Browse Plant Library
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myPlants.map((plant) => (
            <div key={plant.id} className="garden-card p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-[#1b4332] text-base">{plant.common_name}</h3>
                    <p className="text-xs text-[#52796f] italic">{plant.scientific_name}</p>
                  </div>
                  <span className="badge-tag px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                    {plant.category}
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2">
                  {plant.planting_summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#f0f2ed] flex items-center justify-between text-xs text-gray-500">
                <span>☀️ {plant.sunlight_requirement.split(' ')[0]}</span>
                <span>💧 {plant.watering_needs} Water</span>
                <Link
                  href={`/plants?inspect=${plant.id}`}
                  className="font-semibold text-[#2d6a4f] hover:underline"
                >
                  Care Guide
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Garden Plan Status Card */}
      {plan && (
        <div className="garden-card p-5 bg-[#fbfbf7] border border-[#e8ebe4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#52796f] uppercase tracking-wider">Garden Plan Status</span>
            <p className="text-xs text-gray-700">
              Active 7-day schedule calibrated for your space and local microclimate.
            </p>
            <p className="text-[11px] text-gray-500">
              Generated: {new Date(plan.generated_at).toLocaleDateString()}
            </p>
          </div>
          <Link
            href="/planner"
            className="text-xs font-semibold text-[#1b4332] hover:text-[#2d6a4f] underline shrink-0"
          >
            Review Full Schedule →
          </Link>
        </div>
      )}
    </div>
  );
}
