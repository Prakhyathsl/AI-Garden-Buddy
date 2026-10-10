import React from 'react';
import Link from 'next/link';
import { Sprout, Heart, Shield, Code, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1b4332] text-[#cad2c5] border-t border-[#2d6a4f] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Mission */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2d6a4f] flex items-center justify-center">
                <Sprout className="w-5 h-5 text-[#74c69d]" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">AI Garden Buddy</span>
            </div>
            <p className="text-sm text-[#cad2c5]/80 max-w-md leading-relaxed">
              <strong>Grow smarter. Waste less. Get outside.</strong> A privacy-first, open-weight gardening assistant built for 
              Hacktoberfest 2026 Week 1, powered by Google's open-weight Gemma 2 model.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#cad2c5]/70 pt-2">
              <Shield className="w-4 h-4 text-[#74c69d]" />
              <span>Zero telemetry. Local inference supported. Your garden data stays on your machine.</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/planner" className="hover:text-white transition-colors">
                  AI Weekly Planner
                </Link>
              </li>
              <li>
                <Link href="/plants" className="hover:text-white transition-colors">
                  Curated Plant Library
                </Link>
              </li>
              <li>
                <Link href="/health" className="hover:text-white transition-colors">
                  Plant Health Assistant
                </Link>
              </li>
              <li>
                <Link href="/tasks" className="hover:text-white transition-colors">
                  Outdoor Task Calendar
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-white transition-colors">
                  Garden Journal & Eco
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Open Source & Hackathon */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Open AI Rationale</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/why-open-ai" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Why Open AI?
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Hacktoberfest 2026
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/google-deepmind/gemma" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-colors inline-flex items-center gap-1 text-xs text-[#74c69d]"
                >
                  Google Gemma Model <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-xs text-[#84a98c]">Open Source under MIT License</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2d6a4f]/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#84a98c]">
          <p>© 2026 AI Garden Buddy. Crafted with open-weight Gemma for gardeners everywhere.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            <span>Remember to Touch Grass today! 🌿</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
