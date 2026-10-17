import React, { useState } from 'react';
import { ArrowDown, Compass, Sparkles, MapPin, Droplets, Users, Clock } from 'lucide-react';

interface HeroOpeningProps {
  onExploreObjects: (objectId?: string) => void;
}

interface Hotspot {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  icon: typeof MapPin;
  label: string;
  metric: string;
  description: string;
  accent: string;
}

const TSHIRT_HOTSPOTS: Hotspot[] = [
  {
    id: 'collar',
    name: 'Collar & Care Tag',
    x: 50,
    y: 22,
    icon: MapPin,
    label: 'The 12,000 km Transit',
    metric: '4 Continents',
    description: 'Cotton grown in one hemisphere, spun in another, dyed in a third, and shipped across oceans before resting on your hanger.',
    accent: '#FF654F'
  },
  {
    id: 'chest',
    name: 'Woven Cotton Jersey',
    x: 42,
    y: 44,
    icon: Droplets,
    label: 'Embedded Water',
    metric: '2,700 Liters',
    description: 'Roughly 30 bathtubs of water were absorbed by cotton bolls in the field to produce the fabric for just one regular T-shirt.',
    accent: '#425BFF'
  },
  {
    id: 'sleeve',
    name: 'Shoulder & Sleeve Seam',
    x: 23,
    y: 35,
    icon: Users,
    label: 'Human Hands',
    metric: '~80 Seams',
    description: 'Over 30 individual human workers guided this garment through cutting tables, sewing lines, quality inspection, and folding.',
    accent: '#0D9F91'
  },
  {
    id: 'hem',
    name: 'Bottom Hem',
    x: 60,
    y: 78,
    icon: Clock,
    label: 'Wear Frequency',
    metric: '7 to 10 Wears',
    description: 'The average modern fast-fashion shirt is discarded after fewer than ten wears—long before its cotton fibers actually degrade.',
    accent: '#FFC857'
  }
];

