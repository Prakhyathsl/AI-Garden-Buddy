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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1b4332] to-[#2d6a4f] text-white p-8 sm:p-14 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-[#40916c]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-[#74c69d]/10 blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-[#74c69d]">
            <Sparkles className="w-3.5 h-3.5" />
            Hacktoberfest 2026 — Best Use of Gemma
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Grow smarter. <br />
            Waste less. <br />
            <span className="text-[#74c69d]">Get outside.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#cad2c5] leading-relaxed max-w-2xl">
            A practical, privacy-conscious garden companion powered by Google&apos;s open-weight <strong>Gemma</strong> models.
            Personalized weekly planting schedules and diagnostic care designed to help you spend less time on screens and more time in nature.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#74c69d] text-[#132a22] font-semibold hover:bg-[#52b788] transition-all shadow-md hover:shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Create Garden Plan
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 backdrop-blur-sm transition-all"
            >
              <Sprout className="w-5 h-5 text-[#74c69d]" />
              Explore Dashboard
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-[#cad2c5]/80 border-t border-white/15">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#74c69d]" />
              <span>Google AI Studio or Local Ollama</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#dda15e]" />
              <span>Live Microclimate Weather Grounding</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#74c69d]" />
              <span>Private & Client-Side Stored</span>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy: Touch Grass */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="garden-card p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1b4332] flex items-center justify-center">
              <Compass className="w-6 h-6 text-[#2d6a4f]" />
            </div>
            <h3 className="text-xl font-bold text-[#1b4332]">Context-Aware Reasoning</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Not a generic chatbot. Gemma evaluates your exact balcony orientation, container depth, daily sunlight, and time budget before proposing a single seed.
            </p>
          </div>
          <div className="pt-4 text-xs font-semibold text-[#2d6a4f] flex items-center gap-1">
            <span>Tailored container math</span> →
          </div>
        </div>

        <div className="garden-card p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#bc6c25] flex items-center justify-center">
              <Leaf className="w-6 h-6 text-[#bc6c25]" />
            </div>
            <h3 className="text-xl font-bold text-[#1b4332]">Screen-Free Outdoor Missions</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every day features a dedicated &ldquo;Touch Grass&rdquo; prompt. Read the instructions in 30 seconds, put the phone down, and connect hands-on with your plants.
            </p>
          </div>
          <div className="pt-4 text-xs font-semibold text-[#bc6c25] flex items-center gap-1">
            <span>Spend time in nature</span> →
          </div>
        </div>

        <div className="garden-card p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-xl font-bold text-[#1b4332]">Open-Weight AI Control</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Transparent, auditable, and private. Powered by Google&apos;s Gemma 2 weights, running on your own hardware without lock-in or third-party data harvesting.
            </p>
          </div>
          <div className="pt-4 text-xs font-semibold text-blue-700 flex items-center gap-1">
            <span>Read open-weight rationale</span> →
          </div>
        </div>
      </section>

      {/* Spotlight: Real Balcony Example */}
      <section className="garden-card p-8 bg-[#ffffff] border border-[#e8ebe4]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f5e9] text-[#1b4332]">
              Realistic Example Profile
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1b4332]">
              Mangalore Coastal Balcony (40 sq ft)
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Designed around real tropical conditions: 4 hours of morning sun, high humidity, and 6 containers. 
              Gemma recommends companion planting Holy Basil (Tulsi), Spearmint (Pudina), and French Marigolds 
              to maximize flavor while discouraging balcony pests.
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
              className="px-5 py-3 rounded-xl bg-[#1b4332] text-white font-semibold hover:bg-[#2d6a4f] text-center text-sm transition-all"
            >
              Open Active Dashboard
            </Link>
            <Link
              href="/plants"
              className="px-5 py-3 rounded-xl bg-[#f4f4ea] text-[#1b4332] font-semibold hover:bg-[#e8ebe4] text-center text-sm transition-all"
            >
              Browse Botanical Library
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works 4 Steps */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold text-[#1b4332]">How AI Garden Buddy Works</h2>
          <p className="text-sm text-gray-600">
            A reliable 4-step workflow that pairs open-weight language reasoning with verified botanical science.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="garden-card p-6 space-y-3">
            <span className="w-8 h-8 rounded-full bg-[#1b4332] text-white font-bold text-sm flex items-center justify-center">
              1
            </span>
            <h4 className="font-bold text-[#1b4332]">Describe Space & Time</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Input your balcony size, container count, sunlight exposure, and daily minute budget. No account signup needed.
            </p>
          </div>

          <div className="garden-card p-6 space-y-3">
            <span className="w-8 h-8 rounded-full bg-[#2d6a4f] text-white font-bold text-sm flex items-center justify-center">
              2
            </span>
            <h4 className="font-bold text-[#1b4332]">Gemma Synthesizes Plan</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Google&apos;s Gemma 2 processes real weather, season, and constraints to produce structured 7-day actionable guidance.
            </p>
          </div>

          <div className="garden-card p-6 space-y-3">
            <span className="w-8 h-8 rounded-full bg-[#40916c] text-white font-bold text-sm flex items-center justify-center">
              3
            </span>
            <h4 className="font-bold text-[#1b4332]">Step Outside & Do</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Check off concise tasks, smell your herbs, inspect soil moisture, and leave the screen behind.
            </p>
          </div>

          <div className="garden-card p-6 space-y-3">
            <span className="w-8 h-8 rounded-full bg-[#bc6c25] text-white font-bold text-sm flex items-center justify-center">
              4
            </span>
            <h4 className="font-bold text-[#1b4332]">Care & Diagnose</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              If yellow leaves or pests appear, consult the Gemma Plant Doctor for non-chemical remedy options.
            </p>
          </div>
        </div>
      </section>

      {/* Quick CTAs */}
      <section className="bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <h3 className="text-2xl font-bold">Ready to get your hands in the soil?</h3>
          <p className="text-sm text-[#cad2c5]">
            Generate a personalized 7-day plan in seconds using open-weight Gemma intelligence.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/planner"
            className="px-6 py-3 rounded-xl bg-[#74c69d] text-[#132a22] font-bold text-sm hover:bg-[#52b788] transition-colors"
          >
            Launch Planner
          </Link>
          <Link
            href="/health"
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-colors"
          >
            Check Plant Health
          </Link>
        </div>
      </section>
    </div>
  );
}
