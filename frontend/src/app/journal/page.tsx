'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  PenTool, 
  Leaf, 
  Droplet, 
  Recycle, 
  Heart, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2,
  Sparkles,
  Info,
  Sprout
} from 'lucide-react';
import { loadJournalEntries, saveJournalEntries } from '@/lib/storage';
import { JournalEntry } from '@/types';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [plantName, setPlantName] = useState('');
  const [category, setCategory] = useState<JournalEntry['category']>('Observation');
  const [notes, setNotes] = useState('');
  const [outdoorMins, setOutdoorMins] = useState(15);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setEntries(loadJournalEntries());
  }, []);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      plant_name: plantName.trim() || undefined,
      category,
      notes: notes.trim(),
      outdoor_minutes: outdoorMins
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveJournalEntries(updated);

    setNotes('');
    setPlantName('');
    setShowAddForm(false);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    saveJournalEntries(updated);
  };

  const totalOutdoorLogged = entries.reduce((acc, e) => acc + (e.outdoor_minutes || 0), 0);

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8ebe4] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1b4332] flex items-center gap-2">
            <Calendar className="w-8 h-8 text-[#52796f]" /> Garden Journal & Sustainability
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track real plant growth, screen-free outdoor minutes, and low-waste gardening routines.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f] shadow-sm self-start md:self-auto transition-all"
        >
          <Plus className="w-4 h-4 text-[#74c69d]" /> New Journal Entry
        </button>
      </div>

      {/* Sustainable Gardening Practical Guide */}
      <div className="garden-card p-6 sm:p-8 bg-white border border-[#e8ebe4] space-y-4">
        <div className="flex items-center gap-2">
          <Recycle className="w-5 h-5 text-[#2d6a4f]" />
          <h2 className="text-lg font-bold text-[#1b4332]">
            Evidence-Based Urban Sustainability Principles
          </h2>
        </div>
        <p className="text-xs text-gray-600">
          Practical conservation habits tailored to small container and balcony gardens:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#fbfbf7] border border-[#e8ebe4] space-y-1.5">
            <span className="font-bold text-xs text-[#1b4332] flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-[#52796f]" /> Targeted Root Watering
            </span>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Water at soil base during early morning hours to prevent evaporation loss and deter evening fungal growth.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#fbfbf7] border border-[#e8ebe4] space-y-1.5">
            <span className="font-bold text-xs text-[#1b4332] flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-[#52796f]" /> Kitchen Scrap Compost
            </span>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Turn coffee grounds, tea leaves, and vegetable peelings into aerated vermicompost instead of sending organics to landfills.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#fbfbf7] border border-[#e8ebe4] space-y-1.5">
            <span className="font-bold text-xs text-[#1b4332] flex items-center gap-1.5">
              <Recycle className="w-3.5 h-3.5 text-[#52796f]" /> Reused Containers
            </span>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Drill drainage holes in sturdy food-grade buckets, tin boxes, or coconut shells for eco-friendly starter pots.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#fbfbf7] border border-[#e8ebe4] space-y-1.5">
            <span className="font-bold text-xs text-[#1b4332] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#52796f]" /> Pollinator Support
            </span>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Add nectar-rich marigolds and shallow water dishes with pebbles to give solitary bees safe balcony hydration.
            </p>
          </div>
        </div>
      </div>

      {/* New Journal Entry Form */}
      {showAddForm && (
        <form onSubmit={handleAddEntry} className="garden-card p-6 bg-white border border-[#2d6a4f] space-y-4 animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-[#1b4332] flex items-center gap-2">
            <PenTool className="w-4 h-4 text-[#52796f]" /> Log Garden Observation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
              >
                <option value="Observation">Visual Observation</option>
                <option value="Watering">Watering & Care</option>
                <option value="Harvest">Harvest Milestone</option>
                <option value="Pest Check">Pest / Health Inspection</option>
                <option value="Composting">Soil / Compost Event</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Plant Name (Optional)
              </label>
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="e.g. Cherry Tomato, Holy Basil"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Outdoor Time (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={outdoorMins}
                onChange={(e) => setOutdoorMins(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Notes & Reflections *
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you observe today? Describe leaf vigor, soil moisture, fragrance, or growth changes..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f]"
            >
              Save Entry
            </button>
          </div>
        </form>
      )}

      {/* Journal Entries List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1b4332]">Recorded Observations</h2>
          <span className="text-xs font-semibold text-[#52796f]">
            {totalOutdoorLogged} Total Screen-Free Minutes Logged
          </span>
        </div>

        {entries.length === 0 ? (
          <div className="garden-card p-10 text-center text-gray-500 text-xs">
            No entries recorded yet. Click &apos;New Journal Entry&apos; to log your outdoor observations!
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="garden-card p-5 bg-white border border-[#e8ebe4] flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f5e9] text-[#1b4332]">
                      {entry.category}
                    </span>
                    {entry.plant_name && (
                      <span className="text-xs font-bold text-gray-800">
                        • {entry.plant_name}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      • {entry.date}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed">
                    {entry.notes}
                  </p>

                  <div className="text-[11px] text-gray-500 flex items-center gap-1 pt-1">
                    <Clock className="w-3 h-3 text-[#52796f]" />
                    <span>{entry.outdoor_minutes} mins spent outdoors</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
