import React, { useState } from 'react';
import {
  ArrowRight,
  RotateCw,
  Repeat,
  Sparkles,
  Layers,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface StageComparison {
  step: string;
  linearName: string;
  linearDesc: string;
  linearImpact: string;
  circularName: string;
  circularDesc: string;
  circularBenefit: string;
}

const COMPARISON_STAGES: StageComparison[] = [
  {
    step: '01',
    linearName: 'TAKE (Extraction)',
    linearDesc: 'Mining ores, felling timber, pumping petroleum, and diverting rivers for raw virgin feedstocks.',
    linearImpact: 'High planetary extraction pressure and ecosystem disruption.',
    circularName: 'RETHINK & PAUSE',
    circularDesc: 'Questioning if brand new extraction is required. Exploring secondhand, borrowing, or modular durable goods.',
    circularBenefit: 'Reduces virgin extraction right at the roots—the most effective intervention point.'
  },
  {
    step: '02',
    linearName: 'MAKE (Production)',
    linearDesc: 'Designing for rapid factory throughput, often gluing components permanently and prioritizing low unit costs.',
    linearImpact: 'Planned obsolescence and difficult disassembly down the line.',
    circularName: 'DESIGN FOR REPAIR',
    circularDesc: 'Designing with standard screws, modular batteries, easily accessible spare parts, and non-toxic dyes.',
    circularBenefit: 'Keeps products fixable for decades instead of disposable in months.'
  },
  {
    step: '03',
    linearName: 'BUY (Acquisition)',
    linearDesc: 'Flash discounts, instant dopamine clicks, and accumulating single-use items meant to be forgotten.',
    linearImpact: 'Cluttered homes and rapid turnover of functional possessions.',
    circularName: 'CHOOSE THOUGHTFULLY',
    circularDesc: 'Investing in pieces meant to be loved, shared with friends, rented for rare jobs, or bought pre-loved.',
    circularBenefit: 'Supports ethical craftsmanship and reduces personal clutter.'
  },
  {
    step: '04',
    linearName: 'USE (Consumption)',
    linearDesc: 'Quickly discarding at the first sign of cosmetic wear, a dull blade, or a drained battery.',
    linearImpact: 'Average product lifespan drops year after year.',
    circularName: 'CARE & EXTEND',
    circularDesc: 'Washing cold, gentle maintenance, patching torn pockets, sharpening knives, and replacing worn ear pads.',
    circularBenefit: 'Extending useful life by just one year reduces an object\'s footprint by up to 30%.'
  },
  {
    step: '05',
    linearName: 'THROW (Disposal)',
    linearDesc: 'Consigning complex blended materials into plastic bags destined for landfill pits or municipal incinerators.',
    linearImpact: 'Methane leakage, lost mineral wealth, and micro-plastic pollution.',
    circularName: 'RECOVER & REGENERATE',
    circularDesc: 'High-quality recycling, clean paper repulping, backyard composting, and textile insulation recycling.',
    circularBenefit: 'Materials safely feed the next cycle, closing the loop with dignity.'
  }
];

export const BiggerPattern: React.FC = () => {
  const [activeModel, setActiveModel] = useState<'linear' | 'circular'>('circular');
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);

  const activeStep = COMPARISON_STAGES[selectedStepIndex];

  return (
    <section id="bigger-pattern" className="py-16 lg:py-24 bg-[#FFF9F0] border-b border-[#202A35]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#425BFF] mb-2">
            <span>THE SYSTEMIC SHIFT</span>
            <span aria-hidden="true">·</span>
            <span>REVEAL THE BIGGER PATTERN</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#202A35] font-normal leading-tight text-balance">
            We usually notice waste at the end.
          </h2>
          <p className="mt-3 text-lg text-[#202A35]/80 font-normal leading-relaxed">
            Most environmental conversations focus on the trash can. But what if the story could change much earlier?
          </p>
        </div>

        {/* Interactive Model Toggle */}
        <div className="bg-white rounded-3xl border border-[#202A35]/10 p-6 sm:p-8 lg:p-10 shadow-sm mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#202A35]/8">
            <div>
              <span className="text-xs font-semibold text-[#202A35]/60 uppercase tracking-wider block">
                Interactive Model Inspector
              </span>
              <p className="font-editorial text-xl sm:text-2xl text-[#202A35] font-semibold mt-0.5">
                {activeModel === 'linear' ? 'The Linear Highway (Take → Throw)' : 'A Better Next Turn (Curiosity & Care)'}
              </p>
            </div>

            {/* Segmented Controller */}
            <div className="inline-flex p-1 bg-[#FFF9F0] border border-[#202A35]/10 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setActiveModel('linear')}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeModel === 'linear'
                    ? 'bg-[#202A35] text-white shadow-xs'
                    : 'text-[#202A35]/70 hover:text-[#202A35]'
                }`}
              >
                Linear: Take → Throw
              </button>
              <button
                onClick={() => setActiveModel('circular')}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeModel === 'circular'
                    ? 'bg-[#425BFF] text-white shadow-xs'
                    : 'text-[#202A35]/70 hover:text-[#202A35]'
                }`}
              >
                A Better Next Turn
              </button>
            </div>
          </div>

          {/* Visual Diagram Strip */}
          <div className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {COMPARISON_STAGES.map((item, idx) => {
                const isSelected = selectedStepIndex === idx;
                const isLinear = activeModel === 'linear';
                return (
                  <button
                    key={item.step}
                    onClick={() => setSelectedStepIndex(idx)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative ${
                      isSelected
                        ? isLinear
                          ? 'bg-[#FFF0EE] border-[#FF654F] shadow-sm ring-1 ring-[#FF654F]'
                          : 'bg-[#EEF1FF] border-[#425BFF] shadow-sm ring-1 ring-[#425BFF]'
                        : 'bg-[#FFF9F0] border-[#202A35]/10 hover:border-[#202A35]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-[#202A35]/50">
                        {item.step}
                      </span>
                      {isSelected && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: isLinear ? '#FF654F' : '#425BFF' }}
                        />
                      )}
                    </div>

                    <h4 className="font-editorial text-base font-semibold text-[#202A35] mb-1">
                      {isLinear ? item.linearName.split(' ')[0] : item.circularName.split(' ')[0]}
                    </h4>
                    <p className="text-xs text-[#202A35]/65 line-clamp-2">
                      {isLinear ? item.linearName : item.circularName}
                    </p>

                    {/* Step indicator arrow for desktop */}
                    {idx < 4 && (
                      <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#202A35]/30 pointer-events-none">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deep Dive Card for Selected Step */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFF9F0] border border-[#202A35]/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: What Happens Here */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#202A35]/60">
                  <span>STEP {activeStep.step} OF 05</span>
                  <span aria-hidden="true">·</span>
                  <span className={activeModel === 'linear' ? 'text-[#FF654F]' : 'text-[#425BFF]'}>
                    {activeModel === 'linear' ? activeStep.linearName : activeStep.circularName}
                  </span>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#202A35]">
                  {activeModel === 'linear' ? activeStep.linearName : activeStep.circularName}
                </h3>

                <p className="text-base text-[#202A35]/85 leading-relaxed">
                  {activeModel === 'linear' ? activeStep.linearDesc : activeStep.circularDesc}
                </p>

                <div
                  className="p-4 rounded-xl border"
                  style={{
                    backgroundColor: activeModel === 'linear' ? '#FFF0EE' : '#EEF1FF',
                    borderColor: activeModel === 'linear' ? '#FFD6D0' : '#CCD4FF'
                  }}
                >
                  <p className="text-xs sm:text-sm font-medium text-[#202A35]">
                    {activeModel === 'linear' ? (
                      <>
                        <strong className="text-[#FF654F]">System Cost: </strong>
                        {activeStep.linearImpact}
                      </>
                    ) : (
                      <>
                        <strong className="text-[#425BFF]">Circularity Advantage: </strong>
                        {activeStep.circularBenefit}
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Right Column: Comparative Insight */}
              <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#202A35]/8 space-y-3">
                <span className="text-xs font-semibold tracking-wider uppercase text-[#202A35]/50 block">
                  Why Earlier Interventions Matter
                </span>
                <p className="text-xs sm:text-sm text-[#202A35]/75 leading-relaxed">
                  Notice how intervening at Step 01 (asking &quot;Do I need this?&quot;) or Step 04 (caring and repairing) spares 100% of the energy, water, and shipping of the entire sequence.
                </p>
                <div className="pt-2 border-t border-[#202A35]/8 flex items-center justify-between text-xs text-[#202A35]/70">
                  <span>Current active node:</span>
                  <span className="font-mono font-bold text-[#202A35]">
                    {activeStep.step} / 05
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Central Editorial Insight: "Not a perfect circle. A better next turn." */}
          <div className="mt-8 pt-8 border-t border-[#202A35]/8 text-center max-w-2xl mx-auto space-y-3">
            <h3 className="font-editorial text-2xl sm:text-3xl text-[#202A35] font-semibold">
              “Not a perfect circle. A better next turn.”
            </h3>
            <p className="text-sm text-[#202A35]/75 leading-relaxed">
              Recycling remains essential for recovered glass, aluminum, cardboard, and clean polymers. But recycling is like the ambulance at the bottom of the hill: avoiding unnecessary consumption, choosing durable goods, and caring for what we have preserves far more planetary value.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
