import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

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
    circularBenefit: 'Keeping a useful object in service can reduce demand for a replacement. The benefit depends on the product, maintenance, and how it is used.'
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
    <section id="bigger-pattern" className="scroll-mt-20 py-16 lg:py-24 bg-paper border-b border-ink/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="section-kicker text-forest mb-2">
            <span>THE SYSTEMIC SHIFT</span>
            <span aria-hidden="true">·</span>
            <span>REVEAL THE BIGGER PATTERN</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-ink font-normal leading-tight text-balance">
            We usually notice waste at the end.
          </h2>
          <p className="mt-3 text-lg text-ink/80 font-normal leading-relaxed">
            Most environmental conversations focus on the trash can. But what if the story could change much earlier?
          </p>
        </div>

        {/* Interactive Model Toggle */}
        <div className="bg-surface rounded-3xl border border-ink/10 p-4 sm:p-7 lg:p-10 shadow-sm mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-ink/8">
            <div>
              <span className="text-xs font-semibold text-ink/75 uppercase tracking-wider block">
                Interactive Model Inspector
              </span>
              <p className="font-editorial text-xl sm:text-2xl text-ink font-semibold mt-0.5">
                {activeModel === 'linear' ? 'The Linear Highway (Take → Throw)' : 'A Better Next Turn (Curiosity & Care)'}
              </p>
            </div>

            {/* Segmented Controller (Full width responsive grid on mobile, inline-flex on sm+) */}
            <div
              role="group"
              aria-label="Economic model comparison"
              className="w-full lg:w-auto grid grid-cols-1 min-[400px]:grid-cols-2 lg:inline-flex p-1 bg-paper border border-ink/15 rounded-xl"
            >
              <button
                type="button"
                id="tab-linear"
                aria-pressed={activeModel === 'linear'}
                aria-controls="model-panel"
                onClick={() => setActiveModel('linear')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer text-center whitespace-normal lg:whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink focus:outline-none ${
                  activeModel === 'linear'
                    ? 'bg-forest text-white shadow-xs'
                    : 'text-ink/80 hover:text-ink'
                }`}
              >
                Linear: Take → Throw
              </button>
              <button
                type="button"
                id="tab-circular"
                aria-pressed={activeModel === 'circular'}
                aria-controls="model-panel"
                onClick={() => setActiveModel('circular')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer text-center whitespace-normal lg:whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink focus:outline-none ${
                  activeModel === 'circular'
                    ? 'bg-forest text-white shadow-xs'
                    : 'text-ink/80 hover:text-ink'
                }`}
              >
                A Better Next Turn
              </button>
            </div>
          </div>

          {/* Visual Diagram Strip */}
          <div className="mb-10" id="model-panel" role="region" aria-labelledby={activeModel === 'linear' ? 'tab-linear' : 'tab-circular'}>
            <div role="group" aria-label="Lifecycle stages" className="grid grid-cols-1 md:grid-cols-5 gap-2.5 lg:gap-3">
              {COMPARISON_STAGES.map((item, idx) => {
                const isSelected = selectedStepIndex === idx;
                const isLinear = activeModel === 'linear';
                return (
                  <button
                    key={item.step}
                    type="button"
                    id={`step-tab-${item.step}`}
                    aria-pressed={isSelected}
                    aria-controls="step-detail-panel"
                    aria-label={`Step ${item.step}: ${isLinear ? item.linearName : item.circularName}`}
                    onClick={() => setSelectedStepIndex(idx)}
                    className={`flex flex-col items-start justify-start p-3.5 sm:p-4 min-h-[44px] rounded-xl sm:rounded-2xl text-left border transition-all cursor-pointer relative focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink focus:outline-none ${
                      isSelected
                        ? isLinear
                          ? 'bg-clay-tint border-clay shadow-sm ring-1 ring-clay'
                          : 'bg-sage border-forest shadow-sm ring-1 ring-forest'
                        : 'bg-paper border-ink/15 hover:border-ink/40'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-ink/75">
                        {item.step}
                      </span>
                      {isSelected && (
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: isLinear ? 'var(--color-clay)' : 'var(--color-forest)' }}
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <h3 className="font-editorial text-sm sm:text-base font-semibold text-ink mb-1">
                      {isLinear ? item.linearName.split(' ')[0] : item.circularName.split(' ')[0]}
                    </h3>
                    <p className="text-xs text-ink/75 line-clamp-2">
                      {isLinear ? item.linearName : item.circularName}
                    </p>

                    {/* Step indicator arrow for desktop */}
                    {idx < 4 && (
                      <div className="hidden lg:flex items-center justify-center absolute left-[calc(100%+0.375rem)] top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-ink/40 pointer-events-none" aria-hidden="true">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deep Dive Card for Selected Step */}
          <div id="step-detail-panel" role="region" aria-labelledby={`step-tab-${activeStep.step}`} className="p-4 sm:p-6 lg:p-8 rounded-2xl bg-paper border border-ink/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: What Happens Here */}
              <div className="lg:col-span-12 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-ink/75">
                  <span>STEP {activeStep.step} OF 05</span>
                  <span aria-hidden="true">·</span>
                  <span className={activeModel === 'linear' ? 'text-clay' : 'text-forest'}>
                    {activeModel === 'linear' ? activeStep.linearName : activeStep.circularName}
                  </span>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-ink">
                  {activeModel === 'linear' ? activeStep.linearName : activeStep.circularName}
                </h3>

                <p className="text-base text-ink/85 leading-relaxed">
                  {activeModel === 'linear' ? activeStep.linearDesc : activeStep.circularDesc}
                </p>

                <div
                  className="p-4 rounded-xl border"
                  style={{
                    backgroundColor: activeModel === 'linear' ? 'var(--color-clay-tint)' : 'var(--color-sage)',
                    borderColor: activeModel === 'linear' ? 'var(--color-clay-border)' : 'var(--color-sage-border)'
                  }}
                >
                  <p className="text-xs sm:text-sm font-medium text-ink">
                    {activeModel === 'linear' ? (
                      <>
                        <strong className="text-clay">System Cost: </strong>
                        {activeStep.linearImpact}
                      </>
                    ) : (
                      <>
                        <strong className="text-forest">Circularity Advantage: </strong>
                        {activeStep.circularBenefit}
                      </>
                    )}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Central Editorial Insight: "Not a perfect circle. A better next turn." */}
          <div className="mt-8 pt-8 border-t border-ink/8 text-center max-w-2xl mx-auto space-y-3">
            <h3 className="font-editorial text-2xl sm:text-3xl text-ink font-semibold">
              “Not a perfect circle. A better next turn.”
            </h3>
            <p className="text-sm text-ink/75 leading-relaxed">
              Avoiding unnecessary purchases and keeping useful items in use can reduce demand for new materials. Repair and maintenance also use resources; recycling remains important when reuse is no longer practical.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
