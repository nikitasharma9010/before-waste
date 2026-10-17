import React, { useState } from 'react';
import { SCENARIOS_DATA, Scenario, ScenarioOption } from '../data/scenariosData';
import { Headphones, Shirt, CheckCircle, HelpCircle, ArrowRight, Lightbulb } from 'lucide-react';

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
    setSelectedOptionId(newScenario.options[1].id); // default to second option
  };

  return (
    <section id="what-would-you-do" className="py-16 lg:py-24 bg-white border-b border-[#202A35]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#0D9F91] mb-2">
            <span>A PLAYFUL MOMENT</span>
            <span aria-hidden="true">·</span>
            <span>WHAT WOULD YOU DO?</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#202A35] font-normal leading-tight text-balance">
            Real life happens. How do you respond?
          </h2>
          <p className="mt-3 text-base text-[#202A35]/75 leading-relaxed">
            There are no &quot;good&quot; or &quot;bad&quot; scores here. Every choice depends on time, budget, safety, and product design. Let&apos;s explore what options exist when everyday things break.
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => handleScenarioChange('headphones')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeScenarioId === 'headphones'
                ? 'bg-[#202A35] text-white shadow-xs'
                : 'bg-[#FFF9F0] text-[#202A35]/70 hover:bg-[#202A35]/5 border border-[#202A35]/10'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>Scenario 1: Silent Headphones</span>
          </button>
          <button
            onClick={() => handleScenarioChange('jacket')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeScenarioId === 'jacket'
                ? 'bg-[#202A35] text-white shadow-xs'
                : 'bg-[#FFF9F0] text-[#202A35]/70 hover:bg-[#202A35]/5 border border-[#202A35]/10'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Scenario 2: Missing Coat Button</span>
          </button>
        </div>

        {/* Scenario Box */}
        <div className="bg-[#FFF9F0] rounded-3xl border border-[#202A35]/10 p-6 sm:p-8 lg:p-10 shadow-sm">
          {/* Prompt banner */}
          <div className="mb-8">
            <span className="text-xs font-semibold text-[#0D9F91] uppercase tracking-wider block mb-1">
              {currentScenario.title}
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-[#202A35] font-semibold leading-snug">
              &ldquo;{currentScenario.prompt}&rdquo;
            </h3>
            <p className="text-sm sm:text-base text-[#202A35]/70 mt-2">
              {currentScenario.context}
            </p>
          </div>

          {/* Three Choice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {currentScenario.options.map((opt) => {
              const isSelected = opt.id === selectedOptionId;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#0D9F91] ring-2 ring-[#0D9F91]/20 shadow-md scale-[1.01]'
                      : 'bg-white/60 border-[#202A35]/10 hover:border-[#202A35]/30 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#202A35]/50">
                        Option
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#0D9F91] text-white flex items-center justify-center">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-editorial text-lg font-semibold text-[#202A35] mb-1.5">
                      {opt.label}
                    </h4>
                    <p className="text-xs text-[#202A35]/70 leading-relaxed">
                      {opt.actionSummary}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#0D9F91] mt-4 block">
                    {isSelected ? 'Viewing Response ↓' : 'Click to explore →'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Nuanced, Compassionate Feedback Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#202A35]/10 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#0D9F91] mb-2">
              <Lightbulb className="w-4 h-4 text-[#0D9F91]" />
              <span>A COMPASSIONATE PERSPECTIVE</span>
            </div>

            <h4 className="font-editorial text-2xl font-semibold text-[#202A35] mb-3">
              {selectedOption.nuanceTitle}
            </h4>

            <p className="text-base text-[#202A35]/85 leading-relaxed mb-4">
              {selectedOption.nuanceBody}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#202A35]/8">
              <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#202A35]/8">
                <span className="text-xs font-semibold text-[#202A35]/60 uppercase tracking-wider block mb-1">
                  Helpful Context
                </span>
                <p className="text-xs sm:text-sm text-[#202A35]/80 leading-relaxed">
                  {selectedOption.practicalInsight}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#E6F8F6] border border-[#B2ECE6]">
                <span className="text-xs font-semibold text-[#0D9F91] uppercase tracking-wider block mb-1">
                  Practical Tip
                </span>
                <p className="text-xs sm:text-sm text-[#202A35]/85 leading-relaxed">
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
