'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  RotateCw, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Compass, 
  Leaf, 
  Calendar, 
  Printer, 
  Bookmark, 
  Check, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { loadStoredProfile, loadStoredPlan, saveStoredPlan } from '@/lib/storage';
import { generateGardenPlan } from '@/lib/api';
import { GardenProfile, GardenPlan } from '@/types';

export default function PlannerPage() {
  const [profile, setProfile] = useState<GardenProfile | null>(null);
  const [plan, setPlan] = useState<GardenPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planningPeriod, setPlanningPeriod] = useState('This Week');
  const [customFocus, setCustomFocus] = useState('');
  const [useSampleData, setUseSampleData] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [activeStepText, setActiveStepText] = useState('');

  useEffect(() => {
    const prof = loadStoredProfile();
    setProfile(prof);
    const saved = loadStoredPlan();
    if (saved) setPlan(saved);
  }, []);

  const handleGenerate = async (forceDemo: boolean = false) => {
    if (!profile) return;
    setLoading(true);
    setError(null);

    const steps = [
      'Retrieving live meteorological context from Open-Meteo...',
      'Synthesizing space, container depth, and sunlight parameters...',
      'Running Google Gemma 2 open-weight inference...',
      'Validating structured 7-day schedule and outdoor missions...',
    ];

    let stepIdx = 0;
    setActiveStepText(steps[0]);
    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setActiveStepText(steps[stepIdx]);
      }
    }, 1200);

    try {
      const generated = await generateGardenPlan(
        profile,
        planningPeriod,
        customFocus || undefined,
        forceDemo || useSampleData
      );
      clearInterval(stepInterval);
      setPlan(generated);
      saveStoredPlan(generated);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || 'Inference call failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8ebe4] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-[#1b4332]">
              <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" /> Powered by Gemma
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1b4332] mt-1">
            AI Weekly Garden Planner
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Generates a structured 7-day schedule with daily screen-free outdoor missions tailored to your space.
          </p>
        </div>

        {plan && (
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-gray-700 text-xs font-semibold border border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
          </div>
        )}
      </div>

      {/* Generator Form Controls */}
      <div className="garden-card p-6 bg-white border border-[#e8ebe4] space-y-5 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0f2ed] pb-3">
          <div className="space-y-0.5">
            <h3 className="font-bold text-[#1b4332] text-sm">Garden Constraints</h3>
            <p className="text-xs text-gray-500">
              {profile?.garden_name} • {profile?.space_sq_ft} sq ft • {profile?.containers_count} containers • {profile?.sunlight_exposure?.replace('_', ' ')} • {profile?.location}
            </p>
          </div>

          <Link
            href="/profile"
            className="text-xs font-semibold text-[#2d6a4f] hover:underline"
          >
            Edit Space Settings →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Planning Horizon
            </label>
            <select
              value={planningPeriod}
              onChange={(e) => setPlanningPeriod(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            >
              <option value="This Week">This Week (Current 7 Days)</option>
              <option value="Next Week">Upcoming Week</option>
              <option value="Monsoon / Rainy Season Transition">Rainy Season Prep</option>
              <option value="Dry Season Maintenance">Dry Season Conservation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Custom Focus (Optional)
            </label>
            <input
              type="text"
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              placeholder="e.g. repotting, companion planting, seed propagation"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            />
          </div>
        </div>

        {/* Generate Button & Status */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#f0f2ed]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleGenerate(false)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1b4332] text-white text-sm font-bold hover:bg-[#2d6a4f] disabled:opacity-50 shadow-md transition-all"
            >
              <Sparkles className={`w-4 h-4 text-[#74c69d] ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Synthesizing with Gemma...' : plan ? 'Regenerate 7-Day Plan' : 'Generate 7-Day Plan'}
            </button>

            <button
              type="button"
              onClick={() => handleGenerate(true)}
              disabled={loading}
              className="text-xs font-medium text-[#52796f] hover:text-[#1b4332] underline"
            >
              Preview Sample Plan
            </button>
          </div>

          {saveToast && (
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Plan saved to dashboard!
            </span>
          )}
        </div>
      </div>

      {/* Loading Progress State */}
      {loading && (
        <div className="garden-card p-10 text-center space-y-4 bg-white border border-[#e8ebe4] shadow-md animate-pulse">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-[#1b4332] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#2d6a4f] animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#1b4332]">Synthesizing Garden Plan</h3>
            <p className="text-xs text-gray-600 font-mono tracking-tight">{activeStepText}</p>
          </div>
          <div className="max-w-md mx-auto h-2 bg-[#e8ebe4] rounded-full overflow-hidden">
            <div className="h-full bg-[#2d6a4f] animate-pulse w-3/4"></div>
          </div>
        </div>
      )}

      {/* Error State with Clean Recovery Guidance */}
      {error && !loading && (
        <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold">Gemma Inference Service Unavailable</h3>
          </div>
          <p className="text-xs leading-relaxed text-amber-900 bg-white/70 p-3 rounded-lg border border-amber-200 font-mono">
            {error}
          </p>
          <p className="text-xs text-amber-800">
            To enable real-time inference, ensure <code>GEMINI_API_KEY</code> is configured in <code>.env</code> (Google AI Studio) or start local Ollama.
          </p>
          <div className="pt-1">
            <button
              onClick={() => handleGenerate(true)}
              className="px-4 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f] transition-colors"
            >
              Load Sample Garden Plan
            </button>
          </div>
        </div>
      )}

      {/* Plan Render Output */}
      {plan && !loading && (
        <div className="space-y-8">
          {/* Summary & Transparency Header */}
          <div className="garden-card p-6 sm:p-8 bg-white border border-[#e8ebe4] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0f2ed] pb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold badge-gemma">
                Model: {plan.model_id} ({plan.inference_mode})
              </span>
              <span className="text-xs text-gray-500">
                Generated: {new Date(plan.generated_at).toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#1b4332]">Garden Assessment & Strategy</h2>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {plan.summary}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed bg-[#fbfbf7] p-4 rounded-xl border border-[#e8ebe4]">
                {plan.garden_assessment}
              </p>
            </div>
          </div>

          {/* Recommended Plants */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#1b4332] flex items-center gap-2">
              <Leaf className="w-5 h-5 text-[#2d6a4f]" /> Recommended Plants for Your Space
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plan.recommended_plants.map((p, idx) => (
                <div key={idx} className="garden-card p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-bold text-base text-[#1b4332]">{p.name}</h4>
                    {p.scientific_name && (
                      <p className="text-xs italic text-[#52796f] -mt-1">{p.scientific_name}</p>
                    )}
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {p.reason}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-[#f0f2ed] text-[11px] text-gray-600">
                    <p><strong>☀️ Sunlight:</strong> {p.sunlight_fit}</p>
                    <p><strong>🪴 Container:</strong> {p.container_or_spacing}</p>
                    <p><strong>💧 Water:</strong> {p.watering_guidance}</p>
                    {p.days_to_harvest_estimate && (
                      <p><strong>⏱️ Harvest:</strong> {p.days_to_harvest_estimate}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Structured Task Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#1b4332] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#2d6a4f]" /> 7-Day Screen-Free Schedule
                </h3>
                <p className="text-xs text-gray-600">Each day includes an outdoor mission to connect you with nature.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {plan.weekly_tasks.map((task) => (
                <div
                  key={task.id}
                  className="garden-card p-5 sm:p-6 bg-white border border-[#e8ebe4] hover:border-[#84a98c] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1b4332] text-white">
                          {task.day_label}
                        </span>
                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {task.estimated_minutes} mins
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-[#1b4332]">{task.title}</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{task.description}</p>

                      {/* Screen-free Outdoor Mission */}
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                        <span className="font-bold flex items-center gap-1 text-[#bc6c25]">
                          🌿 Touch Grass Mission:
                        </span>
                        <p className="italic leading-relaxed">{task.outdoor_mission}</p>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      {task.materials && task.materials.length > 0 && (
                        <div className="text-xs text-gray-500 space-y-1">
                          <span className="font-semibold text-gray-700 block">Tools Needed:</span>
                          <ul className="space-y-0.5">
                            {task.materials.map((m, i) => (
                              <li key={i}>• {m}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soil, Composting & Eco Pest Prevention */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="garden-card p-6 space-y-3">
              <h4 className="font-bold text-[#1b4332] text-base flex items-center gap-2">
                🌱 Soil & Compost Advice
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                {plan.soil_and_compost_guidance}
              </p>
            </div>

            <div className="garden-card p-6 space-y-3">
              <h4 className="font-bold text-[#1b4332] text-base flex items-center gap-2">
                🐞 Organic Pest Prevention
              </h4>
              <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
                {plan.pest_prevention_tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Transparency: Assumptions, Safety & Sources */}
          <div className="garden-card p-6 bg-[#fbfbf7] border border-[#e8ebe4] space-y-4">
            <h4 className="font-bold text-[#1b4332] text-sm uppercase tracking-wider">
              Transparency, Safety & Horticultural Grounding
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600">
              <div>
                <span className="font-bold text-gray-800 block mb-1">Explicit Assumptions:</span>
                <ul className="space-y-1 list-disc list-inside">
                  {plan.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-gray-800 block mb-1">Safety Notes:</span>
                <ul className="space-y-1 list-disc list-inside">
                  {plan.safety_notes.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-gray-800 block mb-1">Horticultural References (Curated Literature):</span>
                <p className="text-[10px] text-gray-500 mb-1.5 italic">Grounded in established agricultural extension guidelines (ICAR, RHS, FAO) — distinct from AI schedule suggestions.</p>
                <ul className="space-y-1 list-disc list-inside">
                  {plan.sources.map((src, i) => (
                    <li key={i}>{src}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
