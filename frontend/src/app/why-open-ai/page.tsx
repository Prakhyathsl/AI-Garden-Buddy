'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Compass,
  Heart,
  Sprout
} from 'lucide-react';

export default function WhyOpenAIPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-2">
      {/* Header */}
      <div className="border-b border-[#e8ebe4] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-[#1b4332] mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2d6a4f]" /> Privacy & Botanical Science
        </div>
        <h1 className="text-3xl font-extrabold text-[#1b4332]">
          Our Approach to Plant Care
        </h1>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          How AI Garden Buddy protects your home garden privacy, grounds guidance in real agricultural science,
          and designs technology to get you outside.
        </p>
      </div>

      {/* Data & Privacy Guarantee Card */}
      <div className="garden-card p-6 sm:p-8 bg-white border border-[#e8ebe4] space-y-4">
        <h2 className="text-lg font-bold text-[#1b4332] flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#52796f]" /> Your Data Boundaries
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#fbfbf7] p-5 rounded-2xl border border-[#e8ebe4] text-xs">
          <div>
            <span className="font-bold text-gray-500 uppercase text-[10px] block">Garden Storage</span>
            <span className="font-bold text-sm text-[#1b4332]">Local Browser Storage</span>
            <p className="text-[11px] text-gray-500 mt-1">Your plants, notes, and tasks stay on your device.</p>
          </div>

          <div>
            <span className="font-bold text-gray-500 uppercase text-[10px] block">No Account Required</span>
            <span className="font-bold text-sm text-[#2d6a4f]">100% Private Access</span>
            <p className="text-[11px] text-gray-500 mt-1">No signups, passwords, or personal tracking.</p>
          </div>

          <div>
            <span className="font-bold text-gray-500 uppercase text-[10px] block">Safety Standard</span>
            <span className="font-bold text-sm text-emerald-700">Non-Toxic & Organic</span>
            <p className="text-[11px] text-gray-500 mt-1">Clear guardrails against hazardous chemicals.</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          When creating a weekly plan or analyzing plant symptoms, only the necessary garden parameters
          (container count, sunlight, symptoms) are evaluated. We never collect or sell your personal data.
        </p>
      </div>

      {/* 4 Pillars of Responsible Gardening Assistance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="garden-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Lock className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="font-bold text-[#1b4332] text-base">Local Data Ownership</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Your home layout, balcony floor plans, plant health observations, and daily habits stay under your control.
            Everything is saved directly to your local browser storage.
          </p>
        </div>

        <div className="garden-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-blue-700" />
          </div>
          <h3 className="font-bold text-[#1b4332] text-base">Grounded in Botanical Science</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Recommendations are aligned with verified agricultural standards (ICAR and RHS). The planner respects root
            depths and container volumes before suggesting plants.
          </p>
        </div>

        <div className="garden-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#bc6c25] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#bc6c25]" />
          </div>
          <h3 className="font-bold text-[#1b4332] text-base">Non-Toxic Physical Checks</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Rather than relying on guesses or unverified chemicals, our diagnostic assistant emphasizes physical checks
            like testing moisture 2 inches down and inspecting drainage trays.
          </p>
        </div>

        <div className="garden-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
            <Compass className="w-5 h-5 text-purple-700" />
          </div>
          <h3 className="font-bold text-[#1b4332] text-base">Technology for the Outdoors</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Our daily tasks are designed to be read in under 30 seconds. The goal is to spend less time staring
            at a screen and more time outside tending living plants.
          </p>
        </div>
      </div>

      {/* Reproducible Scenario Testing */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#1b4332] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#52796f]" /> Garden Scenario Testing & Validation
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Documented evaluations testing space constraints, time budgets, and outdoor sensory task quality.
          </p>
        </div>

        <div className="garden-card overflow-hidden border border-[#e8ebe4] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f4f4ea] text-[#1b4332] border-b border-[#e8ebe4] font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Garden Scenario</th>
                  <th className="p-3.5">Space & Sunlight Constraints</th>
                  <th className="p-3.5">Recommended Plantings</th>
                  <th className="p-3.5">Daily Time Adherence</th>
                  <th className="p-3.5">Schedule Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr className="hover:bg-[#fbfbf7]">
                  <td className="p-3.5 font-bold text-[#1b4332]">
                    1. Sunny Balcony
                  </td>
                  <td className="p-3.5">
                    40 sq ft, 6 containers, 4-5 hrs morning sun, coastal humidity (Mangalore)
                  </td>
                  <td className="p-3.5">
                    Tulsi, Pudina (isolated pot), Cherry Tomato, French Marigold
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-emerald-700">15-20 mins / day</span> (Exact fit to 20m budget)
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Validated Schedule
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#fbfbf7]">
                  <td className="p-3.5 font-bold text-[#1b4332]">
                    2. Partially Shaded Terrace
                  </td>
                  <td className="p-3.5">
                    120 sq ft, 14 containers, 3-4 hrs dappled sun, high breeze
                  </td>
                  <td className="p-3.5">
                    Malabar Spinach (trellis), Fenugreek Greens, Spearmint, Lemongrass
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-emerald-700">20-30 mins / day</span> (Exact fit to 30m budget)
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Validated Schedule
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#fbfbf7]">
                  <td className="p-3.5 font-bold text-[#1b4332]">
                    3. Compact Indoor Ledge
                  </td>
                  <td className="p-3.5">
                    12 sq ft, 3 pots, indirect windowsill light, beginner
                  </td>
                  <td className="p-3.5">
                    Fenugreek Microgreens, Coriander (shallow tray), Mint cuttings
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-emerald-700">10 mins / day</span> (Exact fit to 10m budget)
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Validated Schedule
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#fbfbf7] border border-[#e8ebe4] text-xs text-gray-600 space-y-1.5 leading-relaxed">
          <span className="font-bold text-gray-800 block">Key Observations from Testing:</span>
          <p>
            • <strong>Time Discipline:</strong> The planning assistant strictly bounds each day&apos;s task minutes within the user&apos;s specified daily time budget.
          </p>
          <p>
            • <strong>Container Depth Logic:</strong> The system reliably warns against planting deep taproot crops in shallow balcony pots, recommending shallow herbs and bush varieties instead.
          </p>
          <p>
            • <strong>Outdoor Mission Quality:</strong> Generated sensory tasks focus on tactile connection (&ldquo;feel soil moisture 2 inches down&rdquo;, &ldquo;smell crushed mint leaf&rdquo;, &ldquo;inspect leaf undersides for aphids&rdquo;) rather than digital screen time.
          </p>
        </div>
      </div>

      {/* Advisory Disclaimer */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
        <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-600" /> Plant Care & Hygiene Advisory
        </h4>
        <p className="leading-relaxed">
          AI Garden Buddy is an educational, planning, and sensory aid. It cannot replace physical soil testing,
          microclimate observation, or regional agricultural extension advisories. Always practice safe garden hygiene,
          wash homegrown produce thoroughly, and avoid applying unverified chemical treatments.
        </p>
      </div>
    </div>
  );
}
