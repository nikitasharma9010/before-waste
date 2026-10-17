import React, { useState } from 'react';
import {
  ECOLOGICAL_FOOTPRINT_DATA,
  FOOTPRINT_EXPLAINER,
  CountryFootprint
} from '../data/ecologicalFootprintData';
import { Globe, Info, HelpCircle, Layers, ArrowUpRight } from 'lucide-react';

export const OnePlanetDemands: React.FC = () => {
  const [selectedCountryId, setSelectedCountryId] = useState<string>('world');

  const selectedCountry: CountryFootprint =
    ECOLOGICAL_FOOTPRINT_DATA.find((c) => c.id === selectedCountryId) ||
    ECOLOGICAL_FOOTPRINT_DATA[3]; // default world average

  return (
    <section id="one-planet" className="py-16 lg:py-24 bg-[#FFF9F0] border-b border-[#202A35]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#425BFF] mb-2">
            <span>A MOMENT OF WONDER</span>
            <span aria-hidden="true">·</span>
            <span>ECOLOGICAL BIOCAPACITY</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#202A35] font-normal leading-tight text-balance">
            {FOOTPRINT_EXPLAINER.headline}
          </h2>
          <p className="mt-3 text-lg text-[#202A35]/80 font-normal leading-relaxed">
            {FOOTPRINT_EXPLAINER.definition}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="bg-white rounded-3xl border border-[#202A35]/10 p-6 sm:p-8 lg:p-10 shadow-sm">
          {/* Country Selection Chips */}
          <div className="mb-8">
            <span className="text-xs font-semibold text-[#202A35]/60 uppercase tracking-wider block mb-3">
              Explore national per-capita demands (Global Footprint Network, 2024 Edition):
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {ECOLOGICAL_FOOTPRINT_DATA.map((item) => {
                const isSelected = item.id === selectedCountryId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCountryId(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#425BFF] text-white shadow-xs'
                        : 'bg-[#FFF9F0] text-[#202A35]/80 hover:bg-[#202A35]/5 border border-[#202A35]/10'
                    }`}
                  >
                    <span>{item.country}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-mono tabular-nums ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-[#202A35]/70'
                      }`}
                    >
                      {item.earths.toFixed(1)} Earths
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Comparison Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-8">
            {/* Visual Earths Ratio Graphic (Col 1 to 6) */}
            <div className="lg:col-span-6 bg-[#FFF9F0] p-6 sm:p-8 rounded-2xl border border-[#202A35]/8 text-center space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#202A35]/10 text-xs font-semibold text-[#202A35]">
                <Globe className="w-3.5 h-3.5 text-[#425BFF]" />
                <span>Demand Comparison Ratio</span>
              </div>

              {/* Planet Multiplier Graphic */}
              <div className="flex flex-wrap items-center justify-center gap-3 py-4 min-h-[140px]">
                {/* Full planet icons */}
                {Array.from({ length: Math.floor(selectedCountry.earths) }).map((_, i) => (
                  <div
                    key={`full-${i}`}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#0D9F91] via-[#425BFF] to-[#38BDF8] flex items-center justify-center text-white shadow-md transition-transform hover:scale-105"
                    title={`Earth ${i + 1}`}
                  >
                    <Globe className="w-8 h-8 sm:w-9 sm:h-9 opacity-90" />
                  </div>
                ))}

                {/* Partial planet fraction */}
                {selectedCountry.earths % 1 > 0.05 && (
                  <div
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-stone-200 overflow-hidden shadow-sm flex items-center justify-center transition-transform hover:scale-105"
                    title={`+${(selectedCountry.earths % 1).toFixed(1)} Earth fraction`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-tr from-[#0D9F91] via-[#425BFF] to-[#38BDF8]"
                      style={{ width: `${(selectedCountry.earths % 1) * 100}%` }}
                    />
                    <Globe className="w-8 h-8 sm:w-9 sm:h-9 text-white/90 relative z-10" />
                  </div>
                )}
              </div>

              <div>
                <div className="font-editorial text-4xl sm:text-5xl font-bold text-[#202A35] font-serif tabular-nums tracking-tight">
                  {selectedCountry.earths.toFixed(1)} <span className="text-xl sm:text-2xl font-normal text-[#202A35]/70">Earths</span>
                </div>
                <p className="text-xs sm:text-sm text-[#202A35]/70 mt-1 max-w-sm mx-auto">
                  Required if all 8 billion people shared this national lifestyle profile.
                </p>
              </div>
            </div>

            {/* Context & Drivers (Col 7 to 12) */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <span className="text-xs font-semibold text-[#425BFF] uppercase tracking-wider block">
                  Profile: {selectedCountry.country}
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#202A35] mt-1">
                  {selectedCountry.highlightText}
                </h3>
              </div>

              <p className="text-base text-[#202A35]/85 leading-relaxed">
                {selectedCountry.context}
              </p>

              {/* Primary Drivers List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-[#202A35]/60 uppercase tracking-wider block">
                  Structural Drivers:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCountry.primaryDrivers.map((driver) => (
                    <span
                      key={driver}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#FFF9F0] text-[#202A35] border border-[#202A35]/10"
                    >
                      {driver}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-xs text-[#202A35]/60">
                <span>Source: </span>
                <span className="italic">{selectedCountry.sourceNote}</span>
              </div>
            </div>
          </div>

          {/* Nuance & Responsible Context Card */}
          <div className="p-6 rounded-2xl bg-[#EEF1FF]/60 border border-[#CCD4FF] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#425BFF]">
              <HelpCircle className="w-4 h-4" />
              <span>{FOOTPRINT_EXPLAINER.nuanceTitle}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#202A35]/85 leading-relaxed">
              {FOOTPRINT_EXPLAINER.nuanceText}
            </p>
            <p className="text-xs sm:text-sm text-[#202A35]/85 leading-relaxed pt-1">
              {FOOTPRINT_EXPLAINER.analogy}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
