import { THEME } from '../utils/theme';
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
    y: 14,
    icon: MapPin,
    label: 'Global Transit',
    metric: 'Across borders',
    description: 'Cotton grown in one hemisphere, spun in another, dyed in a third, and shipped across oceans before resting on your hanger.',
    accent: THEME.forest
  },
  {
    id: 'chest',
    name: 'Woven Cotton Jersey',
    x: 42,
    y: 44,
    icon: Droplets,
    label: 'Embedded Water',
    metric: 'Water & soil',
    description: 'Cotton cultivation uses rainwater and, in some regions, irrigation. Water demand varies with growing conditions, farming practices, and garment weight.',
    accent: THEME.forest
  },
  {
    id: 'sleeve',
    name: 'Shoulder & Sleeve Seam',
    x: 17,
    y: 35,
    icon: Users,
    label: 'Human Labor',
    metric: 'Skilled work',
    description: 'Garment workers cut, stitch, and finish the fabric. Construction and the number of seams depend on the garment.',
    accent: THEME.forest
  },
  {
    id: 'hem',
    name: 'Bottom Hem',
    x: 60,
    y: 80,
    icon: Clock,
    label: 'Wear Frequency',
    metric: 'Wear & care',
    description: 'How often a garment is worn and cared for shapes its useful life. Repairing small signs of wear can help keep it in use.',
    accent: THEME.forest
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-clay-tint/50 via-paper/30 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Kicker */}
        <div className="section-kicker text-ink/75 mb-3">
          <span>BEFORE WASTE</span>
          <span aria-hidden="true">·</span>
          <span>AN INTERACTIVE STORY OF CONSUMPTION</span>
        </div>

        {/* Headline and illustration align at the top on desktop; mobile keeps the visual next. */}
        <div className="hero-layout grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[min-content_1fr] gap-6 lg:gap-x-14 lg:gap-y-8 items-start">
          <h1 className="lg:col-span-7 lg:row-start-1 order-0 font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-ink text-balance min-w-0">
            Where was your <span className="italic font-semibold text-clay">T-shirt</span> before it was yours?
          </h1>

          {/* Interactive T-Shirt Visual (Appears first on mobile right below headline!) */}
          <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 order-1 w-full min-w-0">
            <div className="bg-surface rounded-3xl p-4 sm:p-6 lg:p-7 border border-ink/15 shadow-sm relative">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-clay" aria-hidden="true" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-ink/80">
                    Interactive Anatomy
                  </span>
                </div>
                <span className="text-xs text-ink/75">Tap points on shirt</span>
              </div>

              {/* T-Shirt SVG illustration with interactive hotspots */}
              <div className="bg-paper rounded-2xl flex items-center justify-center p-3 sm:p-5 border border-ink/10 overflow-hidden">
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
                      stroke="var(--color-ink)"
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
                      stroke="var(--color-ink)"
                      strokeWidth="2"
                    />

                    {/* Sleeve Stitch Lines */}
                    <path d="M 90 102 L 115 50" stroke="var(--color-ink)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                    <path d="M 230 102 L 205 50" stroke="var(--color-ink)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                    {/* Bottom Hem Stitch Line */}
                    <path d="M 90 248 L 230 248" stroke="var(--color-ink)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />

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
                        className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-full ${
                          isSelected ? 'z-20' : 'z-10'
                        }`}
                        aria-label={`Inspect ${hotspot.name}: ${hotspot.label}`}
                        aria-pressed={isSelected}
                        aria-controls="hotspot-details"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'text-white shadow-md ring-4 ring-white'
                              : 'bg-surface text-ink shadow border border-ink/25 hover:border-clay'
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
                id="hotspot-details"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="mt-4 p-4 rounded-xl border bg-surface transition-all duration-200"
                style={{
                  borderColor: 'var(--color-sage-border)'
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: activeHotspot.accent }}
                      aria-hidden="true"
                    />
                    <h2 className="text-sm font-semibold text-ink">
                      {activeHotspot.name}
                    </h2>
                  </div>
                  <span className="text-xs font-bold tracking-tight font-sans px-2.5 py-0.5 rounded bg-paper border border-ink/15 text-ink">
                    {activeHotspot.metric}
                  </span>
                </div>
                <p className="text-xs font-medium text-ink/90 mb-1">
                  {activeHotspot.label}
                </p>
                <p className="text-xs text-ink/80 leading-relaxed">
                  {activeHotspot.description}
                </p>
              </div>

              {/* Bottom Quick Object Selector (Wrap without clipping at 320px/375px) */}
              <div className="mt-4 pt-4 border-t border-ink/10 flex flex-col gap-2.5">
                <span className="text-xs font-medium text-ink/75 shrink-0">Also exploring:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    aria-label="Follow the Smartphone story"
                    onClick={() => onExploreObjects('smartphone')}
                    className="flex-1 px-3 py-2 min-h-[44px] text-xs font-semibold rounded-lg bg-sage text-forest-strong hover:bg-forest hover:text-white focus-visible:ring-2 focus-visible:ring-forest transition-colors cursor-pointer text-center"
                  >
                    Phone
                  </button>
                  <button
                    type="button"
                    aria-label="Follow the Fresh Apple story"
                    onClick={() => onExploreObjects('food')}
                    className="flex-1 px-3 py-2 min-h-[44px] text-xs font-semibold rounded-lg bg-sage text-forest-strong hover:bg-forest hover:text-white focus-visible:ring-2 focus-visible:ring-forest transition-colors cursor-pointer text-center"
                  >
                    Apple
                  </button>
                  <button
                    type="button"
                    aria-label="Follow the Delivery Box story"
                    onClick={() => onExploreObjects('package')}
                    className="flex-1 px-3 py-2 min-h-[44px] text-xs font-semibold rounded-lg bg-sage text-forest-strong hover:bg-forest hover:text-white focus-visible:ring-2 focus-visible:ring-forest transition-colors cursor-pointer text-center"
                  >
                    Box
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative & Progressive Disclosure (Order 2 on mobile, col-span-7 on desktop) */}
          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-2 order-2 space-y-6 min-w-0">
            {/* Supporting quote */}
            <div>
              <blockquote className="font-editorial text-xl sm:text-2xl text-ink/95 italic leading-snug border-l-0 pl-0">
                “Everything has a story. Most of it happens before we notice.”
              </blockquote>
              <p className="mt-2 text-sm text-ink/80 leading-relaxed max-w-xl">
                We live surrounded by objects made with planetary materials and human craftsmanship.
                Yet we rarely think about where they came from—or what happens after we let go.
              </p>
            </div>

            {/* Revealed story fragments with progressive disclosure */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink/75 tracking-wider uppercase">
                  Chapters of an everyday T-shirt:
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllFragments(!showAllFragments)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-ink hover:text-clay cursor-pointer focus-visible:ring-2 focus-visible:ring-ink rounded px-2 py-2 min-h-[44px]"
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
                    className="p-4 rounded-xl bg-surface border border-ink/10 hover:border-clay/40 transition-colors"
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-editorial text-lg font-bold text-clay">
                        0{idx + 1}.
                      </span>
                      <h2 className="font-editorial text-lg font-semibold text-ink">
                        {frag.text}
                      </h2>
                    </div>
                    <p className="text-xs text-ink/75 leading-relaxed">
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
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[44px] text-sm font-semibold text-white bg-forest hover:bg-forest-strong focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-clay rounded-xl shadow-xs transition-all group text-center"
              >
                <span>Follow the story</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
              </a>

              <a
                href="#follow-one-thing"
                onClick={() => onExploreObjects('smartphone')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[44px] text-sm font-medium text-ink hover:text-forest-strong bg-transparent hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-ink rounded-xl transition-colors text-center"
              >
                <Compass className="w-4 h-4 text-forest" aria-hidden="true" />
                <span>Explore something else</span>
              </a>
            </div>

            {/* Quiet trust statement */}
            <div className="pt-3 border-t border-ink/10 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-ink/75">
              <span className="font-semibold text-ink">Our Promise:</span>
              <span>No guilt or lecturing</span>
              <span aria-hidden="true" className="text-ink/40">·</span>
              <span>No corporate spin</span>
              <span aria-hidden="true" className="text-ink/40">·</span>
              <span>Just curiosity and better choices</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
