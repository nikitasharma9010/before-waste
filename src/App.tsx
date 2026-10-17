import { useState, useRef, useEffect } from 'react';
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
import { DecisionHelper } from './components/DecisionHelper';
import { TrustAndMethod } from './components/TrustAndMethod';
import { AssistantEntry } from './components/AssistantEntry';
import { takeQuestionDraft } from './utils/questionDraft';
import { Welcome } from './components/Welcome';
import { NotFound } from './components/NotFound';

const KNOWN_PATHS = new Set(['/', '/ask']);

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const isAssistant = path === '/ask';
  const isNotFound = !KNOWN_PATHS.has(path);
  const [initialQuestion] = useState(() => isAssistant ? takeQuestionDraft() : '');
  useEffect(() => {
    document.title = isAssistant
      ? 'Ask Before Waste — Practical sustainability guidance'
      : isNotFound
        ? 'Page Not Found — Before Waste'
        : 'BEFORE WASTE — Think Before It Becomes Waste';
  }, [isAssistant, isNotFound]);
  // Single source of truth for selected object and stage
  const [selectedObjectId, setSelectedObjectId] = useState<string>(() => { const id = new URLSearchParams(window.location.search).get('story'); return id && ['tshirt', 'smartphone', 'food', 'package'].includes(id) ? id : 'tshirt'; });
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
      element.tabIndex = -1;
      element.focus({ preventScroll: true });
      element.scrollIntoView({ behavior: getScrollBehavior() });
    }
  };

  // Reliable restart behavior: returns to top AND resets object story to T-shirt stage 1
  // Preserves 7-Day Pause reflections and progress untouched!
  const handleRestart = () => {
    setSelectedObjectId('tshirt');
    setSelectedStageIndex(0);
    document.getElementById('hero')?.focus({ preventScroll: true });
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
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans selection:bg-clay/20 selection:text-ink">
      <a href="#main-content" className="skip-link">Skip to content</a>
      {/* 1. Header (Top Bar Contract: 3 Zones) */}
      <Header onOpenSources={handleOpenSources} />

      {/* Main Narrative Flow */}
      <main id="main-content" tabIndex={-1} className="flex-1">
        {isNotFound ? <NotFound /> : isAssistant ? <>
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8"><a href="/" className="inline-flex min-h-[44px] items-center font-semibold text-forest underline underline-offset-4">Back to the stories</a></div>
          <DecisionHelper standalone initialQuestion={initialQuestion} onExploreObject={id => window.location.assign(`/?story=${encodeURIComponent(id)}#follow-one-thing`)} />
          <TrustAndMethod onOpenSources={handleOpenSources} />
        </> : <>
        {/* 2. Opening Experience: Spark curiosity immediately */}
        <Welcome onExploreObjects={handleExploreObject} />

        <AssistantEntry />

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
        <TrustAndMethod onOpenSources={handleOpenSources} />
        </>}
      </main>

      {/* 9. Closing Experience */}
      {isNotFound ? null : isAssistant ? <footer className="border-t border-ink/15 px-4 py-6 text-sm"><div className="mx-auto flex max-w-7xl flex-wrap gap-x-6 gap-y-2"><a href="/#follow-one-thing" className="inline-flex min-h-[44px] items-center text-forest underline">Explore the object stories</a><a href="/#pause" className="inline-flex min-h-[44px] items-center text-forest underline">Try the 7-day pause</a><button type="button" className="min-h-[44px] text-forest underline" onClick={event => handleOpenSources(event.currentTarget)}>Sources &amp; methodology</button></div></footer> : <ClosingSection
        onRestart={handleRestart}
        onOpenSources={handleOpenSources}
      />}

      {/* Accessible Sources Modal */}
      <SourcesModal
        isOpen={sourcesModalOpen}
        onClose={() => setSourcesModalOpen(false)}
        triggerRef={sourcesTriggerRef}
      />
    </div>
  );
}
