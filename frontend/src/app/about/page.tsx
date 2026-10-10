import React from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  Sparkles, 
  Code, 
  ShieldCheck, 
  ExternalLink, 
  Heart, 
  FileCheck, 
  Terminal,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-2">
      {/* Header */}
      <div className="border-b border-[#e8ebe4] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-[#1b4332] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" /> Hacktoberfest 2026 Week 1 Submission
        </div>
        <h1 className="text-3xl font-extrabold text-[#1b4332]">
          About AI Garden Buddy
        </h1>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          Open-Source AI Challenge Week 1: Targeting the <strong>Best Use of Gemma</strong> partner category.
        </p>
      </div>

      {/* Project Vision & Story */}
      <div className="garden-card p-6 sm:p-8 bg-white border border-[#e8ebe4] space-y-4">
        <h2 className="text-xl font-bold text-[#1b4332]">
          The &ldquo;Touch Grass&rdquo; Philosophy
        </h2>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          Most modern gardening and plant care apps trap users in lengthy chat sessions, endless photo uploads, 
          and invasive push notifications. AI Garden Buddy takes the opposite approach: 
          <strong> Grow smarter. Waste less. Get outside.</strong>
        </p>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          Using Google&apos;s open-weight <strong>Gemma 2</strong> model, our engine takes your spatial constraints 
          (containers, balcony orientation, morning sun hours, daily time budget) and produces concise, structured 
          instructions paired with daily outdoor missions. You spend 30 seconds reading your daily task, 
          leave your phone indoors, and step out onto your balcony or garden to touch real soil, smell fresh herbs, 
          and watch pollinators.
        </p>
      </div>

      {/* Architecture Overview */}
      <div className="garden-card p-6 sm:p-8 bg-white border border-[#e8ebe4] space-y-4">
        <h2 className="text-xl font-bold text-[#1b4332] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#52796f]" /> Monorepo Technical Architecture
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
          <div className="p-4 rounded-xl bg-[#fbfbf7] border border-[#e8ebe4] space-y-2">
            <span className="font-bold text-[#1b4332] text-sm block">Frontend Layer</span>
            <ul className="space-y-1 text-gray-600">
              <li>• <strong>Framework:</strong> Next.js 16 (App Router)</li>
              <li>• <strong>Language:</strong> TypeScript</li>
              <li>• <strong>Styling:</strong> Tailwind CSS with curated botanical palette</li>
              <li>• <strong>Icons:</strong> Lucide React</li>
              <li>• <strong>Persistence:</strong> Safe client-side localStorage</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#fbfbf7] border border-[#e8ebe4] space-y-2">
            <span className="font-bold text-[#1b4332] text-sm block">Backend & AI Layer</span>
            <ul className="space-y-1 text-gray-600">
              <li>• <strong>API:</strong> Python FastAPI + Uvicorn</li>
              <li>• <strong>Validation:</strong> Pydantic v2 schemas</li>
              <li>• <strong>AI Engine:</strong> Google Gemma 2 (Ollama / Groq / OpenRouter)</li>
              <li>• <strong>Weather:</strong> Open-Meteo Geocoding & Forecast API</li>
              <li>• <strong>Testing:</strong> pytest + pytest-asyncio (100% passing)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Open Source Deliverables */}
      <div className="garden-card p-6 sm:p-8 bg-white border border-[#e8ebe4] space-y-4">
        <h2 className="text-xl font-bold text-[#1b4332] flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-[#2d6a4f]" /> Open Source Deliverables & Standards
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between">
            <span className="font-medium text-gray-800">📄 Open Source License</span>
            <span className="font-bold text-emerald-700">MIT Verified</span>
          </div>

          <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between">
            <span className="font-medium text-gray-800">🤝 Contributing Guidelines</span>
            <span className="font-bold text-emerald-700">CONTRIBUTING.md</span>
          </div>

          <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between">
            <span className="font-medium text-gray-800">🛡️ Security Reporting</span>
            <span className="font-bold text-emerald-700">SECURITY.md</span>
          </div>

          <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between">
            <span className="font-medium text-gray-800">📜 Code of Conduct</span>
            <span className="font-bold text-emerald-700">Contributor Covenant</span>
          </div>

          <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between">
            <span className="font-medium text-gray-800">🧪 Automated Tests</span>
            <span className="font-bold text-emerald-700">12 Unit Tests Passing</span>
          </div>

          <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between">
            <span className="font-medium text-gray-800">🤖 Continuous Integration</span>
            <span className="font-bold text-emerald-700">GitHub Actions CI</span>
          </div>
        </div>
      </div>

      {/* Quick Launch CTA */}
      <div className="bg-[#1b4332] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-lg">Experience AI Garden Buddy Today</h3>
          <p className="text-xs text-[#cad2c5]">
            Generate your personalized 7-day garden schedule or test offline demo fixtures.
          </p>
        </div>
        <Link
          href="/planner"
          className="px-5 py-2.5 rounded-xl bg-[#74c69d] text-[#132a22] font-bold text-xs hover:bg-[#52b788] transition-colors shrink-0"
        >
          Launch Garden Planner →
        </Link>
      </div>
    </div>
  );
}
