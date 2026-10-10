'use client';

import React, { useState } from 'react';
import { 
  Stethoscope, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  Info, 
  RotateCw,
  Droplet,
  Sun,
  Eye
} from 'lucide-react';
import { diagnosePlantSymptoms } from '@/lib/api';
import { HealthAssessmentResponse } from '@/types';

export default function HealthPage() {
  const [plantName, setPlantName] = useState('Holy Basil (Tulsi)');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Yellowing lower leaves',
    'Brown leaf margins',
    'Slight drooping'
  ]);
  const [symptomInput, setSymptomInput] = useState('');
  const [duration, setDuration] = useState('3-5 days');
  const [watering, setWatering] = useState('every day (morning)');
  const [sunlight, setSunlight] = useState('4 hours morning sun');
  const [soilMoisture, setSoilMoisture] = useState('moist and damp to touch');
  const [useSampleData, setUseSampleData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HealthAssessmentResponse | null>(null);

  const symptomPresets = [
    'Yellowing lower leaves',
    'Brown leaf margins',
    'Slight drooping',
    'White powdery residue',
    'Curled leaf margins',
    'Holes or chewing marks',
    'Stunted pale growth',
    'Sudden leaf drop'
  ];

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const addCustomSymptom = () => {
    if (!symptomInput.trim()) return;
    if (!selectedSymptoms.includes(symptomInput.trim())) {
      setSelectedSymptoms([...selectedSymptoms, symptomInput.trim()]);
    }
    setSymptomInput('');
  };

  const handleSubmit = async (forceDemo: boolean = false) => {
    if (!plantName.trim() || selectedSymptoms.length === 0) {
      setError('Please provide a plant name and select at least one symptom.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await diagnosePlantSymptoms({
        plant_name: plantName,
        symptoms: selectedSymptoms,
        symptom_duration: duration,
        watering_habit: watering,
        sunlight_condition: sunlight,
        soil_condition: soilMoisture,
        use_sample_data: forceDemo || useSampleData
      });
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Diagnostic assessment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="border-b border-[#e8ebe4] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-[#1b4332] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" /> Cautious Gemma 2 Plant Advisory
        </div>
        <h1 className="text-3xl font-extrabold text-[#1b4332] flex items-center gap-2">
          <Stethoscope className="w-8 h-8 text-[#52796f]" /> Plant Health Assistant
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Describe observed plant symptoms for educational, non-toxic diagnostic guidance and physical check recommendations.
        </p>
      </div>

      {/* Diagnostic Input Form */}
      <div className="garden-card p-6 sm:p-8 space-y-6 bg-white border border-[#e8ebe4]">
        <h2 className="text-lg font-bold text-[#1b4332] border-b border-[#e8ebe4] pb-3">
          1. Plant & Symptom Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Plant Name *
            </label>
            <input
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="e.g. Holy Basil (Tulsi), Tomato, Pudina"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Duration of Symptoms
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            >
              <option value="1-2 days (Just noticed)">1-2 days (Just noticed)</option>
              <option value="3-5 days">3-5 days</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="More than 3 weeks">More than 3 weeks</option>
            </select>
          </div>
        </div>

        {/* Symptoms Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Observed Symptoms *
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {symptomPresets.map((sym) => {
              const active = selectedSymptoms.includes(sym);
              return (
                <button
                  key={sym}
                  type="button"
                  onClick={() => toggleSymptom(sym)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    active
                      ? 'bg-[#1b4332] text-white border-[#1b4332]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#2d6a4f]'
                  }`}
                >
                  {sym}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSymptom(); } }}
              placeholder="Type custom symptom and press Add (e.g., sticky sap on stems)..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            />
            <button
              type="button"
              onClick={addCustomSymptom}
              className="px-4 py-2 bg-[#2d6a4f] text-white text-xs font-semibold rounded-xl hover:bg-[#1b4332]"
            >
              Add
            </button>
          </div>
        </div>

        {/* Environmental Context */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 border-t border-[#f0f2ed]">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Watering Frequency
            </label>
            <input
              type="text"
              value={watering}
              onChange={(e) => setWatering(e.target.value)}
              placeholder="e.g. daily, twice a week"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Sunlight Exposure
            </label>
            <input
              type="text"
              value={sunlight}
              onChange={(e) => setSunlight(e.target.value)}
              placeholder="e.g. 4 hrs morning light"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Soil Moisture Level
            </label>
            <input
              type="text"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(e.target.value)}
              placeholder="e.g. wet, dry, crusty"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            />
          </div>
        </div>

        {/* Vision Limitation Transparency */}
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <p>
            <strong>Image Analysis Transparency:</strong> To maintain strict honesty without hallucinated vision claims, this assistant performs deep structured textual reasoning over your physical symptom observations. Do not upload uncertain images.
          </p>
        </div>

        {/* Submission & Demo Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#f0f2ed]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1b4332] text-white text-sm font-bold hover:bg-[#2d6a4f] disabled:opacity-50 transition-all shadow-md"
            >
              <Sparkles className={`w-4 h-4 text-[#74c69d] ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Evaluating with Gemma...' : 'Analyze Plant Health'}
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="text-xs font-medium text-[#52796f] hover:text-[#1b4332] underline"
            >
              Load Tulsi Demo Fixture
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={useSampleData}
              onChange={(e) => setUseSampleData(e.target.checked)}
              className="accent-[#2d6a4f]"
            />
            <span>Use Sample Demo Mode</span>
          </label>
        </div>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2">
          <p className="font-bold flex items-center gap-1.5 text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Assessment Error
          </p>
          <p className="font-mono text-[11px]">{error}</p>
          <p>Ensure Ollama is running or use the sample demo button above.</p>
        </div>
      )}

      {/* Diagnostic Result */}
      {result && !loading && (
        <div className="space-y-6">
          <div className="garden-card p-6 sm:p-8 bg-white border border-[#e8ebe4] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0f2ed] pb-4">
              <div>
                <h3 className="text-2xl font-bold text-[#1b4332]">
                  Health Assessment: {result.plant_name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Evaluated symptoms: {result.symptoms_evaluated.join(', ')}
                </p>
              </div>

              <span className="badge-gemma px-3 py-1 rounded-full text-xs font-semibold">
                Engine: {result.model_id} ({result.inference_mode})
              </span>
            </div>

            {/* Suspected Causes Ranked */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#1b4332] text-sm uppercase tracking-wider">
                Ranked Suspected Causes
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {result.possible_causes.map((c) => (
                  <div
                    key={c.rank}
                    className="p-4 rounded-xl border border-gray-200 bg-[#fbfbf7] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1b4332] text-sm">
                        #{c.rank}. {c.cause_name}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        c.likelihood === 'High'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        Likelihood: {c.likelihood}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed pt-1">
                      {c.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Distinguishing Questions */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
              <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" /> Distinguishing Questions to Ask Yourself
              </h4>
              <ul className="text-xs text-blue-950 space-y-1 list-disc list-inside">
                {result.distinguishing_questions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>

            {/* Low-Risk Physical Checks */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#1b4332] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#2d6a4f]" /> Gentle Physical Checks to Perform Now
              </h4>
              <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
                {result.low_risk_checks.map((chk, idx) => (
                  <li key={idx} className="leading-relaxed">{chk}</li>
                ))}
              </ul>
            </div>

            {/* Action Steps */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Safe Organic Action Steps
              </h4>
              <ul className="text-xs text-emerald-950 space-y-1.5 list-disc list-inside">
                {result.action_steps.map((act, idx) => (
                  <li key={idx} className="leading-relaxed">{act}</li>
                ))}
              </ul>
            </div>

            {/* When to Seek Expert & Warnings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span className="font-bold text-gray-800 block">When to Seek Expert Assistance:</span>
                <p className="text-gray-600 leading-relaxed">{result.when_to_seek_expert}</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                <span className="font-bold text-amber-900 block flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Safety & Non-Toxic Precautions:
                </span>
                <ul className="space-y-0.5 list-disc list-inside text-amber-950">
                  {result.safety_notes.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 italic pt-2 border-t border-[#f0f2ed]">
              {result.disclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
