import React from 'react';
import { OBJECTS_DATA, StoryObject } from '../data/objectsData';
import { StoryVisual } from './StoryVisual';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Compass
} from 'lucide-react';

interface FollowOneThingProps {
  activeObjectId: string;
  currentStageIndex: number;
  onSelectObject: (id: string) => void;
  onSelectStage: (stageIndex: number) => void;
  onNextStage: () => void;
  onPrevStage: () => void;
  onRestartStory: () => void;
}

export const FollowOneThing: React.FC<FollowOneThingProps> = ({
  activeObjectId,
  currentStageIndex,
  onSelectObject,
  onSelectStage,
  onNextStage,
  onPrevStage,
  onRestartStory
}) => {
  const currentObject: StoryObject =
    OBJECTS_DATA.find((obj) => obj.id === activeObjectId) || OBJECTS_DATA[0];

  const currentStage = currentObject.stages[currentStageIndex] || currentObject.stages[0];

  // Accessible button colors with >= 4.5:1 WCAG contrast
  const getButtonStyles = (objId: string) => {
    switch (objId) {
      case 'tshirt':
        return {
          tabActive: 'bg-[#C53B27] text-white shadow-xs',
          nextBtn: 'bg-[#C53B27] hover:bg-[#AB2F1D] text-white',
          indicator: '#C53B27'
        };
      case 'smartphone':
        return {
          tabActive: 'bg-[#2840DE] text-white shadow-xs',
          nextBtn: 'bg-[#2840DE] hover:bg-[#1E32B6] text-white',
          indicator: '#2840DE'
        };
      case 'food':
        return {
          tabActive: 'bg-[#086E64] text-white shadow-xs',
          nextBtn: 'bg-[#086E64] hover:bg-[#06574F] text-white',
          indicator: '#086E64'
        };
      case 'package':
      default:
        return {
          tabActive: 'bg-[#FFC857] text-[#202A35] font-semibold shadow-xs',
          nextBtn: 'bg-[#FFC857] hover:bg-[#EBB442] text-[#202A35] font-semibold',
          indicator: '#B88000'
        };
    }
  };

  const themeStyle = getButtonStyles(currentObject.id);

  return (
    <section id="follow-one-thing" className="scroll-mt-20 py-16 lg:py-24 bg-white border-y border-[#202A35]/8">
      {/* Live Region for Screen Reader Stage Announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        Now viewing {currentObject.name}, Stage {currentStage.stageNumber} of 5: {currentStage.stageName}. {currentStage.stageTitle}.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="section-kicker text-[#C53B27] mb-2">
            <span>SIGNATURE EXPERIENCE</span>
            <span aria-hidden="true">·</span>
            <span>FOLLOW ONE THING</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#202A35] font-normal leading-tight text-balance">
            Every object carries a story before it reaches you.
          </h2>
          <p className="mt-3 text-base text-[#202A35]/80 leading-relaxed">
            Choose an everyday companion and follow its journey—from raw planetary material, through human hands and daily care, to its next possible chapter.
          </p>
        </div>

        {/* Object selection buttons */}
        <div
          role="group"
          aria-label="Select an object to follow"
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8"
        >
          {OBJECTS_DATA.map((obj) => {
            const isActive = obj.id === activeObjectId;
            const objTheme = getButtonStyles(obj.id);
            return (
              <button
                key={obj.id}
                type="button"
                id={`object-tab-${obj.id}`}
                aria-pressed={isActive}
                aria-controls="story-content-panel"
                onClick={() => onSelectObject(obj.id)}
                className={`flex flex-col items-start justify-center gap-1.5 px-3 sm:px-4 py-3 min-h-[76px] min-w-0 rounded-xl font-medium text-sm text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#202A35] focus:outline-none ${
                  isActive
                    ? objTheme.tabActive
                    : 'bg-[#FFF9F0] text-[#202A35] hover:bg-[#202A35]/5 border border-[#202A35]/15'
                }`}
              >
                <span>{obj.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-normal ${
                    isActive
                      ? obj.id === 'package'
                        ? 'bg-black/10 text-[#202A35]'
                        : 'bg-white/20 text-white'
                      : 'bg-black/5 text-[#202A35]/70'
                  }`}
                >
                  {obj.itemType}
                </span>
              </button>
            );
          })}
        </div>

        {/* Story content region */}
        <div
          id="story-content-panel"
          role="region"
          aria-labelledby={`object-tab-${currentObject.id}`}
          className="bg-[#FFF9F0] rounded-3xl border border-[#202A35]/10 p-4 sm:p-7 lg:p-10 shadow-sm"
        >
          {/* Object Tagline & Stage Navigation Bar */}
          <div className="border-b border-[#202A35]/10 pb-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#202A35]">
                  {currentObject.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#202A35]/70 mt-0.5">
                  {currentObject.tagline}
                </p>
              </div>

              {/* Reset to Stage 1 */}
              <button
                type="button"
                onClick={onRestartStory}
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold text-[#202A35]/75 hover:text-[#202A35] hover:bg-white transition-colors self-start sm:self-auto cursor-pointer focus-visible:ring-2 focus-visible:ring-[#202A35]"
                aria-label={`Restart ${currentObject.name} story from stage one`}
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Restart this story</span>
              </button>
            </div>

            {/* Stepper Progress Bar (5 stages) with accessible names */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-3" role="group" aria-label="Story stages">
              {currentObject.stages.map((st, idx) => {
                const isCurrent = idx === currentStageIndex;
                const isCompleted = idx < currentStageIndex;
                return (
                  <button
                    key={st.stageNumber}
                    type="button"
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-label={`Stage ${st.stageNumber}: ${st.stageName} (${st.stageTitle})`}
                    onClick={() => onSelectStage(idx)}
                    className="group text-left p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#202A35] focus:outline-none cursor-pointer min-h-[44px] flex flex-col justify-start"
                  >
                    <div
                      className={`h-2.5 w-full rounded-full transition-all duration-300 mb-2 ${
                        isCurrent
                          ? 'shadow-xs'
                          : isCompleted
                          ? 'opacity-85'
                          : 'bg-[#202A35]/15'
                      }`}
                      style={{
                        backgroundColor:
                          isCurrent || isCompleted ? themeStyle.indicator : undefined
                      }}
                    />
                    <div className="w-full">
                      <span className="text-sm sm:text-xs font-bold block text-[#202A35]/60 group-hover:text-[#202A35] transition-colors">
                        0{st.stageNumber}
                      </span>
                      <span
                        className={`hidden sm:block text-xs leading-snug break-words transition-colors ${
                          isCurrent
                            ? 'font-bold text-[#202A35]'
                            : 'font-medium text-[#202A35]/70 group-hover:text-[#202A35]'
                        }`}
                      >
                        {st.stageName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="sm:hidden text-sm text-[#202A35] mt-3 font-medium" aria-hidden="true">
              {currentStage.stageNumber} of {currentObject.stages.length}: {currentStage.stageName}
            </p>
          </div>

          {/* Active Stage Content & Visual Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Canvas (Col 1 to 6) */}
            <div className="lg:col-span-6 min-w-0">
              <StoryVisual
                objectId={currentObject.id}
                stageNumber={currentStage.stageNumber}
                accentColor={themeStyle.indicator}
              />
            </div>

            {/* Narrative Explanation (Col 7 to 12) */}
            <div className="lg:col-span-6 min-w-0 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: themeStyle.indicator }}
                  aria-hidden="true"
                />
                <span className="text-[#202A35]/75">Stage 0{currentStage.stageNumber}</span>
                <span aria-hidden="true" className="text-[#202A35]/40">·</span>
                <span className="font-bold text-[#202A35]">{currentStage.stageName}</span>
              </div>

              <h4 className="font-editorial text-2xl sm:text-3xl text-[#202A35] font-normal leading-snug">
                {currentStage.stageTitle}
              </h4>

              <p className="text-base sm:text-lg text-[#202A35]/90 leading-relaxed font-sans">
                {currentStage.body}
              </p>

              <div className="bg-white/85 rounded-xl p-4 border border-[#202A35]/10 space-y-3">
                <p className="text-xs sm:text-sm text-[#202A35]/80 leading-relaxed">
                  {currentStage.detail}
                </p>

                {/* Material flow line */}
                <div className="pt-2 border-t border-[#202A35]/10 flex items-start gap-2">
                  <span className="text-[11px] font-semibold text-[#202A35]/60 uppercase tracking-wider shrink-0 mt-0.5">
                    Flow:
                  </span>
                  <span className="text-xs font-medium text-[#202A35]/85">
                    {currentStage.materialFlow}
                  </span>
                </div>
              </div>

              {/* Curious Fact Card */}
              <div
                className="p-3.5 rounded-xl border flex items-start gap-3 bg-white"
                style={{
                  borderColor: `${themeStyle.indicator}40`
                }}
              >
                <Sparkles
                  className="w-4 h-4 shrink-0 mt-0.5 text-[#202A35]"
                  aria-hidden="true"
                />
                <p className="text-xs text-[#202A35]/90 leading-relaxed">
                  <strong className="font-semibold text-[#202A35]">Insight: </strong>
                  {currentStage.curiousFact}
                  {currentStage.source && (
                    <a href={currentStage.source.url} target="_blank" rel="noopener noreferrer"
                      className="block mt-2 underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-[#202A35] rounded">
                      Source: {currentStage.source.title}
                    </a>
                  )}
                </p>
              </div>

              {/* Back / Next Navigation Controls (Mobile wrap/stack without clipping, Next prominent on mobile) */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#202A35]/10">
                <button
                  type="button"
                  onClick={onPrevStage}
                  disabled={currentStageIndex === 0}
                  className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#202A35] ${
                    currentStageIndex === 0
                      ? 'text-[#202A35]/35 bg-transparent cursor-not-allowed border border-transparent'
                      : 'text-[#202A35] bg-white border border-[#202A35]/15 hover:bg-[#202A35]/5 cursor-pointer shadow-2xs'
                  }`}
                  aria-label="Previous story stage"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Previous Stage</span>
                </button>

                {currentStageIndex < currentObject.stages.length - 1 ? (
                  <button
                    type="button"
                    onClick={onNextStage}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#202A35] cursor-pointer ${themeStyle.nextBtn}`}
                    aria-label={`Next: ${currentObject.stages[currentStageIndex + 1].stageName}`}
                  >
                    <span>Next: {currentObject.stages[currentStageIndex + 1].stageName}</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = OBJECTS_DATA.findIndex((o) => o.id === activeObjectId);
                      const nextIndex = (currentIndex + 1) % OBJECTS_DATA.length;
                      onSelectObject(OBJECTS_DATA[nextIndex].id);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#202A35] hover:bg-[#C53B27] shadow-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#202A35]"
                    aria-label="Explore the next everyday object"
                  >
                    <Compass className="w-4 h-4" aria-hidden="true" />
                    <span>Explore Another Object</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Final Reflection Box (Shown on stage 5) */}
          {currentStageIndex === 4 && (
            <div className="mt-10 p-6 sm:p-7 rounded-2xl bg-white border border-[#086E64]/30 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#086E64]">
                    Core Reflection
                  </span>
                  <p className="font-editorial text-xl sm:text-2xl text-[#202A35] italic">
                    “{currentObject.finalReflection}”
                  </p>
                </div>
                <a
                  href="#bigger-pattern"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#086E64] hover:bg-[#06574F] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#086E64] transition-colors shrink-0 shadow-xs"
                >
                  <span>See the Bigger Pattern</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
