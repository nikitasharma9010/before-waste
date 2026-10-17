import React, { useState } from 'react';
import {
  ECOLOGICAL_FOOTPRINT_DATA,
  FOOTPRINT_EXPLAINER,
  CountryFootprint
} from '../data/ecologicalFootprintData';
import { Globe, HelpCircle } from 'lucide-react';

export const OnePlanetDemands: React.FC = () => {
  const [selectedCountryId, setSelectedCountryId] = useState<string>('world');

  const selectedCountry: CountryFootprint =
    ECOLOGICAL_FOOTPRINT_DATA.find((c) => c.id === selectedCountryId) ||
    ECOLOGICAL_FOOTPRINT_DATA[3];

  return (
    <section id="one-planet" className="scroll-mt-20 py-16 lg:py-24 bg-paper border-b border-ink/8">
      {/* Live announcement region for country selection */}
      <div role="status" aria-live="polite" className="sr-only">
        Viewing {selectedCountry.country}: {selectedCountry.earths.toFixed(1)} Earths comparison.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="section-kicker text-forest mb-2">
            <span>A MOMENT OF WONDER</span>
            <span aria-hidden="true">·</span>
            <span>ECOLOGICAL BIOCAPACITY</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-ink font-normal leading-tight text-balance">
            {FOOTPRINT_EXPLAINER.headline}
          </h2>
          <p className="mt-3 text-lg text-ink/85 font-normal leading-relaxed">
            {FOOTPRINT_EXPLAINER.definition}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="bg-surface rounded-3xl border border-ink/10 p-4 sm:p-7 lg:p-10 shadow-sm">
          {/* Country selection buttons */}
          <div className="mb-8">
            <span id="country-tabs-label" className="text-xs font-semibold text-ink/75 uppercase tracking-wider block mb-3">
              Explore national per-capita demands (Global Footprint Network, 2024 Edition):
            </span>
            <div
              role="group"
              aria-labelledby="country-tabs-label"
              className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2"
            >
              {ECOLOGICAL_FOOTPRINT_DATA.map((item) => {
                const isSelected = item.id === selectedCountryId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    id={`country-tab-${item.id}`}
                    aria-pressed={isSelected}
                    aria-controls="country-demand-panel"
                    onClick={() => setSelectedCountryId(item.id)}
                    className={`flex flex-col items-start justify-center gap-1.5 px-3 py-3 min-h-[76px] min-w-0 rounded-xl text-sm text-left font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink focus:outline-none ${
                      isSelected
                        ? 'bg-forest text-white shadow-xs'
                        : 'bg-paper text-ink hover:bg-ink/5 border border-ink/15'
                    }`}
                  >
                    <span>{item.country}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-mono tabular-nums font-normal ${
                        isSelected ? 'bg-black/15 text-white' : 'bg-black/5 text-ink/80'
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
          <div
            id="country-demand-panel"
            role="region"
            aria-labelledby={`country-tab-${selectedCountry.id}`}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-8"
          >
            {/* Visual Earths Graphic */}
            <div className="lg:col-span-6 bg-paper p-4 sm:p-6 lg:p-8 rounded-2xl border border-ink/10 text-center space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-ink/15 text-xs font-semibold text-ink">
                <Globe className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
                <span>Demand Comparison Ratio</span>
              </div>

              {/* Planet Multiplier Graphic */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 py-3 sm:py-4 min-h-[120px] sm:min-h-[140px]" aria-hidden="true">
                {Array.from({ length: Math.floor(selectedCountry.earths) }).map((_, i) => (
                  <div
                    key={`full-${i}`}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-forest via-forest to-sage-strong flex items-center justify-center text-white shadow-sm transition-transform hover:scale-105"
                  >
                    <Globe className="w-7 h-7 sm:w-9 sm:h-9 opacity-95" />
                  </div>
                ))}

                {selectedCountry.earths % 1 > 0.05 && (
                  <div
                    className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-stone-300 overflow-hidden shadow-sm flex items-center justify-center transition-transform hover:scale-105"
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-tr from-forest via-forest to-sage-strong"
                      style={{ width: `${(selectedCountry.earths % 1) * 100}%` }}
                    />
                    <Globe className="w-7 h-7 sm:w-9 sm:h-9 text-white/95 relative z-10" />
                  </div>
                )}
              </div>

              <div>
                <div className="font-editorial text-4xl sm:text-5xl font-bold text-ink font-serif tabular-nums tracking-tight">
                  {selectedCountry.earths.toFixed(1)} <span className="text-xl sm:text-2xl font-normal text-ink/75">Earths</span>
                </div>
                <p className="text-xs sm:text-sm text-ink/75 mt-1 max-w-sm mx-auto">
                  Required if all 8 billion people shared this national average resource demand profile.
                </p>
              </div>
            </div>

            {/* Context & Drivers */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <span className="text-xs font-semibold text-forest uppercase tracking-wider block">
                  Profile: {selectedCountry.country}
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-ink mt-1">
                  {selectedCountry.highlightText}
                </h3>
              </div>

              <p className="text-base text-ink/85 leading-relaxed">
                {selectedCountry.context}
              </p>

              {/* Primary Drivers List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-ink/75 uppercase tracking-wider block">
                  Structural & Grid Drivers:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCountry.primaryDrivers.map((driver) => (
                    <span
                      key={driver}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-paper text-ink border border-ink/15"
                    >
                      {driver}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-xs text-ink/75">
                <span>Data Source: </span>
                <span className="italic">{selectedCountry.sourceNote}</span>
              </div>
            </div>
          </div>

          {/* Nuance & Responsible Context Card */}
          <div className="p-6 rounded-2xl bg-sage/70 border border-sage-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest">
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              <span>{FOOTPRINT_EXPLAINER.nuanceTitle}</span>
            </div>
            <p className="text-xs sm:text-sm text-ink/90 leading-relaxed">
              {FOOTPRINT_EXPLAINER.nuanceText}
            </p>
            <p className="text-xs sm:text-sm text-ink/85 leading-relaxed pt-1">
              {FOOTPRINT_EXPLAINER.analogy}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
