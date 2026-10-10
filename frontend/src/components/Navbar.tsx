'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sprout, 
  Calendar, 
  BookOpen, 
  CheckSquare, 
  Stethoscope, 
  Sparkles, 
  Settings, 
  ShieldCheck, 
  Menu, 
  X,
  Cpu
} from 'lucide-react';
import { fetchSystemHealth, SystemHealth } from '../lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    fetchSystemHealth().then(setHealth).catch(() => {});
  }, []);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Sprout },
    { href: '/planner', label: 'AI Planner', icon: Sparkles },
    { href: '/plants', label: 'Plants', icon: BookOpen },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare },
    { href: '/health', label: 'Plant Health', icon: Stethoscope },
    { href: '/journal', label: 'Journal', icon: Calendar },
    { href: '/why-open-ai', label: 'Why Open AI', icon: Cpu },
    { href: '/profile', label: 'Profile', icon: Settings },
  ];

  const getInferenceBadge = () => {
    if (!health) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Connecting AI...
        </span>
      );
    }
    const mode = health.ai_engine.inference_mode;
    if (mode === 'ollama_local') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200" title="Private local inference via Ollama">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Gemma (Local Ollama)
        </span>
      );
    } else if (mode.includes('api')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200" title={`Inference via ${mode}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          {health.ai_engine.active_model}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-300" title="Offline demo fixture active">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
          Sample Demo Mode
        </span>
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fbfbf7]/90 backdrop-blur-md border-b border-[#e8ebe4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-white flex items-center justify-center shadow-sm group-hover:bg-[#2d6a4f] transition-colors">
                <Sprout className="w-6 h-6 text-[#74c69d]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-[#1b4332] leading-none">
                  AI Garden Buddy
                </span>
                <span className="text-[11px] font-medium text-[#52796f] tracking-wide mt-0.5">
                  Touch Grass & Grow
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1b4332] text-white shadow-sm'
                      : 'text-[#2d6a4f] hover:bg-[#e8ebe4]/60 hover:text-[#1b4332]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#74c69d]' : 'text-[#52796f]'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Inference Mode Badge & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {getInferenceBadge()}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            {getInferenceBadge()}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1b4332] hover:bg-[#e8ebe4] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#e8ebe4] bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-[#1b4332] text-white'
                    : 'text-[#2d6a4f] hover:bg-[#f4f4ea]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#74c69d]' : 'text-[#52796f]'}`} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
