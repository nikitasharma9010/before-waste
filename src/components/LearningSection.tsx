import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { BiggerPattern } from './BiggerPattern';
import { OnePlanetDemands } from './OnePlanetDemands';
import { SystemsSection } from './SystemsSection';

const topics = [
  { id: 'bigger-pattern', label: 'Preventing waste', Content: BiggerPattern },
  { id: 'one-planet', label: 'Resource demand', Content: OnePlanetDemands },
  { id: 'systems', label: 'Design and collective change', Content: SystemsSection },
];
const nextLink = 'inline-flex min-h-[44px] items-center rounded px-4 py-3 font-semibold text-forest underline underline-offset-4';

export function LearningSection() {
  const [active, setActive] = useState(() => topics.find(topic => `#${topic.id}` === window.location.hash)?.id ?? topics[0].id);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    // Reveal hidden content before the shared anchor handler focuses and scrolls it.
    const reveal = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const panel = target.closest<HTMLElement>('[data-learning-panel]');
      if (panel?.hidden && panel.dataset.learningPanel) flushSync(() => setActive(panel.dataset.learningPanel!));
    };
    const element = section.current;
    element?.addEventListener('section-reveal', reveal);
    return () => element?.removeEventListener('section-reveal', reveal);
  }, []);
  return <section ref={section} id="learn" tabIndex={-1} aria-labelledby="learn-title" className="scroll-mt-20 border-y border-ink/10 bg-paper px-4 py-10 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <p className="section-kicker text-forest">THE BIGGER PICTURE</p>
      <h2 id="learn-title" className="mt-3 font-editorial text-2xl sm:text-3xl">Good choices need supportive systems.</h2>
      <p className="mt-3 max-w-3xl leading-relaxed">Keeping useful things in use can avoid unnecessary replacements. What is possible also depends on product design, affordable repair and local services. Individuals cannot solve these challenges alone.</p>
      <p className="mt-3 text-sm text-ink/80">Explore how waste happens, what we use and what needs to change. Choose a topic below.</p>
      <nav aria-label="Learning topics" className="mt-5 grid gap-2 sm:grid-cols-3">
        {topics.map(topic => <a key={topic.id} href={`#${topic.id}`} aria-current={active === topic.id ? 'true' : undefined} className="flex min-h-[44px] items-center justify-center rounded-xl border border-forest/30 px-4 py-3 text-center font-semibold text-forest hover:bg-sage aria-[current=true]:bg-forest aria-[current=true]:text-white">{topic.label}</a>)}
      </nav>
      <div className="mt-4 rounded-xl border border-ink/20">
        {topics.map((topic, index) => <div key={topic.id} data-learning-panel={topic.id} hidden={active !== topic.id}>
          <topic.Content />
          <nav aria-label={`${topic.label} next steps`} className="flex flex-wrap justify-between gap-2 border-t border-ink/15 p-2">
            <a href="#learn" className={nextLink}>Choose another topic</a>
            {index < topics.length - 1 ? <a href={`#${topics[index + 1].id}`} className={nextLink}>Next topic: {topics[index + 1].label.toLowerCase()}</a> : <a href="#pause" className={nextLink}>Try the 7-Day Pause</a>}
          </nav>
        </div>)}
      </div>
    </div>
  </section>;
}
