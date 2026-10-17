import React, { useState } from 'react';
import { ArrowDown, Compass, Droplets, MapPin, Users, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface HeroOpeningProps {
  onExploreObjects: (objectId?: string) => void;
}

interface Hotspot {
  id: string;
  name: string;
  x: number;
  y: number;
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
    y: 20,
    icon: MapPin,
    label: 'Global Transit',
    metric: '4 Continents',
    description: 'Cotton grown in one hemisphere, spun in another, dyed in a third, and shipped across oceans before resting on your hanger.',
    accent: '#C53B27'
  },
  {
    id: 'chest',
    name: 'Woven Cotton Jersey',
    x: 42,
    y: 44,
    icon: Droplets,
    label: 'Embedded Water',
    metric: '~2,700 Liters',
    description: 'Approximately 30 bathtubs of water were absorbed by cotton bolls in the field to produce the fabric for just one cotton shirt (Water Footprint Network).',
    accent: '#2840DE'
  },
  {
    id: 'sleeve',
    name: 'Shoulder & Sleeve Seam',
    x: 23,
    y: 35,
    icon: Users,
    label: 'Human Labor',
    metric: '~80 Seams',
    description: 'Garment workers in cut-and-sew workshops carefully stitch around eighty distinct seams on industrial overlock machines.',
    accent: '#086E64'
  },
  {
    id: 'hem',
    name: 'Bottom Hem',
    x: 60,
    y: 80,
    icon: Clock,
    label: 'Wear Frequency',
    metric: '7 to 10 Wears',
    description: 'In fast-fashion segments, garments are often discarded after fewer than ten wears—long before fibers actually degrade.',
    accent: '#B88000'
  }
];

