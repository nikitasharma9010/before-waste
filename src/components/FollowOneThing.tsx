import { StoryActionLink } from './StoryActionLink';
import { THEME } from '../utils/theme';
import React, { useEffect, useRef } from 'react';
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
  const stageHeadingRef = useRef<HTMLHeadingElement>(null);
  const stageFocusRequested = useRef(false);

  useEffect(() => {
    if (!stageFocusRequested.current) return;
    stageFocusRequested.current = false;
    const heading = stageHeadingRef.current;
    if (!heading) return;
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  }, [activeObjectId, currentStageIndex]);

  // Selection and progression use one consistent action color across every object.
  const themeStyle = {
    tabActive: 'bg-forest text-white shadow-xs',
    nextBtn: 'bg-forest hover:bg-forest-strong text-white',
    indicator: THEME.forest
  };

  return (
    <section id="follow-one-thing" className="scroll-mt-20 py-16 lg:py-24 bg-surface border-y border-ink/8">
      {/* Live Region for Screen Reader Stage Announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        Now viewing {currentObject.name}, Stage {currentStage.stageNumber} of 5: {currentStage.stageName}.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="section-kicker text-clay mb-2">
            <span>SIGNATURE EXPERIENCE</span>
            <span aria-hidden="true">·</span>
            <span>FOLLOW ONE THING</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-ink font-normal leading-tight text-balance">
            Every object carries a story before it reaches you.
          </h2>
          <p className="mt-3 text-base text-ink/80 leading-relaxed">
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
            const objTheme = themeStyle;
            return (
              <button
                key={obj.id}
                type="button"
                id={`object-tab-${obj.id}`}
                aria-pressed={isActive}
                aria-controls="story-content-panel"
                onClick={() => onSelectObject(obj.id)}
                className={`flex flex-col items-start justify-center gap-1.5 px-3 sm:px-4 py-3 min-h-[76px] min-w-0 rounded-xl font-medium text-sm text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink focus:outline-none ${
                  isActive
                    ? objTheme.tabActive
                    : 'bg-paper text-ink hover:bg-ink/5 border border-ink/15'
                }`}
              >
                <span>{obj.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-normal ${
                    isActive
                      ? 'bg-black/15 text-white'
                      : 'bg-black/5 text-ink/75'
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
          className="bg-paper rounded-3xl border border-ink/10 p-4 sm:p-7 lg:p-10 shadow-sm"
        >
          {/* Object Tagline & Stage Navigation Bar */}
          <div className="border-b border-ink/10 pb-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-ink">
                  {currentObject.name}
                </h3>
                <p className="text-xs sm:text-sm text-ink/75 mt-0.5">
                  {currentObject.tagline}
                </p>
              </div>

              {/* Reset to Stage 1 */}
              <button
                type="button"
                onClick={onRestartStory}
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold text-ink/75 hover:text-ink hover:bg-surface transition-colors self-start sm:self-auto cursor-pointer focus-visible:ring-2 focus-visible:ring-ink"
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
                    className="group text-left p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink focus:outline-none cursor-pointer min-h-[44px] flex flex-col justify-start"
                  >
                    <div
                      className={`h-2.5 w-full rounded-full transition-all duration-300 mb-2 ${
                        isCurrent
                          ? 'shadow-xs'
                          : isCompleted
                          ? 'opacity-85'
                          : 'bg-ink/15'
                      }`}
                      style={{
                        backgroundColor:
                          isCurrent || isCompleted ? themeStyle.indicator : undefined
                      }}
                    />
                    <div className="w-full">
                      <span className="text-sm sm:text-xs font-bold block text-ink/75 group-hover:text-ink transition-colors">
                        0{st.stageNumber}
                      </span>
                      <span
                        className={`hidden sm:block text-xs leading-snug break-words transition-colors ${
                          isCurrent
                            ? 'font-bold text-ink'
                            : 'font-medium text-ink/75 group-hover:text-ink'
                        }`}
                      >
                        {st.stageName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="sm:hidden text-sm text-ink mt-3 font-medium" aria-hidden="true">
              {currentStage.stageNumber} of {currentObject.stages.length}: {currentStage.stageName}
            </p>
          </div>

          {/* A stable starting point for each chapter, before its illustration and text. */}
          <h4
            id="story-stage-title"
            ref={stageHeadingRef}
            tabIndex={-1}
            className="scroll-mt-20 mb-6 font-editorial text-2xl sm:text-3xl text-ink font-normal leading-snug"
          >
            {currentStage.stageTitle}
          </h4>

          {/* Active Stage Content & Visual Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Canvas (Col 1 to 6) */}
            <div className="lg:col-span-6 min-w-0">
              <StoryVisual
                objectId={currentObject.id}
                label={`${currentObject.name}: ${currentStage.stageTitle}`}
                stageNumber={currentStage.stageNumber}
                accentColor={THEME.materials[currentObject.id]}
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
                <span className="text-ink/75">Stage 0{currentStage.stageNumber}</span>
                <span aria-hidden="true" className="text-ink/40">·</span>
                <span className="font-bold text-ink">{currentStage.stageName}</span>
              </div>

              <p className="text-base sm:text-lg text-ink/90 leading-relaxed font-sans">
                {currentStage.body}
              </p>

              <div className="bg-surface/85 rounded-xl p-4 border border-ink/10 space-y-3">
                <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
                  {currentStage.detail}
                </p>

                {/* Material flow line */}
                <div className="pt-2 border-t border-ink/10 flex items-start gap-2">
                  <span className="text-[11px] font-semibold text-ink/75 uppercase tracking-wider shrink-0 mt-0.5">
                    Flow:
                  </span>
                  <span className="text-xs font-medium text-ink/85">
                    {currentStage.materialFlow}
                  </span>
                </div>
              </div>

              {/* Curious Fact Card */}
              <div
                className="p-3.5 rounded-xl border flex items-start gap-3 bg-surface"
                style={{
                  borderColor: 'var(--color-sage-border)'
                }}
              >
                <Sparkles
                  className="w-4 h-4 shrink-0 mt-0.5 text-ink"
                  aria-hidden="true"
                />
                <p className="text-xs text-ink/90 leading-relaxed">
                  <strong className="font-semibold text-ink">Insight: </strong>
                  {currentStage.curiousFact}
                  {currentStage.source && (
                    <a href={currentStage.source.url} target="_blank" rel="noopener noreferrer"
                      className="block mt-2 underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-ink rounded">
                      Source: {currentStage.source.title}
                    </a>
                  )}
                </p>
              </div>

              {/* Back / Next Navigation Controls (Mobile wrap/stack without clipping, Next prominent on mobile) */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => {
                    stageFocusRequested.current = true;
                    onPrevStage();
                  }}
                  disabled={currentStageIndex === 0}
                  className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ink ${
                    currentStageIndex === 0
                      ? 'text-ink/35 bg-transparent cursor-not-allowed border border-transparent'
                      : 'text-ink bg-surface border border-ink/15 hover:bg-ink/5 cursor-pointer shadow-2xs'
                  }`}
                  aria-label="Previous story stage"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Previous Stage</span>
                </button>

                {currentStageIndex < currentObject.stages.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      stageFocusRequested.current = true;
                      onNextStage();
                    }}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink cursor-pointer ${themeStyle.nextBtn}`}
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
                      stageFocusRequested.current = true;
                      onSelectObject(OBJECTS_DATA[nextIndex].id);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold text-forest border border-forest/30 hover:bg-sage transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink"
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
            <div className="mt-10 p-6 sm:p-7 rounded-2xl bg-surface border border-forest/30 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold tracking-wider uppercase text-forest">
                    Core Reflection
                  </span>
                  <p className="font-editorial text-xl sm:text-2xl text-ink italic">
                    “{currentObject.finalReflection}”
                  </p>
                </div>
                <a
                  href="#what-would-you-do"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold text-forest underline underline-offset-4 hover:bg-sage focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-forest transition-colors shrink-0"
                >
                  <span>Try a real-life choice</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
              <StoryActionLink key={activeObjectId} objectId={activeObjectId} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
