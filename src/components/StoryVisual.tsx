import React from 'react';

interface StoryVisualProps {
  objectId: string;
  label: string;
  stageNumber: number; // 1 to 5
  accentColor: string;
}

export const StoryVisual: React.FC<StoryVisualProps> = ({ objectId, stageNumber, accentColor, label }) => {
  // Render distinct SVG scenes according to object and stage
  return (
    <div className="w-full aspect-[4/3] bg-paper rounded-2xl border border-ink/10 p-3.5 sm:p-5 lg:p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-inner select-none transition-all duration-300">
      {/* Background ambient radial glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 70%)`
        }}
      />

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 400 300"
        role="img"
        aria-label={label}
        className="w-full h-full drop-shadow-sm transition-all duration-500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* T-SHIRT SCENES */}
        {objectId === 'tshirt' && (
          <g className="transition-all duration-500">
            {stageNumber === 1 && (
              // Stage 1: Cotton Field & Rainfed Agriculture
              <g>
                {/* Sun */}
                <circle cx="320" cy="70" r="32" fill="#B18A57" opacity="0.3" />
                <circle cx="320" cy="70" r="22" fill="#B18A57" />
                {/* Rolling hill field */}
                <path d="M 0 240 Q 150 190 400 230 L 400 300 L 0 300 Z" fill="#E8F4E8" />
                <path d="M 0 260 Q 200 230 400 265 L 400 300 L 0 300 Z" fill="#D6EAD6" />
                {/* Cotton Plant Stems */}
                <path d="M 120 260 Q 125 180 140 130" stroke="#5A7D5A" strokeWidth="4" strokeLinecap="round" />
                <path d="M 130 190 Q 95 170 70 175" stroke="#5A7D5A" strokeWidth="3" strokeLinecap="round" />
                <path d="M 135 155 Q 175 135 200 145" stroke="#5A7D5A" strokeWidth="3" strokeLinecap="round" />
                {/* Cotton Bolls */}
                <g transform="translate(140, 115)">
                  {/* Calyx Leaves */}
                  <path d="M -15 20 Q 0 10 15 20 Q 0 25 -15 20 Z" fill="#466446" />
                  {/* Fluffy cotton clouds */}
                  <circle cx="-12" cy="-2" r="16" fill="#FFFFFF" stroke="#D8E2D8" strokeWidth="1.5" />
                  <circle cx="12" cy="-2" r="16" fill="#FFFFFF" stroke="#D8E2D8" strokeWidth="1.5" />
                  <circle cx="0" cy="-18" r="18" fill="#FFFFFF" stroke="#D8E2D8" strokeWidth="1.5" />
                  <circle cx="0" cy="2" r="16" fill="#FBFBFB" stroke="#D8E2D8" strokeWidth="1.5" />
                </g>
                {/* Second Boll */}
                <g transform="translate(68, 170)">
                  <circle cx="-8" cy="-2" r="12" fill="#FFFFFF" stroke="#D8E2D8" strokeWidth="1.5" />
                  <circle cx="8" cy="-2" r="12" fill="#FFFFFF" stroke="#D8E2D8" strokeWidth="1.5" />
                  <circle cx="0" cy="-12" r="13" fill="#FFFFFF" stroke="#D8E2D8" strokeWidth="1.5" />
                </g>
                {/* Third Boll */}
                <g transform="translate(200, 140)">
                  <circle cx="-8" cy="-2" r="12" fill="#FFFFFF" stroke="#D8E2D8" strokeWidth="1.5" />
                  <circle cx="8" cy="-2" r="12" fill="#FFFFFF" stroke="#D8E2D8" strokeWidth="1.5" />
                  <circle cx="0" cy="-12" r="13" fill="#FFFFFF" stroke="#D8E2D8" strokeWidth="1.5" />
                </g>
                {/* Water droplets symbol */}
                <g transform="translate(260, 180)">
                  <path d="M 20 0 C 20 0, 35 25, 35 35 C 35 45, 27 52, 20 52 C 13 52, 5 45, 5 35 C 5 25, 20 0, 20 0 Z" fill="#3A7469" opacity="0.8" />
                  <text x="45" y="42" fill="#243A32" fontSize="13" fontWeight="600" fontFamily="DM Sans">Rain & irrigation</text>
                </g>
              </g>
            )}

            {stageNumber === 2 && (
              // Stage 2: Loom Shuttles, Spools, & Sewing Machines
              <g>
                {/* Spinning Spool */}
                <rect x="70" y="80" width="40" height="130" rx="6" fill="#F0E5D8" stroke="#243A32" strokeWidth="2" />
                <rect x="62" y="70" width="56" height="14" rx="3" fill="#DFD2C2" stroke="#243A32" strokeWidth="2" />
                <rect x="62" y="206" width="56" height="14" rx="3" fill="#DFD2C2" stroke="#243A32" strokeWidth="2" />
                {/* Spun Yarn Lines */}
                <path d="M 110 100 Q 180 80 230 110" stroke="#A44932" strokeWidth="2.5" strokeDasharray="4 2" />
                <path d="M 110 145 Q 190 130 250 160" stroke="#A44932" strokeWidth="2.5" />
                <path d="M 110 190 Q 180 180 230 200" stroke="#A44932" strokeWidth="2.5" strokeDasharray="4 2" />
                {/* Sewing Needle */}
                <path d="M 280 40 L 250 160" stroke="#8892B0" strokeWidth="4" strokeLinecap="round" />
                <circle cx="276" cy="55" r="3" fill="#FFFFFF" stroke="#243A32" strokeWidth="1.5" />
                <path d="M 276 55 L 290 80 Q 310 120 290 160" stroke="#A44932" strokeWidth="2" />
                {/* Loom Grid Background */}
                <g opacity="0.4">
                  {[120, 140, 160, 180, 200, 220].map((x) => (
                    <line key={x} x1={x} y1="210" x2={x} y2="280" stroke="#243A32" strokeWidth="1.5" strokeDasharray="3 3" />
                  ))}
                  {[225, 245, 265].map((y) => (
                    <line key={y} x1="110" y1={y} x2="230" y2={y} stroke="#A44932" strokeWidth="1.5" />
                  ))}
                </g>
                {/* Garment Cutout outline */}
                <path d="M 280 200 L 320 220 L 305 240 L 340 280 L 250 280 Z" fill="#FFE5E0" stroke="#A44932" strokeWidth="2" strokeDasharray="4 3" />
              </g>
            )}

            {stageNumber === 3 && (
              // Stage 3: Wardrobe Hanger, Sunlight, and Loving Wear
              <g>
                {/* Gentle breeze lines */}
                <path d="M 40 80 Q 80 70 120 80" stroke="#3A7469" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                <path d="M 50 110 Q 90 100 130 110" stroke="#3A7469" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                {/* Wooden Hanger Hook */}
                <path d="M 200 80 C 200 65, 215 55, 215 45 C 215 35, 205 30, 195 35 C 185 40, 185 50, 185 50" stroke="#8B5A2B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                {/* Wooden Hanger Body */}
                <path d="M 130 110 L 200 80 L 270 110 L 200 95 Z" fill="#D2996E" stroke="#8B5A2B" strokeWidth="2" />
                {/* T-Shirt hanging neatly */}
                <path
                  d="M 155 98 C 170 110, 230 110, 245 98 L 290 125 C 295 130, 298 140, 290 155 L 268 165 L 260 148 L 260 270 C 260 275, 255 278, 250 278 L 150 278 C 145 278, 140 275, 140 270 L 140 148 L 132 165 L 110 155 C 102 140, 105 130, 110 125 Z"
                  fill="#FFFFFF"
                  stroke="#243A32"
                  strokeWidth="2.5"
                />
                {/* Gentle clean laundry ripples */}
                <path d="M 175 140 Q 185 180 180 230" stroke="#E6E0D8" strokeWidth="2" strokeLinecap="round" />
                <path d="M 220 160 Q 215 200 225 240" stroke="#E6E0D8" strokeWidth="2" strokeLinecap="round" />
                {/* Cold wash icon */}
                <g transform="translate(295, 200)">
                  <circle cx="20" cy="20" r="22" fill="#EBF3FF" stroke="#3A7469" strokeWidth="1.5" />
                  <path d="M 10 24 Q 15 16 20 24 Q 25 32 30 24" stroke="#3A7469" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <text x="20" y="16" textAnchor="middle" fill="#3A7469" fontSize="9" fontWeight="700">30°C</text>
                </g>
              </g>
            )}

            {stageNumber === 4 && (
              // Stage 4: Overflowing Discard Pile & Landfill
              <g>
                {/* Dark landfill horizon */}
                <path d="M 0 250 Q 180 220 400 255 L 400 300 L 0 300 Z" fill="#D5DDD5" />
                <path d="M 0 275 Q 220 260 400 280 L 400 300 L 0 300 Z" fill="#BFCBBF" />
                {/* Trash sorting container silhouette */}
                <rect x="70" y="150" width="110" height="110" rx="8" fill="#E6EDE6" stroke="#243A32" strokeWidth="2" />
                <line x1="70" y1="170" x2="180" y2="170" stroke="#243A32" strokeWidth="2" />
                <line x1="105" y1="185" x2="105" y2="245" stroke="#9EAD9E" strokeWidth="2" strokeLinecap="round" />
                <line x1="125" y1="185" x2="125" y2="245" stroke="#9EAD9E" strokeWidth="2" strokeLinecap="round" />
                <line x1="145" y1="185" x2="145" y2="245" stroke="#9EAD9E" strokeWidth="2" strokeLinecap="round" />
                {/* Tumbled crumpled shirt */}
                <path
                  d="M 130 135 Q 160 110 200 120 Q 230 100 260 125 Q 280 150 250 185 Q 210 210 160 180 Q 120 160 130 135 Z"
                  fill="#FFF0EE"
                  stroke="#A44932"
                  strokeWidth="2"
                />
                <path d="M 160 135 Q 180 165 210 150" stroke="#A44932" strokeWidth="1.5" strokeDasharray="3 3" />
                {/* Percentage callout */}
                <g transform="translate(250, 75)">
                  <rect x="0" y="0" width="110" height="54" rx="8" fill="#FFFFFF" stroke="#243A32" strokeWidth="1.5" />
                  <text x="14" y="24" fill="#C53B27" fontSize="18" fontWeight="bold" fontFamily="Fraunces">73%</text>
                  <text x="14" y="42" fill="#243A32" fontSize="10" fontWeight="500">Landfill / Burned</text>
                </g>
              </g>
            )}

            {stageNumber === 5 && (
              // Stage 5: Visible Mending & Upcycled Second Life
              <g>
                {/* Upcycled Tote Bag / Revitalized Shirt */}
                <rect x="130" y="110" width="140" height="150" rx="10" fill="#FFFFFF" stroke="#243A32" strokeWidth="2.5" />
                {/* Tote Straps */}
                <path d="M 160 110 C 160 50, 240 50, 240 110" stroke="#20594B" strokeWidth="6" strokeLinecap="round" fill="none" />
                {/* Japanese Sashiko Visible Mending Crosses */}
                <g stroke="#20594B" strokeWidth="2" strokeLinecap="round">
                  <line x1="160" y1="140" x2="175" y2="140" />
                  <line x1="167.5" y1="132.5" x2="167.5" y2="147.5" />
                  <line x1="190" y1="140" x2="205" y2="140" />
                  <line x1="197.5" y1="132.5" x2="197.5" y2="147.5" />
                  <line x1="220" y1="140" x2="235" y2="140" />
                  <line x1="227.5" y1="132.5" x2="227.5" y2="147.5" />
                  <line x1="175" y1="165" x2="190" y2="165" />
                  <line x1="182.5" y1="157.5" x2="182.5" y2="172.5" />
                  <line x1="205" y1="165" x2="220" y2="165" />
                  <line x1="212.5" y1="157.5" x2="212.5" y2="172.5" />
                </g>
                {/* Circular arrows loop */}
                <g transform="translate(60, 160)">
                  <path d="M 30 10 A 25 25 0 1 1 10 35" stroke="#20594B" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <polygon points="32,2 38,12 26,14" fill="#20594B" />
                </g>
                <text x="200" y="225" textAnchor="middle" fill="#243A32" fontSize="12" fontWeight="600" fontFamily="DM Sans">Worn with Pride</text>
              </g>
            )}
          </g>
        )}

        {/* SMARTPHONE SCENES */}
        {objectId === 'smartphone' && (
          <g className="transition-all duration-500">
            {stageNumber === 1 && (
              // Stage 1: Earth Strata & Rare Mineral Crystals
              <g>
                {/* Geological rock strata layers */}
                <path d="M 0 60 Q 150 75 400 50 L 400 130 Q 200 150 0 120 Z" fill="#E6DFD5" />
                <path d="M 0 120 Q 200 150 400 130 L 400 210 Q 180 230 0 200 Z" fill="#D8CFBE" />
                <path d="M 0 200 Q 180 230 400 210 L 400 300 L 0 300 Z" fill="#C5B9A4" />
                {/* Copper Crystal */}
                <polygon points="120,90 145,70 160,110 130,125" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />
                {/* Lithium Salt block */}
                <polygon points="210,135 240,120 260,150 230,170" fill="#E0E7FF" stroke="#3A7469" strokeWidth="1.5" />
                {/* Gold nugget */}
                <polygon points="150,180 180,165 195,195 165,215" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
                {/* Cobalt shard */}
                <polygon points="270,180 300,165 315,200 280,215" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />
                <text x="200" y="275" textAnchor="middle" fill="#243A32" fontSize="13" fontWeight="600">Over 30 Mined Elements</text>
              </g>
            )}

            {stageNumber === 2 && (
              // Stage 2: Silicon Wafer & Photolithography
              <g>
                {/* Circular Silicon Wafer */}
                <circle cx="200" cy="140" r="105" fill="#1E293B" stroke="#3A7469" strokeWidth="2.5" />
                {/* Wafer Grid of Microchips */}
                <g stroke="#3A7469" strokeWidth="1" opacity="0.6">
                  {[-70, -40, -10, 20, 50, 70].map((offset) => (
                    <React.Fragment key={offset}>
                      <line x1={200 + offset} y1="45" x2={200 + offset} y2="235" />
                      <line x1="105" y1={140 + offset} x2="295" y2={140 + offset} />
                    </React.Fragment>
                  ))}
                </g>
                {/* Laser UV light ray */}
                <path d="M 330 30 L 220 120" stroke="#38BDF8" strokeWidth="3" strokeDasharray="4 2" />
                <circle cx="220" cy="120" r="8" fill="#38BDF8" opacity="0.7" />
                <text x="200" y="280" textAnchor="middle" fill="#243A32" fontSize="12" fontWeight="600">Nanometer Precision Assembly</text>
              </g>
            )}

            {stageNumber === 3 && (
              // Stage 3: Glowing Handheld Phone with Bumper Case
              <g>
                {/* Handheld Smartphone */}
                <rect x="145" y="40" width="110" height="210" rx="18" fill="#0F172A" stroke="#3A7469" strokeWidth="3" />
                {/* Screen area */}
                <rect x="153" y="55" width="94" height="180" rx="10" fill="#1E293B" />
                {/* Speaker Notch */}
                <rect x="185" y="47" width="30" height="4" rx="2" fill="#64748B" />
                {/* Screen Wallpaper / UI */}
                <circle cx="200" cy="115" r="28" fill="#3A7469" opacity="0.4" />
                <rect x="170" y="160" width="60" height="8" rx="4" fill="#94A3B8" opacity="0.6" />
                <rect x="180" y="175" width="40" height="6" rx="3" fill="#94A3B8" opacity="0.4" />
                {/* Battery health ring */}
                <g transform="translate(180, 195)">
                  <rect x="0" y="0" width="40" height="18" rx="4" fill="#086E64" />
                  <rect x="40" y="5" width="3" height="8" rx="1" fill="#086E64" />
                  <text x="20" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">80%</text>
                </g>
                {/* Protective bumper case halo */}
                <rect x="140" y="35" width="120" height="220" rx="22" stroke="#C53B27" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
                <text x="200" y="282" textAnchor="middle" fill="#243A32" fontSize="12" fontWeight="600">Shielded & Maintained</text>
              </g>
            )}

            {stageNumber === 4 && (
              // Stage 4: Forgotten Drawer E-Waste Scrap
              <g>
                {/* Open desk drawer */}
                <rect x="80" y="110" width="240" height="130" rx="4" fill="#D4C8B8" stroke="#8C7D6B" strokeWidth="2.5" />
                <rect x="100" y="80" width="200" height="30" fill="#BFAF9B" stroke="#8C7D6B" strokeWidth="2" />
                <circle cx="200" cy="180" r="10" fill="#8C7D6B" />
                {/* Tangled legacy cables */}
                <path d="M 110 140 Q 150 170 170 130 T 220 160 T 270 135" stroke="#243A32" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 130 160 Q 190 120 230 175" stroke="#64748B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* Old scratched phone */}
                <rect x="170" y="125" width="60" height="90" rx="6" transform="rotate(15 170 125)" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
                <text x="200" y="275" textAnchor="middle" fill="#243A32" fontSize="12" fontWeight="600">Forgotten in 250M+ Drawers</text>
              </g>
            )}

            {stageNumber === 5 && (
              // Stage 5: Modular Repair & Urban Mining
              <g>
                {/* Modular Phone exploded view */}
                <rect x="120" y="60" width="75" height="130" rx="10" fill="#1E293B" stroke="#2840DE" strokeWidth="2" />
                {/* Detached Battery module */}
                <rect x="225" y="80" width="55" height="90" rx="6" fill="#086E64" stroke="#243A32" strokeWidth="2" />
                <text x="252" y="130" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">BATTERY</text>
                {/* Screwdriver */}
                <path d="M 290 40 L 260 80" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
                <path d="M 260 80 L 255 86" stroke="#71717A" strokeWidth="3" strokeLinecap="round" />
                {/* Connecting arrows */}
                <path d="M 200 125 L 220 125" stroke="#086E64" strokeWidth="2.5" strokeDasharray="3 3" />
                <text x="200" y="250" textAnchor="middle" fill="#086E64" fontSize="14" fontWeight="bold">Right to Repair & Modularity</text>
              </g>
            )}
          </g>
        )}

        {/* FOOD (APPLE) SCENES */}
        {objectId === 'food' && (
          <g className="transition-all duration-500">
            {stageNumber === 1 && (
              // Stage 1: Orchard Blossom & Honeybee
              <g>
                {/* Orchard branch */}
                <path d="M 40 220 Q 150 160 360 140" stroke="#6B4423" strokeWidth="8" strokeLinecap="round" />
                <path d="M 180 160 Q 230 110 270 90" stroke="#6B4423" strokeWidth="5" strokeLinecap="round" />
                {/* Green leaves */}
                <path d="M 160 140 Q 140 100 170 85 Q 190 115 160 140 Z" fill="#4ADE80" stroke="#22C55E" strokeWidth="1.5" />
                <path d="M 250 100 Q 280 70 295 95 Q 275 125 250 100 Z" fill="#4ADE80" stroke="#22C55E" strokeWidth="1.5" />
                {/* Blossom Petals */}
                <g transform="translate(225, 120)">
                  {[0, 72, 144, 216, 288].map((angle) => (
                    <ellipse key={angle} cx="0" cy="-18" rx="10" ry="16" transform={`rotate(${angle})`} fill="#FDF2F8" stroke="#F472B6" strokeWidth="1" />
                  ))}
                  <circle cx="0" cy="0" r="9" fill="#F59E0B" />
                </g>
                {/* Honeybee */}
                <g transform="translate(150, 70)">
                  <ellipse cx="15" cy="15" rx="14" ry="9" fill="#FBBF24" stroke="#243A32" strokeWidth="1.5" />
                  <line x1="12" y1="6" x2="12" y2="24" stroke="#243A32" strokeWidth="2" />
                  <line x1="18" y1="6" x2="18" y2="24" stroke="#243A32" strokeWidth="2" />
                  <ellipse cx="12" cy="5" rx="8" ry="5" fill="#E0F2FE" opacity="0.7" />
                </g>
                <text x="200" y="275" textAnchor="middle" fill="#243A32" fontSize="13" fontWeight="600">Blossoms, Sunlight, & Bees</text>
              </g>
            )}

            {stageNumber === 2 && (
              // Stage 2: Harvested Wooden Crate & Cold Storage
              <g>
                {/* Wooden harvest crate */}
                <rect x="110" y="110" width="180" height="110" rx="4" fill="#D2996E" stroke="#8B5A2B" strokeWidth="2.5" />
                <line x1="110" y1="145" x2="290" y2="145" stroke="#8B5A2B" strokeWidth="2" />
                <line x1="110" y1="180" x2="290" y2="180" stroke="#8B5A2B" strokeWidth="2" />
                {/* Apples nested in crate */}
                <circle cx="150" cy="120" r="24" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
                <circle cx="190" cy="115" r="24" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
                <circle cx="230" cy="118" r="24" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
                <circle cx="265" cy="122" r="22" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
                {/* Refrigeration mist vapor */}
                <path d="M 90 80 Q 140 60 190 80 Q 240 100 290 75" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 3" opacity="0.7" fill="none" />
                <text x="200" y="270" textAnchor="middle" fill="#243A32" fontSize="12" fontWeight="600">Controlled Atmosphere Cold Chain</text>
              </g>
            )}

            {stageNumber === 3 && (
              // Stage 3: Fresh Apple on Counter with Crisper Tip
              <g>
                {/* Cutting board */}
                <rect x="90" y="160" width="220" height="70" rx="10" fill="#E2BA84" stroke="#A86B32" strokeWidth="2" />
                {/* Plump Crisp Apple */}
                <g transform="translate(170, 75)">
                  {/* Stem & Leaf */}
                  <path d="M 30 18 Q 38 5 44 2" stroke="#6B4423" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 34 10 Q 52 2 56 16 Q 44 20 34 10 Z" fill="#22C55E" />
                  {/* Apple Body */}
                  <path
                    d="M 30 20 C 15 20, 0 35, 0 65 C 0 95, 20 115, 30 115 C 40 115, 60 95, 60 65 C 60 35, 45 20, 30 20 Z"
                    fill="#EF4444"
                    stroke="#991B1B"
                    strokeWidth="2.5"
                  />
                  {/* Highlight shine */}
                  <ellipse cx="18" cy="45" rx="5" ry="12" transform="rotate(-20 18 45)" fill="#FEE2E2" opacity="0.6" />
                </g>
                <text x="200" y="275" textAnchor="middle" fill="#243A32" fontSize="12" fontWeight="600">Keep in Crisper: Lasts 6x Longer</text>
              </g>
            )}

            {stageNumber === 4 && (
              // Stage 4: Landfill Plastic Bag & Methane Gas
              <g>
                {/* Black trash bag silhouette */}
                <path
                  d="M 120 140 C 140 110, 260 110, 280 140 C 290 170, 290 230, 260 250 C 230 260, 170 260, 140 250 C 110 230, 110 170, 120 140 Z"
                  fill="#334155"
                  stroke="#1E293B"
                  strokeWidth="2"
                />
                <circle cx="200" cy="120" r="12" fill="#E2E8F0" />
                {/* Anaerobic gas cloud */}
                <path d="M 180 80 Q 200 60 220 75 Q 240 60 250 80" stroke="#B45309" strokeWidth="2.5" strokeDasharray="3 3" fill="none" />
                <text x="200" y="55" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="bold">CH₄ Methane Gas</text>
                <text x="200" y="280" textAnchor="middle" fill="#243A32" fontSize="12" fontWeight="600">Anaerobic Decomposition in Landfills</text>
              </g>
            )}

            {stageNumber === 5 && (
              // Stage 5: Soil, Earthworms, & Seedling Compost
              <g>
                {/* Rich compost mound */}
                <path d="M 50 250 Q 200 180 350 250 L 350 300 L 50 300 Z" fill="#45270F" />
                {/* Earthworm */}
                <path d="M 110 260 Q 130 245 150 260 T 180 255" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" fill="none" />
                {/* Emerging Green Seedling */}
                <path d="M 200 205 L 200 145" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 200 155 Q 170 140 175 120 Q 195 130 200 155 Z" fill="#22C55E" />
                <path d="M 200 145 Q 230 130 225 110 Q 205 120 200 145 Z" fill="#22C55E" />
                <text x="200" y="95" textAnchor="middle" fill="#086E64" fontSize="14" fontWeight="bold">Nutrient Humus Back to Soil</text>
              </g>
            )}
          </g>
        )}

        {/* DELIVERY PACKAGE SCENES */}
        {objectId === 'package' && (
          <g className="transition-all duration-500">
            {stageNumber === 1 && (
              // Stage 1: Pine Forest & Pulp Slurry
              <g>
                {/* Pine Trees */}
                <g transform="translate(100, 70)">
                  <polygon points="40,20 15,70 65,70" fill="#15803D" />
                  <polygon points="40,50 10,110 70,110" fill="#166534" />
                  <polygon points="40,90 5,160 75,160" fill="#14532D" />
                  <rect x="34" y="160" width="12" height="30" fill="#78350F" />
                </g>
                <g transform="translate(190, 90)">
                  <polygon points="35,15 15,60 55,60" fill="#166534" />
                  <polygon points="35,45 10,100 60,100" fill="#14532D" />
                  <rect x="30" y="100" width="10" height="25" fill="#78350F" />
                </g>
                {/* Recycled paper hydro-pulper vat */}
                <ellipse cx="300" cy="200" rx="55" ry="25" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
                <path d="M 245 200 L 245 250 C 245 265, 355 265, 355 250 L 355 200" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
                <text x="200" y="280" textAnchor="middle" fill="#243A32" fontSize="12" fontWeight="600">Softwood Cellulose & Recycled Bales</text>
              </g>
            )}

            {stageNumber === 2 && (
              // Stage 2: Architectural Fluting Corrugation
              <g>
                {/* Top Linerboard */}
                <rect x="60" y="90" width="280" height="12" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
                {/* Undulating Corrugated Arch Flute */}
                <path
                  d="M 60 140 
                     Q 75 102 90 140 
                     Q 105 178 120 140 
                     Q 135 102 150 140 
                     Q 165 178 180 140 
                     Q 195 102 210 140 
                     Q 225 178 240 140 
                     Q 255 102 270 140 
                     Q 285 178 300 140 
                     Q 315 102 330 140"
                  stroke="#B45309"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Bottom Linerboard */}
                <rect x="60" y="178" width="280" height="12" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
                <text x="200" y="240" textAnchor="middle" fill="#243A32" fontSize="13" fontWeight="bold">The Gothic Arch of Packaging</text>
                <text x="200" y="260" textAnchor="middle" fill="#6B7280" fontSize="11">Maximum strength with minimal wood mass</text>
              </g>
            )}

            {stageNumber === 3 && (
              // Stage 3: Sturdy Box on Front Porch
              <g>
                {/* Isometric Cardboard Delivery Box */}
                <g transform="translate(140, 80)">
                  {/* Top Flap Left */}
                  <polygon points="60,0 0,35 60,70 120,35" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
                  {/* Left Side */}
                  <polygon points="0,35 60,70 60,140 0,105" fill="#D97706" stroke="#92400E" strokeWidth="2" />
                  {/* Right Side */}
                  <polygon points="60,70 120,35 120,105 60,140" fill="#B45309" stroke="#92400E" strokeWidth="2" />
                  {/* Paper Tape */}
                  <polygon points="50,6 70,18 70,82 50,70" fill="#FEF3C7" opacity="0.8" />
                  {/* Shipping Barcode */}
                  <rect x="75" y="75" width="28" height="16" fill="#FFFFFF" rx="1" />
                  <line x1="79" y1="78" x2="79" y2="88" stroke="#000" strokeWidth="1.5" />
                  <line x1="83" y1="78" x2="83" y2="88" stroke="#000" strokeWidth="2" />
                  <line x1="88" y1="78" x2="88" y2="88" stroke="#000" strokeWidth="1" />
                  <line x1="93" y1="78" x2="93" y2="88" stroke="#000" strokeWidth="2" />
                </g>
                <text x="200" y="265" textAnchor="middle" fill="#243A32" fontSize="12" fontWeight="600">48 Hours in Active Transit</text>
              </g>
            )}

            {stageNumber === 4 && (
              // Stage 4: Crushed & Plastic-Contaminated
              <g>
                {/* Crushed warped box */}
                <polygon points="110,180 180,140 280,170 230,230 130,220" fill="#D97706" stroke="#92400E" strokeWidth="2" />
                {/* Tangled plastic bubble wrap / tape */}
                <path d="M 140 160 Q 210 130 250 180" stroke="#38BDF8" strokeWidth="8" opacity="0.6" strokeLinecap="round" />
                <path d="M 160 190 Q 200 150 240 210" stroke="#38BDF8" strokeWidth="6" opacity="0.6" strokeLinecap="round" />
                {/* Empty air warning */}
                <g transform="translate(110, 70)">
                  <rect x="0" y="0" width="180" height="40" rx="8" fill="#FFF0EE" stroke="#C53B27" strokeWidth="1.5" />
                  <text x="90" y="24" textAnchor="middle" fill="#C53B27" fontSize="12" fontWeight="bold">Unflattened = 80% Empty Air</text>
                </g>
              </g>
            )}

            {stageNumber === 5 && (
              // Stage 5: Neatly Flattened & Repulped
              <g>
                {/* Neatly flattened folded cardboard bundle */}
                <polygon points="120,110 280,110 260,170 100,170" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
                <polygon points="120,125 280,125 260,185 100,185" fill="#D97706" stroke="#92400E" strokeWidth="2" />
                <polygon points="120,140 280,140 260,200 100,200" fill="#B45309" stroke="#92400E" strokeWidth="2" />
                {/* Twine tie */}
                <line x1="190" y1="100" x2="170" y2="210" stroke="#FEF3C7" strokeWidth="3" />
                <line x1="210" y1="100" x2="190" y2="210" stroke="#FEF3C7" strokeWidth="3" />
                {/* Clean Loop badge */}
                <text x="200" y="255" textAnchor="middle" fill="#086E64" fontSize="14" fontWeight="bold">Repulped Up to 7 Times</text>
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Stage Indicator Mini Badge */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-surface/90 backdrop-blur-sm border border-ink/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-semibold tracking-wide text-ink z-10">
        Stage {stageNumber} of 5
      </div>
    </div>
  );
};
