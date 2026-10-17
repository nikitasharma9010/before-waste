import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { HeroOpening } from './components/HeroOpening';
import { FollowOneThing } from './components/FollowOneThing';
import { BiggerPattern } from './components/BiggerPattern';
import { WhatWouldYouDo } from './components/WhatWouldYouDo';
import { OnePlanetDemands } from './components/OnePlanetDemands';
import { SevenDayPause } from './components/SevenDayPause';
import { SystemsSection } from './components/SystemsSection';
import { ClosingSection } from './components/ClosingSection';
import { SourcesModal } from './components/SourcesModal';

export default function App() {
  // Single source of truth for selected object and stage
  const [selectedObjectId, setSelectedObjectId] = useState<string>('tshirt');
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);

  // Sources dialog state and trigger ref
  const [sourcesModalOpen, setSourcesModalOpen] = useState<boolean>(false);
  const sourcesTriggerRef = useRef<HTMLElement | null>(null);

  // Check prefers-reduced-motion for smooth vs auto scroll
  const getScrollBehavior = (): ScrollBehavior => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'auto';
    }
    return 'smooth';
  };

  const handleOpenSources = (triggerEl?: HTMLElement | null) => {
    if (triggerEl) {
      sourcesTriggerRef.current = triggerEl;
    }
    setSourcesModalOpen(true);
  };

  const handleExploreObject = (objectId?: string) => {
    if (objectId) {
      setSelectedObjectId(objectId);
      setSelectedStageIndex(0);
    }
    const element = document.getElementById('follow-one-thing');
    if (element) {
      element.scrollIntoView({ behavior: getScrollBehavior() });
    }
  };

  // Reliable restart behavior: returns to top AND resets object story to T-shirt stage 1
  // Preserves 7-Day Pause reflections and progress untouched!
  const handleRestart = () => {
    setSelectedObjectId('tshirt');
    setSelectedStageIndex(0);
    window.scrollTo({ top: 0, behavior: getScrollBehavior() });
  };

  const handleRestartStory = () => {
    setSelectedStageIndex(0);
  };

  const handleNextStage = () => {
    setSelectedStageIndex((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStage = () => {
    setSelectedStageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSelectObject = (id: string) => {
    setSelectedObjectId(id);
    setSelectedStageIndex(0);
  };

  const handleSelectStage = (idx: number) => {
    setSelectedStageIndex(idx);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#202A35] flex flex-col font-sans selection:bg-[#C53B27]/20 selection:text-[#202A35]">
      {/* 1. Header (Top Bar Contract: 3 Zones) */}
      <Header onOpenSources={handleOpenSources} />

      {/* Main Narrative Flow */}
      <main className="flex-1">
        {/* 2. Opening Experience: Spark curiosity immediately */}
        <HeroOpening onExploreObjects={handleExploreObject} />

        {/* 3. Signature Experience: Follow One Thing (Single Source of Truth) */}
        <FollowOneThing
          activeObjectId={selectedObjectId}
          currentStageIndex={selectedStageIndex}
          onSelectObject={handleSelectObject}
          onSelectStage={handleSelectStage}
          onNextStage={handleNextStage}
          onPrevStage={handlePrevStage}
          onRestartStory={handleRestartStory}
        />

        {/* 4. Reveal the Bigger Pattern */}
        <BiggerPattern />

        {/* 5. A Playful Moment: What would you do? */}
        <WhatWouldYouDo />

        {/* 6. A Moment of Wonder: One planet, different demands */}
        <OnePlanetDemands />

        {/* 7. The Pause: A small action that matters */}
        <SevenDayPause />

        {/* 8. Individual Choices and Bigger Systems */}
        <SystemsSection />
      </main>

      {/* 9. Closing Experience */}
      <ClosingSection
        onRestart={handleRestart}
        onOpenSources={handleOpenSources}
      />

      {/* Accessible Sources Modal */}
      <SourcesModal
        isOpen={sourcesModalOpen}
        onClose={() => setSourcesModalOpen(false)}
        triggerRef={sourcesTriggerRef}
      />
    </div>
  );
}
