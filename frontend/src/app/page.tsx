import React from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  Calendar, 
  Compass, 
  Sun, 
  Droplet, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Leaf, 
  Eye, 
  HeartHandshake,
  Cpu
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="rounded-3xl bg-[#1b4332] text-white p-8 sm:p-14 shadow-lg border border-[#2d6a4f]/40">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-[#74c69d]">
            <Sparkles className="w-3.5 h-3.5" />
            Hacktoberfest 2026 — Best Use of Gemma
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Grow smarter. <br />
            Waste less. <br />
            <span className="text-[#74c69d]">Get outside.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#cad2c5] leading-relaxed max-w-2xl font-light">
            A practical, privacy-conscious garden companion powered by Google&apos;s open-weight <strong>Gemma</strong> models.
            Personalized weekly planting schedules and diagnostic care designed to help you spend less time on screens and more time in nature.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#74c69d] text-[#132a22] font-semibold hover:bg-[#52b788] transition-all shadow-sm"
            >
              <Sparkles className="w-5 h-5" />
              Plan my week
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-all"
            >
              <Sprout className="w-5 h-5 text-[#74c69d]" />
              Explore sample balcony
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-[#cad2c5]/80 border-t border-white/15">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#74c69d]" />
              <span>Google AI Studio or local Ollama</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#dda15e]" />
              <span>Live weather & microclimate context</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#74c69d]" />
              <span>Private & client-side stored</span>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy: Touch Grass */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="garden-card p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8f5e9] text-[#1b4332] flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#2d6a4f]" />
            </div>
            <h3 className="text-lg font-bold text-[#1b4332]">Context-Aware Reasoning</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Gemma evaluates your specific balcony orientation, container depth, daily sunlight, and time budget before proposing a single seed.
            </p>
          </div>
          <div className="pt-4 text-xs font-semibold text-[#2d6a4f]">
            Tailored container mathematics
          </div>
        </div>

        <div className="garden-card p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#fefae0] text-[#bc6c25] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-[#bc6c25]" />
            </div>
            <h3 className="text-lg font-bold text-[#1b4332]">Screen-Free Outdoor Missions</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every day features a dedicated &ldquo;Touch Grass&rdquo; activity. Review the instructions in 30 seconds, step outside, and connect with living plants.
            </p>
          </div>
          <div className="pt-4 text-xs font-semibold text-[#bc6c25]">
            Mindful connection with nature
          </div>
        </div>

        <div className="garden-card p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0f4f8] text-[#1e3a8a] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#1e3a8a]" />
            </div>
            <h3 className="text-lg font-bold text-[#1b4332]">Open-Weight AI Control</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Auditable and private. Powered by Google&apos;s Gemma weights, running locally or on cloud endpoints without proprietary lock-in.
            </p>
          </div>
          <div className="pt-4 text-xs font-semibold text-[#1e3a8a]">
            Transparent & reproducible
          </div>
        </div>
      </section>

      {/* Spotlight: Real Balcony Example */}
      <section className="garden-card p-8 bg-[#ffffff] border border-[#e8ebe4]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f5e9] text-[#1b4332]">
              Example Garden Profile
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1b4332]">
              Mangalore Coastal Balcony (40 sq ft)
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Calibrated for tropical maritime conditions: 4 hours of morning sun, high humidity, and 6 containers. 
              Gemma proposes companion planting Holy Basil (Tulsi), Spearmint (Pudina), and French Marigolds 
              to balance culinary yield with natural pest resistance.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="badge-tag px-3 py-1 rounded-lg text-xs font-medium">East-facing Balcony</span>
              <span className="badge-tag px-3 py-1 rounded-lg text-xs font-medium">20 mins / day</span>
              <span className="badge-tag px-3 py-1 rounded-lg text-xs font-medium">Container Friendly</span>
              <span className="badge-tag px-3 py-1 rounded-lg text-xs font-medium">Organic & Non-Toxic</span>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-3 rounded-xl bg-[#1b4332] text-white font-semibold hover:bg-[#2d6a4f] text-center text-sm transition-all shadow-sm"
            >
              Open Active Dashboard
            </Link>
            <Link
              href="/plants"
              className="px-5 py-3 rounded-xl bg-[#f4f4ea] text-[#1b4332] font-semibold hover:bg-[#e8ebe4] text-center text-sm transition-all"
            >
              Browse Plant Library
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works 4 Steps */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold text-[#1b4332]">How AI Garden Buddy Works</h2>
          <p className="text-sm text-gray-600">
            A reliable 4-step workflow pairing open-weight language reasoning with verified botanical science.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="garden-card p-6 space-y-3">
            <span className="w-8 h-8 rounded-full bg-[#1b4332] text-white font-bold text-sm flex items-center justify-center">
              1
            </span>
            <h4 className="font-bold text-[#1b4332]">Define Space & Time</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Specify container count, sunlight hours, and daily time budget. No account signup needed.
            </p>
          </div>

          <div className="garden-card p-6 space-y-3">
            <span className="w-8 h-8 rounded-full bg-[#2d6a4f] text-white font-bold text-sm flex items-center justify-center">
              2
            </span>
            <h4 className="font-bold text-[#1b4332]">Gemma Synthesizes Plan</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Gemma analyzes weather forecasts, seasons, and microclimates into a structured 7-day plan.
            </p>
          </div>

          <div className="garden-card p-6 space-y-3">
            <span className="w-8 h-8 rounded-full bg-[#40916c] text-white font-bold text-sm flex items-center justify-center">
              3
            </span>
            <h4 className="font-bold text-[#1b4332]">Step Outside & Practice</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Review concise steps, inspect soil moisture, tend your plants, and put screens aside.
            </p>
          </div>

          <div className="garden-card p-6 space-y-3">
            <span className="w-8 h-8 rounded-full bg-[#bc6c25] text-white font-bold text-sm flex items-center justify-center">
              4
            </span>
            <h4 className="font-bold text-[#1b4332]">Observe & Diagnose</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              If yellow leaves or pests appear, consult the diagnostic assistant for organic checks.
            </p>
          </div>
        </div>
      </section>

      {/* Quick CTAs */}
      <section className="bg-[#1b4332] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-[#2d6a4f]/40">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-2xl font-bold">Ready to get started?</h3>
          <p className="text-sm text-[#cad2c5]">
            Generate a personalized 7-day plan in seconds using open-weight Gemma intelligence.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/planner"
            className="px-6 py-3 rounded-xl bg-[#74c69d] text-[#132a22] font-bold text-sm hover:bg-[#52b788] transition-colors shadow-sm"
          >
            Plan my week
          </Link>
          <Link
            href="/health"
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-colors"
          >
            Check plant health
          </Link>
        </div>
      </section>
    </div>
  );
}
