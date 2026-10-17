import { readStoryProgress, writeStoryProgress } from './utils/storyProgress';
import { useSectionNavigation } from './utils/useSectionNavigation';
import { SiteFooter } from './components/SiteFooter';
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
  const [initialStory] = useState(() => {
    const saved = readStoryProgress();
    const requested = window.location.hash === '#object-preview' ? 'tshirt' : new URLSearchParams(window.location.search).get('story');
    return requested && ['tshirt', 'smartphone', 'food', 'package'].includes(requested)
      ? { id: requested, stage: requested === saved.id ? saved.stage : 0 } : saved;
  });
  const [selectedObjectId, setSelectedObjectId] = useState(initialStory.id);
  const [selectedStageIndex, setSelectedStageIndex] = useState(initialStory.stage);
  useEffect(() => { if (!isAssistant && !isNotFound) writeStoryProgress(selectedObjectId, selectedStageIndex); }, [selectedObjectId, selectedStageIndex, isAssistant, isNotFound]);
  useSectionNavigation();

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
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8"><a href="/#follow-one-thing" className="inline-flex min-h-[44px] items-center font-semibold text-forest underline underline-offset-4">Back to the stories</a></div>
          <DecisionHelper standalone initialQuestion={initialQuestion} onExploreObject={id => window.location.assign(`/?story=${encodeURIComponent(id)}#follow-one-thing`)} />
          <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8"><details className="rounded-xl border border-ink/20"><summary className="min-h-[44px] cursor-pointer px-4 py-3 font-semibold">How it works and your data</summary><TrustAndMethod onOpenSources={handleOpenSources} /></details></div>
        </> : <>
        {/* 2. Opening Experience: Spark curiosity immediately */}
        <Welcome onExploreObjects={handleExploreObject} />

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

        {selectedObjectId === 'tshirt' && <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <details className="rounded-xl border border-ink/20 bg-surface p-4"><summary className="min-h-[44px] cursor-pointer py-2 font-semibold">Explore T-shirt materials</summary><HeroOpening /></details>
        </div>}
        <WhatWouldYouDo />
        <AssistantEntry />
        <section id="learn" tabIndex={-1} aria-labelledby="learn-title" className="scroll-mt-20 border-y border-ink/10 bg-paper px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="section-kicker text-forest">THE BIGGER PICTURE</p>
            <h2 id="learn-title" className="mt-3 font-editorial text-2xl sm:text-3xl">Good choices need supportive systems.</h2>
            <p className="mt-3 max-w-3xl leading-relaxed">Keeping useful things in use can avoid unnecessary replacements. What is possible also depends on product design, affordable repair and local services. Individuals cannot solve these challenges alone.</p>
            <p className="mt-3 text-sm text-ink/80">Explore how waste happens, what we use and what needs to change. Choose a topic below.</p>
            <div className="mt-5 space-y-3">
              <details name="learning-topic" open className="rounded-xl border border-ink/20"><summary className="min-h-[44px] cursor-pointer px-4 py-3 font-semibold">Preventing waste</summary><BiggerPattern /></details>
              <details name="learning-topic" className="rounded-xl border border-ink/20"><summary className="min-h-[44px] cursor-pointer px-4 py-3 font-semibold">Resource demand</summary><OnePlanetDemands /></details>
              <details name="learning-topic" className="rounded-xl border border-ink/20"><summary className="min-h-[44px] cursor-pointer px-4 py-3 font-semibold">Design and collective change</summary><SystemsSection /></details>
            </div>
          </div>
        </section>
        <SevenDayPause />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <details className="mt-4 rounded-xl border border-ink/20"><summary className="min-h-[44px] cursor-pointer px-4 py-4 font-semibold">How it works, sources and your data</summary><TrustAndMethod onOpenSources={handleOpenSources} /></details>
        </div>
        </>}
      </main>

      {/* 9. Closing Experience */}
      {!isNotFound && <>
        {!isAssistant && <ClosingSection />}
        <SiteFooter assistant={isAssistant} onRestart={handleRestart} onOpenSources={handleOpenSources} />
      </>}

      {/* Accessible Sources Modal */}
      <SourcesModal
        isOpen={sourcesModalOpen}
        onClose={() => setSourcesModalOpen(false)}
        triggerRef={sourcesTriggerRef}
      />
    </div>
  );
}