export const HeroOpening: React.FC<HeroOpeningProps> = ({ onExploreObjects }) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot>(TSHIRT_HOTSPOTS[1]);
  const [revealedIndex, setRevealedIndex] = useState(3); // reveal all or toggle

  const fragments = [
    { text: 'A field.', detail: 'Rainfed soil, warm sunshine, and cotton bolls.' },
    { text: 'A factory.', detail: 'Spinning wheels, high-pressure dye vats, and looms.' },
    { text: 'Many hands.', detail: 'Farmers, carders, weavers, tailors, and truckers.' },
    { text: 'And a journey you never saw.', detail: 'Thousands of miles traveled before meeting you.' }
  ];

  return (
    <section id="hero" className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      {/* Background soft ambient tint */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#FFF0EE]/60 via-[#FFF9F0]/30 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Subtitle / Kicker (Zero pill, clean text) */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#202A35]/60 mb-4">
          <span>BEFORE WASTE</span>
          <span aria-hidden="true">·</span>
          <span>AN INTERACTIVE STORY OF CONSUMPTION</span>
          <span aria-hidden="true">·</span>
          <span>EST. 2026</span>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Compelling Question & Narrative */}
          <div className="lg:col-span-7 space-y-8">
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.12] text-[#202A35] text-balance">
              Where was your <span className="italic font-semibold text-[#FF654F]">T-shirt</span> before it was yours?
            </h1>

            {/* Revealed story fragments */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-medium text-[#202A35]/60 tracking-wider uppercase">
                The hidden chapters of an everyday object:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fragments.map((frag, idx) => (
                  <div
                    key={frag.text}
                    className="p-4 rounded-xl bg-white/70 border border-[#202A35]/8 hover:border-[#FF654F]/40 transition-colors"
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-editorial text-lg font-bold text-[#FF654F]">
                        0{idx + 1}.
                      </span>
                      <h2 className="font-editorial text-lg font-semibold text-[#202A35]">
                        {frag.text}
                      </h2>
                    </div>
                    <p className="text-xs text-[#202A35]/70 leading-relaxed">
                      {frag.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Supporting line */}
            <div className="pt-2">
              <blockquote className="font-editorial text-xl sm:text-2xl text-[#202A35]/90 italic leading-snug border-l-0 pl-0">
                “Everything has a story. Most of it happens before we notice.”
              </blockquote>
              <p className="mt-2 text-sm text-[#202A35]/75 leading-relaxed max-w-xl">
                We live surrounded by objects made with incredible ingenuity, human labor, and earthly materials.
                Yet we rarely meet them until they sit on store shelves—and we only think about waste when tossing them out.
              </p>
            </div>

            {/* Clear Primary Action & Subtle Secondary Action */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#follow-one-thing"
                onClick={() => onExploreObjects('tshirt')}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-medium text-white bg-[#FF654F] hover:bg-[#e8543f] rounded-xl shadow-sm hover:shadow transition-all group"
              >
                <span>Follow the story</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#follow-one-thing"
                onClick={() => onExploreObjects('smartphone')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-[#202A35] hover:text-[#425BFF] bg-transparent hover:bg-[#202A35]/5 rounded-xl transition-colors"
              >
                <Compass className="w-4 h-4 text-[#425BFF]" />
                <span>Explore something else</span>
              </a>
            </div>

            {/* Quick trust / mindset statement */}
            <div className="pt-4 border-t border-[#202A35]/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#202A35]/70">
              <span className="font-medium text-[#202A35]">Our Promise:</span>
              <span>No guilt or shame</span>
              <span aria-hidden="true">·</span>
              <span>No lectures or preaching</span>
              <span aria-hidden="true">·</span>
              <span>Just curiosity and better choices</span>
            </div>
          </div>

          {/* Right Column: Original Interactive T-Shirt Visual */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#202A35]/10 shadow-sm relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF654F]" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#202A35]/80">
                    Interactive Anatomy
                  </span>
                </div>
                <span className="text-xs text-[#202A35]/60">Tap points on the T-shirt</span>
              </div>

              {/* T-Shirt SVG illustration with interactive hotspots */}
              <div className="relative aspect-[4/3.8] bg-[#FFF9F0] rounded-xl flex items-center justify-center p-4 border border-[#202A35]/5 overflow-hidden">
                <svg
                  viewBox="0 0 320 280"
                  className="w-full h-full max-h-[300px] drop-shadow-md select-none transition-transform duration-300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="shirtGrad" x1="50" y1="20" x2="270" y2="260" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#F5ECE2" />
                    </linearGradient>
                    <linearGradient id="collarGrad" x1="120" y1="20" x2="200" y2="70" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#EADDCF" />
                      <stop offset="100%" stopColor="#DFD0C0" />
                    </linearGradient>
                    <pattern id="jerseyPattern" width="6" height="6" patternUnits="userSpaceOnUse">
                      <path d="M 0 3 Q 3 0 6 3 Q 3 6 0 3" fill="none" stroke="#E2D6C8" strokeWidth="0.5" opacity="0.6" />
                    </pattern>
                  </defs>

                  {/* Shirt Base Outline */}
                  <path
                    d="M 115 32 
                       C 135 48, 185 48, 205 32 
                       L 270 65 
                       C 278 70, 285 85, 275 105 
                       L 242 120 
                       L 230 102 
                       L 230 250 
                       C 230 256, 224 260, 218 260 
                       L 102 260 
                       C 96 260, 90 256, 90 250 
                       L 90 102 
                       L 78 120 
                       L 45 105 
                       C 35 85, 42 70, 50 65 
                       Z"
                    fill="url(#shirtGrad)"
                    stroke="#202A35"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />

                  {/* Jersey Texture overlay */}
                  <path
                    d="M 115 32 C 135 48, 185 48, 205 32 L 270 65 C 278 70, 285 85, 275 105 L 242 120 L 230 102 L 230 250 C 230 256, 224 260, 218 260 L 102 260 C 96 260, 90 256, 90 250 L 90 102 L 78 120 L 45 105 C 35 85, 42 70, 50 65 Z"
                    fill="url(#jerseyPattern)"
                  />

                  {/* Collar detail */}
                  <path
                    d="M 115 32 C 135 52, 185 52, 205 32 C 185 40, 135 40, 115 32 Z"
                    fill="url(#collarGrad)"
                    stroke="#202A35"
                    strokeWidth="2"
                  />

                  {/* Sleeve Stitch Lines */}
                  <path d="M 90 102 L 115 50" stroke="#202A35" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  <path d="M 230 102 L 205 50" stroke="#202A35" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  {/* Bottom Hem Stitch Line */}
                  <path d="M 90 248 L 230 248" stroke="#202A35" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />

                  {/* Fabric folds */}
                  <path d="M 155 75 Q 160 110 152 140" stroke="#E2D4C5" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 175 120 Q 170 160 178 200" stroke="#E2D4C5" strokeWidth="2" strokeLinecap="round" />
                </svg>

                {/* Hotspot buttons */}
                {TSHIRT_HOTSPOTS.map((hotspot) => {
                  const isSelected = activeHotspot.id === hotspot.id;
                  const Icon = hotspot.icon;
                  return (
                    <button
                      key={hotspot.id}
                      onClick={() => setActiveHotspot(hotspot)}
                      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none transition-transform ${
                        isSelected ? 'scale-115 z-20' : 'hover:scale-110 z-10'
                      }`}
                      aria-label={`Inspect ${hotspot.name}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'text-white shadow-md ring-4 ring-white'
                            : 'bg-white text-[#202A35] shadow border border-[#202A35]/20 hover:border-[#FF654F]'
                        }`}
                        style={{
                          backgroundColor: isSelected ? hotspot.accent : undefined
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Hotspot Info Card */}
              <div
                className="mt-4 p-4 rounded-xl border transition-all duration-200"
                style={{
                  backgroundColor: `${activeHotspot.accent}0D`,
                  borderColor: `${activeHotspot.accent}40`
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: activeHotspot.accent }}
                    />
                    <h3 className="text-sm font-semibold text-[#202A35]">
                      {activeHotspot.name}
                    </h3>
                  </div>
                  <span
                    className="text-xs font-bold tracking-tight font-sans px-2 py-0.5 rounded bg-white border border-[#202A35]/10"
                    style={{ color: activeHotspot.accent }}
                  >
                    {activeHotspot.metric}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#202A35]/80 mb-1">
                  {activeHotspot.label}
                </p>
                <p className="text-xs text-[#202A35]/70 leading-relaxed">
                  {activeHotspot.description}
                </p>
              </div>

              {/* Bottom Quick Object Selector */}
              <div className="mt-4 pt-4 border-t border-[#202A35]/8 flex items-center justify-between">
                <span className="text-xs text-[#202A35]/60">Also exploring:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onExploreObjects('smartphone')}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#EEF1FF] text-[#425BFF] hover:bg-[#425BFF] hover:text-white transition-colors cursor-pointer"
                  >
                    Smartphone
                  </button>
                  <button
                    onClick={() => onExploreObjects('food')}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#E6F8F6] text-[#0D9F91] hover:bg-[#0D9F91] hover:text-white transition-colors cursor-pointer"
                  >
                    Fresh Produce
                  </button>
                  <button
                    onClick={() => onExploreObjects('package')}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#FFF9EB] text-[#b88000] hover:bg-[#FFC857] hover:text-[#202A35] transition-colors cursor-pointer"
                  >
                    Delivery Box
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
