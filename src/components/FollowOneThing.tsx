import React, { useState } from 'react';
import { OBJECTS_DATA, StoryObject } from '../data/objectsData';
import { StoryVisual } from './StoryVisual';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  Compass
} from 'lucide-react';

interface FollowOneThingProps {
  selectedObjectId?: string;
  onSelectObject?: (id: string) => void;
}

export const FollowOneThing: React.FC<FollowOneThingProps> = ({
  selectedObjectId = 'tshirt',
  onSelectObject
}) => {
  const [activeObjectId, setActiveObjectId] = useState<string>(selectedObjectId);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);

  // Sync if parent updates selectedObjectId
  React.useEffect(() => {
    if (selectedObjectId && selectedObjectId !== activeObjectId) {
      setActiveObjectId(selectedObjectId);
      setCurrentStageIndex(0);
    }
  }, [selectedObjectId]);

  const currentObject: StoryObject =
    OBJECTS_DATA.find((obj) => obj.id === activeObjectId) || OBJECTS_DATA[0];

  const currentStage = currentObject.stages[currentStageIndex];

  const handleNextStage = () => {
    if (currentStageIndex < currentObject.stages.length - 1) {
      setCurrentStageIndex((prev) => prev + 1);
    }
  };

  const handlePrevStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex((prev) => prev - 1);
    }
  };

  const handleSwitchObject = (id: string) => {
    setActiveObjectId(id);
    setCurrentStageIndex(0);
    if (onSelectObject) onSelectObject(id);
  };

  return (
    <section id="follow-one-thing" className="py-16 lg:py-24 bg-white border-y border-[#202A35]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF654F] mb-2">
            <span>SIGNATURE EXPERIENCE</span>
            <span aria-hidden="true">·</span>
            <span>FOLLOW ONE THING</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#202A35] font-normal leading-tight text-balance">
            Every object carries a story before it reaches you.
          </h2>
          <p className="mt-3 text-base text-[#202A35]/75 leading-relaxed">
            Choose an everyday companion and follow its journey—from raw planetary material, through human hands and daily care, to its next possible chapter.
          </p>
        </div>

        {/* 4 Object Tabs (Functional button controls with clean styling) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {OBJECTS_DATA.map((obj) => {
            const isActive = obj.id === activeObjectId;
            return (
              <button
                key={obj.id}
                onClick={() => handleSwitchObject(obj.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'bg-[#FFF9F0] text-[#202A35]/80 hover:bg-[#202A35]/5 border border-[#202A35]/10'
                }`}
                style={{
                  backgroundColor: isActive ? obj.accentColor : undefined,
                  borderColor: isActive ? obj.accentColor : undefined
                }}
              >
                <span>{obj.name}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-[#202A35]/60'
                  }`}
                >
                  {obj.itemType}
                </span>
              </button>
            );
          })}
        </div>

        {/* Story Box Main Card */}
        <div className="bg-[#FFF9F0] rounded-3xl border border-[#202A35]/10 p-6 sm:p-8 lg:p-10 shadow-sm">
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
                onClick={() => setCurrentStageIndex(0)}
                className="inline-flex items-center gap-1.5 text-xs text-[#202A35]/60 hover:text-[#202A35] transition-colors self-start sm:self-auto cursor-pointer"
                title="Restart this story"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart journey</span>
              </button>
            </div>

            {/* Stepper Progress Bar (5 stages) */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {currentObject.stages.map((st, idx) => {
                const isCurrent = idx === currentStageIndex;
                const isCompleted = idx < currentStageIndex;
                return (
                  <button
                    key={st.stageNumber}
                    onClick={() => setCurrentStageIndex(idx)}
                    className="group text-left focus:outline-none cursor-pointer"
                  >
                    <div
                      className={`h-2 rounded-full transition-all duration-300 mb-2 ${
                        isCurrent
                          ? 'shadow-xs'
                          : isCompleted
                          ? 'opacity-80'
                          : 'bg-[#202A35]/10'
                      }`}
                      style={{
                        backgroundColor:
                          isCurrent || isCompleted ? currentObject.accentColor : undefined
                      }}
                    />
                    <div className="hidden sm:block">
                      <span className="text-[11px] font-bold block text-[#202A35]/50 group-hover:text-[#202A35] transition-colors">
                        0{st.stageNumber}
                      </span>
                      <span
                        className={`text-xs block truncate transition-colors ${
                          isCurrent
                            ? 'font-bold text-[#202A35]'
                            : 'font-medium text-[#202A35]/60 group-hover:text-[#202A35]'
                        }`}
                      >
                        {st.stageName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stage Content & Visual Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Canvas (Col 1 to 6) */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <StoryVisual
                objectId={currentObject.id}
                stageNumber={currentStage.stageNumber}
                accentColor={currentObject.accentColor}
              />
            </div>

            {/* Narrative Explanation (Col 7 to 12) */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: currentObject.accentColor }}
                />
                <span className="text-[#202A35]/70">Stage 0{currentStage.stageNumber}</span>
                <span aria-hidden="true" className="text-[#202A35]/30">·</span>
                <span style={{ color: currentObject.accentColor }}>{currentStage.stageName}</span>
              </div>

              <h4 className="font-editorial text-2xl sm:text-3xl text-[#202A35] font-normal leading-snug">
                {currentStage.stageTitle}
              </h4>

              <p className="text-base sm:text-lg text-[#202A35]/85 leading-relaxed font-sans">
                {currentStage.body}
              </p>

              <div className="bg-white/80 rounded-xl p-4 border border-[#202A35]/8 space-y-3">
                <p className="text-xs sm:text-sm text-[#202A35]/75 leading-relaxed">
                  {currentStage.detail}
                </p>

                {/* Material flow line */}
                <div className="pt-2 border-t border-[#202A35]/8 flex items-start gap-2">
                  <span className="text-[11px] font-semibold text-[#202A35]/50 uppercase tracking-wider shrink-0 mt-0.5">
                    Flow:
                  </span>
                  <span className="text-xs font-medium text-[#202A35]/80">
                    {currentStage.materialFlow}
                  </span>
                </div>
              </div>

              {/* Curious Fact Card */}
              <div
                className="p-3.5 rounded-xl border flex items-start gap-3"
                style={{
                  backgroundColor: `${currentObject.accentColor}0D`,
                  borderColor: `${currentObject.accentColor}30`
                }}
              >
                <Sparkles
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: currentObject.accentColor }}
                />
                <p className="text-xs text-[#202A35]/85 leading-relaxed">
                  <strong className="font-semibold text-[#202A35]">Did you know? </strong>
                  {currentStage.curiousFact}
                </p>
              </div>

              {/* Back / Next Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-[#202A35]/8">
                <button
                  onClick={handlePrevStage}
                  disabled={currentStageIndex === 0}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    currentStageIndex === 0
                      ? 'text-[#202A35]/30 bg-transparent cursor-not-allowed'
                      : 'text-[#202A35] bg-white border border-[#202A35]/10 hover:bg-[#202A35]/5'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentStageIndex < currentObject.stages.length - 1 ? (
                  <button
                    onClick={handleNextStage}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white shadow-sm transition-all hover:opacity-95 cursor-pointer"
                    style={{ backgroundColor: currentObject.accentColor }}
                  >
                    <span>Next: {currentObject.stages[currentStageIndex + 1].stageName}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const currentIndex = OBJECTS_DATA.findIndex((o) => o.id === activeObjectId);
                        const nextIndex = (currentIndex + 1) % OBJECTS_DATA.length;
                        handleSwitchObject(OBJECTS_DATA[nextIndex].id);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#202A35] hover:bg-[#FF654F] shadow-sm transition-colors cursor-pointer"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Explore Another Object</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Final Reflection Box (Prominently displayed when reaching stage 5 or expandable) */}
          {currentStageIndex === 4 && (
            <div className="mt-10 p-6 sm:p-7 rounded-2xl bg-white border border-[#0D9F91]/30 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#0D9F91]">
                    Core Reflection
                  </span>
                  <p className="font-editorial text-xl sm:text-2xl text-[#202A35] italic">
                    “{currentObject.finalReflection}”
                  </p>
                </div>
                <a
                  href="#bigger-pattern"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-white bg-[#0D9F91] hover:bg-[#0a867a] transition-colors shrink-0"
                >
                  <span>See the Bigger Pattern</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