export const HeroOpening: React.FC<HeroOpeningProps> = ({ onExploreObjects }) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot>(TSHIRT_HOTSPOTS[1]);
  const [showAllFragments, setShowAllFragments] = useState(false);

  const fragments = [
    { text: 'A field.', detail: 'Rainfed soil, warm sunshine, and cotton bolls.' },
    { text: 'A factory.', detail: 'Spinning wheels, high-pressure dye vats, and looms.' },
    { text: 'Many hands.', detail: 'Farmers, carders, weavers, tailors, and truckers.' },
    { text: 'And a journey you never saw.', detail: 'Thousands of miles traveled before meeting you.' }
  ];

  return (
    <section id="hero" className="scroll-mt-20 relative pt-6 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Background soft ambient tint */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#FFF0EE]/50 via-[#FFF9F0]/30 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Kicker */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#202A35]/70 mb-3">
          <span>BEFORE WASTE</span>
          <span aria-hidden="true">·</span>
          <span>AN INTERACTIVE STORY OF CONSUMPTION</span>
        </div>

        {/* Headline */}
        <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-[#202A35] text-balance mb-6 lg:mb-10 max-w-4xl">
          Where was your <span className="italic font-semibold text-[#C53B27]">T-shirt</span> before it was yours?
        </h1>

        {/* 2-Column Desktop Grid / Responsive Mobile Stack (Interactive T-shirt placed early on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Interactive T-Shirt Visual (Appears first on mobile right below headline!) */}
          <div className="lg:col-span-5 order-1 lg:order-2 w-full">
            <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-7 border border-[#202A35]/15 shadow-sm relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C53B27]" aria-hidden="true" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#202A35]/80">
                    Interactive Anatomy
                  </span>
                </div>
                <span className="text-xs text-[#202A35]/70">Tap points on shirt</span>
              </div>

              {/* T-Shirt SVG illustration with interactive hotspots */}
              <div className="bg-[#FFF9F0] rounded-2xl flex items-center justify-center p-3 sm:p-5 border border-[#202A35]/10 overflow-hidden">
                {/* Aspect-ratio locked coordinate frame matching the 320:280 SVG viewBox exactly */}
                <div className="relative w-full max-w-[320px] aspect-[320/280] select-none mx-auto">
                  <svg
                    viewBox="0 0 320 280"
                    className="w-full h-full block drop-shadow-sm select-none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Interactive illustration of a cotton T-shirt"
                    role="img"
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

                  {/* Hotspot buttons positioned relative to the EXACT SVG coordinate space */}
                  {TSHIRT_HOTSPOTS.map((hotspot) => {
                    const isSelected = activeHotspot.id === hotspot.id;
                    const Icon = hotspot.icon;
                    return (
                      <button
                        key={hotspot.id}
                        type="button"
                        onClick={() => setActiveHotspot(hotspot)}
                        style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#202A35] rounded-full transition-transform ${
                          isSelected ? 'scale-115 z-20' : 'hover:scale-110 z-10'
                        }`}
                        aria-label={`Inspect ${hotspot.name}: ${hotspot.label}`}
                        aria-pressed={isSelected}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'text-white shadow-md ring-4 ring-white'
                              : 'bg-white text-[#202A35] shadow border border-[#202A35]/25 hover:border-[#C53B27]'
                          }`}
                          style={{
                            backgroundColor: isSelected ? hotspot.accent : undefined
                          }}
                        >
                          <Icon className="w-4 h-4" aria-hidden="true" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Hotspot Info Card */}
              <div
                className="mt-4 p-4 rounded-xl border bg-white transition-all duration-200"
                style={{
                  borderColor: `${activeHotspot.accent}60`
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: activeHotspot.accent }}
                      aria-hidden="true"
                    />
                    <h2 className="text-sm font-semibold text-[#202A35]">
                      {activeHotspot.name}
                    </h2>
                  </div>
                  <span className="text-xs font-bold tracking-tight font-sans px-2.5 py-0.5 rounded bg-[#FFF9F0] border border-[#202A35]/15 text-[#202A35]">
                    {activeHotspot.metric}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#202A35]/90 mb-1">
                  {activeHotspot.label}
                </p>
                <p className="text-xs text-[#202A35]/80 leading-relaxed">
                  {activeHotspot.description}
                </p>
              </div>

              {/* Bottom Quick Object Selector (Wrap without clipping at 320px/375px) */}
              <div className="mt-4 pt-4 border-t border-[#202A35]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <span className="text-xs font-medium text-[#202A35]/70 shrink-0">Also exploring:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onExploreObjects('smartphone')}
                    className="flex-1 sm:flex-none px-3 py-2 min-h-[40px] text-xs font-semibold rounded-lg bg-[#EEF1FF] text-[#1E32B6] hover:bg-[#2840DE] hover:text-white focus-visible:ring-2 focus-visible:ring-[#2840DE] transition-colors cursor-pointer text-center"
                  >
                    Smartphone
                  </button>
                  <button
                    type="button"
                    onClick={() => onExploreObjects('food')}
                    className="flex-1 sm:flex-none px-3 py-2 min-h-[40px] text-xs font-semibold rounded-lg bg-[#E6F8F6] text-[#06574F] hover:bg-[#086E64] hover:text-white focus-visible:ring-2 focus-visible:ring-[#086E64] transition-colors cursor-pointer text-center"
                  >
                    Fresh Apple
                  </button>
                  <button
                    type="button"
                    onClick={() => onExploreObjects('package')}
                    className="flex-1 sm:flex-none px-3 py-2 min-h-[40px] text-xs font-semibold rounded-lg bg-[#FFF9EB] text-[#202A35] border border-[#202A35]/15 hover:bg-[#FFC857] focus-visible:ring-2 focus-visible:ring-[#B88000] transition-colors cursor-pointer text-center"
                  >
                    Delivery Box
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative & Progressive Disclosure (Order 2 on mobile, col-span-7 on desktop) */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
            {/* Supporting quote */}
            <div>
              <blockquote className="font-editorial text-xl sm:text-2xl text-[#202A35]/95 italic leading-snug border-l-0 pl-0">
                “Everything has a story. Most of it happens before we notice.”
              </blockquote>
              <p className="mt-2 text-sm text-[#202A35]/80 leading-relaxed max-w-xl">
                We live surrounded by objects made with planetary materials and human craftsmanship.
                Yet we rarely think about where they came from—or what happens after we let go.
              </p>
            </div>

            {/* Revealed story fragments with progressive disclosure */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#202A35]/70 tracking-wider uppercase">
                  Chapters of an everyday T-shirt:
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllFragments(!showAllFragments)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#202A35] hover:text-[#C53B27] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#202A35] rounded p-1"
                  aria-expanded={showAllFragments}
                >
                  <span>{showAllFragments ? 'Show fewer' : 'Read details'}</span>
                  {showAllFragments ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fragments.slice(0, showAllFragments ? 4 : 2).map((frag, idx) => (
                  <div
                    key={frag.text}
                    className="p-4 rounded-xl bg-white border border-[#202A35]/10 hover:border-[#C53B27]/40 transition-colors"
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-editorial text-lg font-bold text-[#C53B27]">
                        0{idx + 1}.
                      </span>
                      <h2 className="font-editorial text-lg font-semibold text-[#202A35]">
                        {frag.text}
                      </h2>
                    </div>
                    <p className="text-xs text-[#202A35]/75 leading-relaxed">
                      {frag.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <a
                href="#follow-one-thing"
                onClick={() => onExploreObjects('tshirt')}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[44px] text-sm font-semibold text-white bg-[#C53B27] hover:bg-[#AB2F1D] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C53B27] rounded-xl shadow-xs transition-all group text-center"
              >
                <span>Follow the story</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
              </a>

              <a
                href="#follow-one-thing"
                onClick={() => onExploreObjects('smartphone')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[44px] text-sm font-medium text-[#202A35] hover:text-[#1E32B6] bg-transparent hover:bg-[#202A35]/5 focus-visible:ring-2 focus-visible:ring-[#202A35] rounded-xl transition-colors text-center"
              >
                <Compass className="w-4 h-4 text-[#2840DE]" aria-hidden="true" />
                <span>Explore something else</span>
              </a>
            </div>

            {/* Quiet trust statement */}
            <div className="pt-3 border-t border-[#202A35]/10 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[#202A35]/75">
              <span className="font-semibold text-[#202A35]">Our Promise:</span>
              <span>No guilt or lecturing</span>
              <span aria-hidden="true" className="text-[#202A35]/40">·</span>
              <span>No corporate spin</span>
              <span aria-hidden="true" className="text-[#202A35]/40">·</span>
              <span>Just curiosity and better choices</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
