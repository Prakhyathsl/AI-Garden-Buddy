'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Check, 
  X, 
  Sun, 
  Droplet, 
  AlertTriangle, 
  ExternalLink,
  ShieldAlert,
  Sprout
} from 'lucide-react';
import { fetchPlants } from '@/lib/api';
import { loadMyPlants, saveMyPlants } from '@/lib/storage';
import { PlantRecord } from '@/types';

export default function PlantsPage() {
  const [plants, setPlants] = useState<PlantRecord[]>([]);
  const [myPlantIds, setMyPlantIds] = useState<string[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantRecord | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [containerOnly, setContainerOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMyPlantIds(loadMyPlants());
    loadPlants();
  }, []);

  const loadPlants = () => {
    setLoading(true);
    fetchPlants({
      query: query || undefined,
      category: category || undefined,
      difficulty: difficulty || undefined,
      container_only: containerOnly || undefined
    })
      .then((data) => {
        setPlants(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPlants();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, category, difficulty, containerOnly]);

  const toggleMyPlant = (id: string) => {
    let updated: string[];
    if (myPlantIds.includes(id)) {
      updated = myPlantIds.filter(pId => pId !== id);
    } else {
      updated = [...myPlantIds, id];
    }
    setMyPlantIds(updated);
    saveMyPlants(updated);
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8ebe4] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1b4332] flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-[#52796f]" /> Plant Library & Garden Collection
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Curated botanical knowledge grounded in ICAR and RHS agricultural standards.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#e8f5e9] text-[#1b4332] border border-[#c8e6c9] self-start md:self-auto">
          🪴 {myPlantIds.length} Plants in Your Garden
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="garden-card p-5 bg-white border border-[#e8ebe4] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by common name or botanical name (e.g., Tulsi, Mint, Solanum)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            >
              <option value="">All Categories</option>
              <option value="Herb">Herbs</option>
              <option value="Vegetable">Vegetables</option>
              <option value="Flower">Flowers</option>
            </select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
            </select>

            <button
              type="button"
              onClick={() => setContainerOnly(!containerOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                containerOnly
                  ? 'bg-[#1b4332] text-white border-[#1b4332]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#2d6a4f]'
              }`}
            >
              🪴 Container Friendly Only
            </button>
          </div>
        </div>
      </div>

      {/* Plant Grid */}
      {loading ? (
        <div className="text-center py-12 text-sm text-gray-500 animate-pulse">
          Loading botanical database...
        </div>
      ) : plants.length === 0 ? (
        <div className="garden-card p-12 text-center text-gray-500 space-y-2">
          <p className="font-bold text-base text-gray-700">No plants match your filter criteria.</p>
          <p className="text-xs">Try clearing some filters or searching for &apos;Tulsi&apos; or &apos;Mint&apos;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => {
            const inGarden = myPlantIds.includes(plant.id);
            return (
              <div
                key={plant.id}
                className="garden-card p-5 space-y-4 flex flex-col justify-between hover:border-[#84a98c] transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-[#1b4332]">{plant.common_name}</h3>
                      <p className="text-xs italic text-[#52796f]">{plant.scientific_name}</p>
                    </div>
                    <span className="badge-tag px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0">
                      {plant.category}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {plant.planting_summary}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#f0f2ed]">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-[#dda15e]" /> {plant.sunlight_requirement.split(' ')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5 text-blue-500" /> {plant.watering_needs}
                    </span>
                    <span className="font-medium text-gray-700">
                      Level: {plant.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setSelectedPlant(plant)}
                      className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-[#f4f4ea] text-[#1b4332] hover:bg-[#e8ebe4] transition-colors text-center"
                    >
                      Care Details
                    </button>

                    <button
                      onClick={() => toggleMyPlant(plant.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                        inGarden
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#1b4332] text-white hover:bg-[#2d6a4f]'
                      }`}
                      title={inGarden ? 'Remove from My Garden' : 'Add to My Garden'}
                    >
                      {inGarden ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Plant Detail Drawer/Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-[#e8ebe4]">
            <div className="flex items-start justify-between border-b border-[#e8ebe4] pb-4">
              <div>
                <span className="badge-tag px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  {selectedPlant.category}
                </span>
                <h2 className="text-2xl font-bold text-[#1b4332] mt-1">{selectedPlant.common_name}</h2>
                <p className="text-xs italic text-[#52796f]">{selectedPlant.scientific_name}</p>
              </div>

              <button
                onClick={() => setSelectedPlant(null)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fbfbf7] p-4 rounded-xl border border-[#e8ebe4]">
                <div>
                  <span className="font-bold text-gray-500 block uppercase text-[10px]">Sunlight</span>
                  <span className="font-semibold text-[#1b4332]">{selectedPlant.sunlight_requirement}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-500 block uppercase text-[10px]">Water</span>
                  <span className="font-semibold text-[#1b4332]">{selectedPlant.watering_needs}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-500 block uppercase text-[10px]">Container Depth</span>
                  <span className="font-semibold text-[#1b4332]">{selectedPlant.container_depth_inches}&quot; pot minimum</span>
                </div>
                <div>
                  <span className="font-bold text-gray-500 block uppercase text-[10px]">Growth Cycle</span>
                  <span className="font-semibold text-[#1b4332]">{selectedPlant.growing_period_days}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#1b4332] text-sm mb-1">🌱 Planting & Germination</h4>
                <p>{selectedPlant.planting_summary}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#1b4332] text-sm mb-1">✂️ Harvesting Guidance</h4>
                <p>{selectedPlant.harvesting_summary}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#1b4332] text-sm mb-1">🪴 Ideal Soil Composition</h4>
                <p>{selectedPlant.suitable_soil}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                  <h5 className="font-bold text-amber-900 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Common Problems
                  </h5>
                  <ul className="list-disc list-inside space-y-0.5 text-amber-950">
                    {selectedPlant.common_problems.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <h5 className="font-bold text-emerald-900 mb-1 flex items-center gap-1">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600" /> Preventive Care
                  </h5>
                  <ul className="list-disc list-inside space-y-0.5 text-emerald-950">
                    {selectedPlant.preventive_care.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedPlant.caution_or_toxicity_notes && (
                <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700">
                  <span className="font-bold block text-stone-900 mb-0.5">⚠️ Caution / Pet Notes:</span>
                  <p>{selectedPlant.caution_or_toxicity_notes}</p>
                </div>
              )}

              <div className="pt-2 border-t border-[#f0f2ed] flex items-center justify-between text-[11px] text-gray-500">
                <span>Verified Sources: {selectedPlant.horticultural_sources.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => toggleMyPlant(selectedPlant.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  myPlantIds.includes(selectedPlant.id)
                    ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    : 'bg-[#1b4332] text-white hover:bg-[#2d6a4f]'
                }`}
              >
                {myPlantIds.includes(selectedPlant.id) ? 'Remove from My Garden' : 'Add to My Garden'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
