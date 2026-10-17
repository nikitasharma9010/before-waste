import { handleRadioKeyDown } from '../utils/selectionKeyboard';
import React, { useState } from 'react';
import { SCENARIOS_DATA, Scenario, ScenarioOption } from '../data/scenariosData';
import { Headphones, Shirt, CheckCircle, Lightbulb } from 'lucide-react';

export const WhatWouldYouDo: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('headphones');
  const [selectedOptionId, setSelectedOptionId] = useState<string>('repair');

  const currentScenario: Scenario =
    SCENARIOS_DATA.find((s) => s.id === activeScenarioId) || SCENARIOS_DATA[0];

  const selectedOption: ScenarioOption =
    currentScenario.options.find((opt) => opt.id === selectedOptionId) ||
    currentScenario.options[1];

  const handleScenarioChange = (id: string) => {
    setActiveScenarioId(id);
    const newScenario = SCENARIOS_DATA.find((s) => s.id === id) || SCENARIOS_DATA[0];
    setSelectedOptionId(newScenario.options[1].id);
  };

  return (
    <section id="what-would-you-do" className="scroll-mt-20 py-16 lg:py-24 bg-white border-b border-[#202A35]/8">
      {/* Live announcement region for scenario choices */}
      <div role="status" aria-live="polite" className="sr-only">
        Scenario option selected: {selectedOption.label}. {selectedOption.nuanceTitle}.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="section-kicker text-[#086E64] mb-2">
            <span>A PLAYFUL MOMENT</span>
            <span aria-hidden="true">·</span>
            <span>WHAT WOULD YOU DO?</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#202A35] font-normal leading-tight text-balance">
            Real life happens. How do you respond?
          </h2>
          <p className="mt-3 text-base text-[#202A35]/80 leading-relaxed">
            There are no &quot;good&quot; or &quot;bad&quot; scores here. The right choice depends on product design, cost, safety, and circumstances.
          </p>
        </div>

        {/* Scenario selection buttons */}
        <div role="group" aria-label="Select a scenario" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-8">
          <button
            type="button"
            id="tab-scenario-headphones"
            aria-pressed={activeScenarioId === 'headphones'}
            aria-controls="scenario-content-panel"
            onClick={() => handleScenarioChange('headphones')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#202A35] focus:outline-none ${
              activeScenarioId === 'headphones'
                ? 'bg-[#202A35] text-white shadow-xs'
                : 'bg-[#FFF9F0] text-[#202A35] hover:bg-[#202A35]/5 border border-[#202A35]/15'
            }`}
          >
            <Headphones className="w-4 h-4" aria-hidden="true" />
            <span>Scenario 1: Silent Headphones</span>
          </button>
          <button
            type="button"
            id="tab-scenario-jacket"
            aria-pressed={activeScenarioId === 'jacket'}
            aria-controls="scenario-content-panel"
            onClick={() => handleScenarioChange('jacket')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#202A35] focus:outline-none ${
              activeScenarioId === 'jacket'
                ? 'bg-[#202A35] text-white shadow-xs'
                : 'bg-[#FFF9F0] text-[#202A35] hover:bg-[#202A35]/5 border border-[#202A35]/15'
            }`}
          >
            <Shirt className="w-4 h-4" aria-hidden="true" />
            <span>Scenario 2: Missing Coat Button</span>
          </button>
        </div>

        {/* Scenario Box */}
        <div
          id="scenario-content-panel"
          role="region"
          aria-labelledby={activeScenarioId === 'headphones' ? 'tab-scenario-headphones' : 'tab-scenario-jacket'}
          className="bg-[#FFF9F0] rounded-3xl border border-[#202A35]/10 p-4 sm:p-7 lg:p-10 shadow-sm"
        >
          {/* Prompt banner */}
          <div className="mb-8">
            <span className="text-xs font-semibold text-[#086E64] uppercase tracking-wider block mb-1">
              {currentScenario.title}
            </span>
            <h3 id="scenario-prompt-title" className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-[#202A35] font-semibold leading-snug">
              &ldquo;{currentScenario.prompt}&rdquo;
            </h3>
            <p className="text-sm sm:text-base text-[#202A35]/75 mt-2">
              {currentScenario.context}
            </p>
          </div>

          {/* Three Choice Cards (role=radiogroup) */}
          <div
            role="radiogroup"
            onKeyDown={handleRadioKeyDown}
            aria-labelledby="scenario-prompt-title"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {currentScenario.options.map((opt) => {
              const isSelected = opt.id === selectedOptionId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-5 min-h-[44px] rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#086E64] focus:outline-none ${
                    isSelected
                      ? 'bg-white border-[#086E64] ring-2 ring-[#086E64]/20 shadow-sm scale-[1.01]'
                      : 'bg-white/70 border-[#202A35]/15 hover:border-[#202A35]/35 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#202A35]/75">
                        Choice
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#086E64] text-white flex items-center justify-center">
                          <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-editorial text-lg font-semibold text-[#202A35] mb-1.5">
                      {opt.label}
                    </h4>
                    <p className="text-xs text-[#202A35]/75 leading-relaxed">
                      {opt.actionSummary}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#086E64] mt-4 block">
                    {isSelected ? 'Viewing Perspective ↓' : 'Click to explore →'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Nuanced, Compassionate Feedback Card */}
          <div className="p-4 sm:p-6 lg:p-8 rounded-2xl bg-white border border-[#202A35]/15 shadow-2xs animate-in fade-in duration-200">
            <div className="section-kicker text-[#086E64] mb-2">
              <Lightbulb className="w-4 h-4 text-[#086E64]" aria-hidden="true" />
              <span>A COMPASSIONATE PERSPECTIVE</span>
            </div>

            <h4 className="font-editorial text-2xl font-semibold text-[#202A35] mb-3">
              {selectedOption.nuanceTitle}
            </h4>

            <p className="text-base text-[#202A35]/85 leading-relaxed mb-4">
              {selectedOption.nuanceBody}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#202A35]/10">
              <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#202A35]/10">
                <span className="text-xs font-semibold text-[#202A35]/70 uppercase tracking-wider block mb-1">
                  Helpful Context
                </span>
                <p className="text-xs sm:text-sm text-[#202A35]/85 leading-relaxed">
                  {selectedOption.practicalInsight}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#E6F8F6] border border-[#B2ECE6]">
                <span className="text-xs font-semibold text-[#086E64] uppercase tracking-wider block mb-1">
                  Practical Tip
                </span>
                <p className="text-xs sm:text-sm text-[#202A35]/90 leading-relaxed">
                  {selectedOption.nextStepSuggestion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
