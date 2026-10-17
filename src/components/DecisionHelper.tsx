import { useRef, useState } from 'react';
import { intentLabels, itemLabels, recommend, type Decision } from '../data/decisionData';
import { readAction, writeAction, type SavedAction, type Outcome } from '../utils/actionStorage';

const control = 'w-full min-h-[44px] rounded-xl border border-ink/25 bg-surface p-3 text-ink';
const primary = 'min-h-[44px] rounded-xl bg-forest px-5 py-3 font-semibold text-white hover:bg-forest-strong';
export function DecisionHelper({ onExploreObject }: { onExploreObject: (id: string) => void }) {
  const [initial] = useState(readAction);
  const [saved, setSaved] = useState<SavedAction | null>(initial.action);
  const [notice, setNotice] = useState(initial.unavailable ? 'Saved actions could not be read. You can still use this flow.' : '');
  const [decision, setDecision] = useState<Decision>({ item: 'clothes', intent: 'buy', support: 'myself', budget: 'free' });
  const [result, setResult] = useState<Decision | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const advice = result ? recommend(result) : null;
  const change = <K extends keyof Decision>(key: K, value: Decision[K]) => {
    setDecision({ ...decision, [key]: value });
    setResult(null);
  };
  const persist = (next: SavedAction | null) => {
    const success = writeAction(next);
    if (!success && !next) {
      setNotice('Your saved action could not be removed. Please try again; it may return after reloading.');
      return;
    }
    setSaved(next);
    setNotice(success ? (next ? 'Action saved on this browser.' : 'Saved action removed.') : 'Unable to save on this browser. Your action is available for this session only.');
  };
  return (
    <section id="decision-helper" tabIndex={-1} aria-labelledby="decision-title" className="scroll-mt-20 border-y border-ink/10 bg-sage py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <p className="section-kicker text-forest mb-3">ONE OBJECT. ONE NEXT STEP.</p>
          <h2 id="decision-title" className="font-editorial text-3xl sm:text-4xl lg:text-5xl">What should I do with this?</h2>
          <p className="mt-4 text-lg">Before you buy, replace or let something go, find a starting point that fits your life.</p>
          <p className="mt-2 text-sm text-ink/80">Start with clothes or headphones. No account needed.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          <form className="rounded-2xl border border-ink/15 bg-surface p-5 sm:p-8 space-y-5" onSubmit={event => {
            event.preventDefault();
            setResult({ ...decision });
            requestAnimationFrame(() => resultRef.current?.focus());
          }}>
            <label className="block font-semibold">1. What is the object?
              <select className={`${control} mt-2`} value={decision.item} onChange={e => change('item', e.target.value as Decision['item'])}>
                {Object.entries(itemLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </label>
            <label className="block font-semibold">2. What brings you here?
              <select className={`${control} mt-2`} value={decision.intent} onChange={e => change('intent', e.target.value as Decision['intent'])}>
                {Object.entries(intentLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </label>
            {decision.intent === 'fix' && <label className="block font-semibold">How would you like to approach it?
              <select className={`${control} mt-2`} value={decision.support} onChange={e => change('support', e.target.value as Decision['support'])}>
                <option value="myself">Explore what I can do myself</option><option value="help">Find help with it</option>
              </select>
            </label>}
            {decision.intent !== 'pass' && <label className="block font-semibold">3. What fits your budget right now?
              <select className={`${control} mt-2`} value={decision.budget} onChange={e => change('budget', e.target.value as Decision['budget'])}>
                <option value="free">Start without spending</option><option value="flexible">I can consider a cost</option>
              </select>
            </label>}
            <button className={primary} type="submit">Find my next step</button>
            <p className="text-sm text-ink/80">General starting points. Your object’s condition, model and local services can change what is possible.</p>
          </form>
          <div ref={resultRef} tabIndex={-1} aria-label="Your suggested next step" className="scroll-mt-20 rounded-2xl border border-ink/15 bg-paper p-5 sm:p-8">
            {advice && result ? <>
              <p className="section-kicker text-clay mb-3">{itemLabels[result.item]} · {intentLabels[result.intent]}</p>
              <h3 className="text-2xl sm:text-3xl font-editorial">{advice.title}</h3>
              <p className="mt-4 leading-relaxed">{advice.step}</p>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2 text-sm"><div><dt className="font-semibold">Time & effort</dt><dd className="mt-1">{advice.effort}</dd></div><div><dt className="font-semibold">Cost to consider</dt><dd className="mt-1">{advice.cost}</dd></div></dl>
              <p className="mt-5 text-sm leading-relaxed"><strong>Another way forward: </strong>{advice.alternative}</p>
              {result.item === 'headphones' && result.intent === 'fix' && <p className="mt-4 text-sm">If a battery is swollen, hot or damaged, stop using and charging the device and contact the manufacturer or a qualified service. Do not open it as a beginner repair.</p>}
              <div className="mt-6 border-t border-ink/15 pt-5"><h4 className="font-semibold">A possible next chapter</h4><p className="mt-2 text-sm">{advice.chapter}</p>
                <button type="button" className="min-h-[44px] py-2 text-forest underline underline-offset-4 text-sm font-semibold" onClick={() => onExploreObject(result.item === 'clothes' ? 'tshirt' : 'smartphone')}>{result.item === 'clothes' ? 'Explore the T-shirt story' : 'Explore a related electronics story: smartphone'}</button>
              </div>
              {result.intent === 'fix' && <p className="mt-3 text-sm">Find a matching guide: <a className="text-forest underline underline-offset-4" href={advice.resource.url}>{advice.resource.label}</a>. Check tools, difficulty and model before starting.</p>}
              <p className="mt-3 text-xs text-ink/80">These are editorial suggestions, not a diagnosis or a measured environmental saving. Repair resources: <a className="underline" href={advice.resource.url}>{advice.resource.label}</a>. Collection and donation acceptance must be checked locally.</p>
              <button type="button" className={`${primary} mt-6`} onClick={() => persist({ ...result, note: '', outcome: 'planned' })}>{saved ? 'Replace my saved action with this' : 'Save this action for the week'}</button>
            </> : <><h3 className="text-2xl font-editorial">A small decision, made easier.</h3><p className="mt-4 leading-relaxed">Tell us what you are considering. You will get a practical first step, an alternative, and a little of the story behind your choice.</p><p className="mt-4 text-sm">Your budget and access to help matter. Choose what is realistic for you.</p></>}
          </div>
        </div>
        <p role="status" className="mt-5 text-sm">{notice}</p>
        {saved && <div className="mt-8 rounded-2xl border border-forest/30 bg-surface p-5 sm:p-8 max-w-3xl" aria-labelledby="saved-action-title">
          <p className="section-kicker text-forest mb-3">ONE THING THIS WEEK</p>
          <h3 id="saved-action-title" className="text-2xl font-editorial">{recommend(saved).title}</h3>
          <p className="mt-3">{recommend(saved).step}</p>
          {saved.intent === 'fix' && <a className="inline-flex min-h-[44px] items-center mt-2 text-forest underline underline-offset-4" href={recommend(saved).resource.url}>{recommend(saved).resource.label}</a>}
          <p className="mt-3 text-sm text-ink/80">Saved only in this browser when storage is available. Clearing browser data removes it. No automatic reminders.</p>
          <label className="block mt-5 font-semibold" htmlFor="action-outcome">What happened?</label>
          <select id="action-outcome" className={`${control} mt-2`} value={saved.outcome} onChange={e => persist({ ...saved, outcome: e.target.value as Outcome })}>
            <option value="planned">I am planning to try it</option><option value="done">I tried it and it worked</option><option value="blocked">Something got in the way</option><option value="changed">I chose another option</option>
          </select>
          <label className="block mt-5 font-semibold" htmlFor="action-note">My next step or what got in the way <span className="font-normal">(optional)</span></label>
          <textarea id="action-note" className={`${control} mt-2 min-h-28`} maxLength={1000} value={saved.note} onChange={e => persist({ ...saved, note: e.target.value })} />
          <button type="button" className="mt-4 min-h-[44px] py-2 underline underline-offset-4 text-sm" onClick={() => persist(null)}>Remove saved action</button>
          <a className="ml-5 inline-flex min-h-[44px] items-center text-sm underline underline-offset-4" href="#pause">Explore optional reflections</a>
        </div>}
      </div>
    </section>
  );
}
