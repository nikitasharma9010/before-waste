import React, { useState } from 'react';
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
  const [selectedObjectId, setSelectedObjectId] = useState<string>('tshirt');
  const [sourcesModalOpen, setSourcesModalOpen] = useState<boolean>(false);

  const handleExploreObject = (objectId?: string) => {
    if (objectId) {
      setSelectedObjectId(objectId);
    }
    const element = document.getElementById('follow-one-thing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setSelectedObjectId('tshirt');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#202A35] flex flex-col font-sans selection:bg-[#FF654F]/20 selection:text-[#202A35]">
      {/* 1. Header (Top Bar Contract: 3 Zones) */}
      <Header onOpenSources={() => setSourcesModalOpen(true)} />

      {/* Main Narrative Flow */}
      <main className="flex-1">
        {/* 2. Opening Experience: Spark curiosity immediately */}
        <HeroOpening onExploreObjects={handleExploreObject} />

        {/* 3. Signature Experience: Follow One Thing */}
        <FollowOneThing
          selectedObjectId={selectedObjectId}
          onSelectObject={(id) => setSelectedObjectId(id)}
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
        onOpenSources={() => setSourcesModalOpen(true)}
      />

      {/* Sources & Methodology Modal */}
      <SourcesModal
        isOpen={sourcesModalOpen}
        onClose={() => setSourcesModalOpen(false)}
      />
    </div>
  );
}
