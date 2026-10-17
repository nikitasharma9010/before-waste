import { SavedAnswersView, useAnswerLibrary, useAssistantTabs } from './SavedAnswers';
import { CopyTextButton } from './CopyTextButton';
import { useRef, useState } from 'react';
import { barrierLabels, intentLabels, issues, itemLabels, recommend, recoveryAdvice, sameDecision, type Barrier, type Decision } from '../data/decisionData';
import { readAction, writeAction, type SavedAction, type Outcome } from '../utils/actionStorage';
import { planText, type GeneratedPlan, type PlannerContext } from '../data/aiPlan';
import { AIPlannerForm } from './AIPlannerForm';
import { AIPlanContent } from './AIPlanContent';

const control = 'w-full min-h-[44px] rounded-xl border border-ink/25 bg-paper p-3 text-base text-ink';
const primary = 'min-h-[44px] rounded-xl bg-forest px-5 py-3 font-semibold text-white hover:bg-forest-strong';
export function DecisionHelper({ onExploreObject, standalone = false, initialQuestion = '' }: { onExploreObject: (id: string) => void; standalone?: boolean; initialQuestion?: string }) {
  const library = useAnswerLibrary(standalone);
  const tabs = useAssistantTabs(standalone);
  const Heading = standalone ? 'h1' : 'h2';
  const [initial] = useState(readAction);
  const [storageAvailable, setStorageAvailable] = useState(!initial.unavailable);
  const [saved, setSaved] = useState<SavedAction | null>(initial.action);
  const [notice, setNotice] = useState(initial.unavailable ? 'Saved actions could not be read. You can still use this flow.' : '');
  const [decision, setDecision] = useState<Decision>({ item: 'anything', intent: 'explore', support: 'myself', budget: 'free' });
  const [result, setResult] = useState<Decision | null>(null);
  const [undoAction, setUndoAction] = useState<SavedAction | null>(null);
  const [generated, setGenerated] = useState<GeneratedPlan | null>(null);
  const [editedPlan, setEditedPlan] = useState('');
  const editorDetailsRef = useRef<HTMLDetailsElement>(null);
  const [answeredQuestion, setAnsweredQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const [background, setBackground] = useState('');
  const [history, setHistory] = useState<PlannerContext[]>([]);
  const [conversationKey, setConversationKey] = useState(0);
  const context = generated ? [...history, { question: answeredQuestion, answer: planText(generated.plan).slice(0, 1000) }].slice(-2) : [];
  const showBasic = () => {
    setDecision({ ...decision }); setGenerated(null); setEditedPlan(''); setAnsweredQuestion('');
    setResult({ ...decision });
    requestAnimationFrame(() => { if (!standalone || tabs.current.current === 'ask') resultRef.current?.focus(); });
  };
  const editQuestion = () => document.getElementById('ai-description')?.focus();
  const resultRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const savedRef = useRef<HTMLHeadingElement>(null);
  const advice = result ? recommend(result) : null;
  const saveHint = generated ? {
    ready: '',
    clarify: 'Save is available for actionable plans. Add the requested details below to continue.',
    explanation: standalone ? '' : 'This is an explanation, so it is not saved as an action. Ask a follow-up for a practical next step you can save.',
    refused: 'This safety response is not an action plan to save. You can ask about a safer option below.',
    unsupported: 'This reply is outside the supported theme and cannot be saved as an action.',
  }[generated.plan.status] : '';
  const isSameSaved = standalone ? library.answers.some(a => a.question === answeredQuestion && a.text === editedPlan) : !!(saved && result && sameDecision(saved, result) &&
    (generated ? saved.question === answeredQuestion && saved.customPlan?.text === editedPlan && saved.customPlan.source === generated.source : !saved.customPlan));
  const canSaveAnswer = !!generated && ['ready', 'explanation'].includes(generated.plan.status);
  const hasUnsavedEdits = !!(generated && (standalone ? canSaveAnswer : generated.plan.status === 'ready') && editedPlan !== planText(generated.plan) && !isSameSaved);
  const updatingSaved = !!(saved && result && generated && saved.customPlan && sameDecision(saved, result) && saved.question === answeredQuestion);
  const change = <K extends keyof Decision>(key: K, value: Decision[K]) => {
    setDecision({ ...decision, [key]: value, ...(key === 'item' ? { issue: 'unsure' as const } : {}) });
    setResult(null);
    setGenerated(null); setEditedPlan('');
  };
  const persist = (next: SavedAction | null) => {
    const success = writeAction(next);
    setStorageAvailable(success);
    if (!success && !next) {
      setNotice('Your saved action could not be removed. Please try again; it may return after reloading.');
      return false;
    }
    setSaved(next);
    setNotice(success ? (next ? 'Action saved on this browser.' : 'Saved action removed.') : 'Unable to save on this browser. Your action is available for this session only.');
    return true;
  };
  const saveResult = () => {
    if (standalone) { library.save(answeredQuestion, editedPlan); return; }
    if (!result) return;
    if (saved && isSameSaved && storageAvailable) {
      setNotice('This action is already saved. Your note and outcome have been kept.');
      requestAnimationFrame(() => savedRef.current?.focus());
      return;
    }
    if (saved && isSameSaved) { persist(saved); return; }
    setUndoAction(saved);
    persist({ ...(updatingSaved ? saved! : { ...result, note: '', outcome: 'planned' as const }), ...(generated ? { question: answeredQuestion, customPlan: { ...generated, text: editedPlan } } : {}) });
  };
  const feedback = <div>
        <p id="action-storage-status" role="status" className={notice ? 'mt-5 text-sm' : 'sr-only'}>{notice}</p>
        {undoAction && <button type="button" className="min-h-[44px] py-2 font-semibold text-forest underline underline-offset-4" onClick={() => {
          persist(undoAction); setUndoAction(null);
          requestAnimationFrame(() => savedRef.current?.focus());
        }}>Undo last change</button>}
  </div>;
  const startConversation = () => {
    if (!window.confirm('Start a new conversation? The unsaved conversation will be cleared. Your saved answers stay.')) return;
    setGenerated(null); setResult(null); setAnsweredQuestion(''); setEditedPlan('');
    setHistory([]); setNotice(''); setBackground(''); setConversationKey(key => key + 1);
    requestAnimationFrame(editQuestion);
  };
  const savedFirstLine = saved?.customPlan?.text.trim().split('\n')[0] ?? '';
  const savedHeading = savedFirstLine.length <= 200 ? savedFirstLine : 'Your saved plan';
  const savedBody = savedFirstLine.length <= 200 ? saved?.customPlan?.text.trim().split('\n').slice(1).join('\n').trim() : saved?.customPlan?.text;
  const composer = (
    <div className="min-w-0 rounded-2xl border border-ink/15 bg-surface p-5 sm:p-8 space-y-5">
            {!standalone && <div role="group" className="flex flex-wrap gap-2" aria-label="Question mode">
              {[['anything', 'Ask freely'], ['clothes', 'Use guided examples']].map(([item, label]) => <button key={item} type="button" aria-pressed={item === 'anything' ? decision.item === 'anything' : decision.item !== 'anything'} className="min-h-[44px] rounded-xl border border-forest px-4 py-2 font-semibold aria-pressed:bg-forest aria-pressed:text-white" onClick={() => {
                setDecision({ item: item as Decision['item'], intent: item === 'anything' ? 'explore' : 'buy', support: 'myself', budget: 'free' });
                setResult(null); setGenerated(null); setEditedPlan('');
              }}>{label}</button>)}
            </div>}
            {decision.item !== 'anything' && <>
            <label className="block font-semibold">What is the object?
              <select className={`${control} mt-2`} value={decision.item} onChange={e => change('item', e.target.value as Decision['item'])}>
                {Object.entries(itemLabels).filter(([id]) => id !== 'anything').map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </label>
            <label className="block font-semibold">What brings you here?
              <select className={`${control} mt-2`} value={decision.intent} onChange={e => change('intent', e.target.value as Decision['intent'])}>
                {Object.entries(intentLabels).filter(([id]) => id !== 'explore').map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </label>
            {decision.intent === 'fix' && <label className="block font-semibold">What needs attention?
              <select className={`${control} mt-2`} value={decision.issue ?? 'unsure'} onChange={e => change('issue', e.target.value as Decision['issue'])}>
                {issues[decision.item].map(issue => <option key={issue.id} value={issue.id}>{issue.label}</option>)}
              </select>
            </label>}
            {decision.intent === 'fix' && <label className="block font-semibold">How would you like to approach it?
              <select className={`${control} mt-2`} value={decision.support} onChange={e => change('support', e.target.value as Decision['support'])}>
                <option value="myself">Explore what I can do myself</option><option value="help">Find help with it</option>
              </select>
            </label>}
            {decision.intent !== 'pass' && <label className="block font-semibold">What fits your budget right now?
              <select className={`${control} mt-2`} value={decision.budget} onChange={e => change('budget', e.target.value as Decision['budget'])}>
                <option value="free">Start without spending</option><option value="flexible">I can consider a cost</option>
              </select>
            </label>}
            </>}
            <AIPlannerForm confirmEditedDraft={hasUnsavedEdits} background={background} key={conversationKey} context={context} followUp={!!generated} replyToClarification={generated?.plan.status === 'clarify'} standalone={standalone} initialQuestion={conversationKey === 0 ? initialQuestion : ''} decision={decision} hasDraft={!!generated} onBusyChange={setAsking} onResult={(snapshot, plan, question) => {
              if (generated) setHistory(context);
              else if (!background) setBackground(question);
              setNotice(''); library.clearNotice();
              setAnsweredQuestion(question);
              setResult(snapshot); setGenerated(plan); setEditedPlan(planText(plan.plan));
              if (editorDetailsRef.current) editorDetailsRef.current.open = false;
              requestAnimationFrame(() => { if (!standalone || tabs.current.current === 'ask') resultRef.current?.focus(); });
            }} onFallback={snapshot => {
              if (standalone) return;
              setResult(snapshot); setGenerated(null); setEditedPlan('');
            }} />
            {!standalone && <>
            <button className="min-h-[44px] py-2 text-sm font-semibold text-forest underline underline-offset-4" type="button" onClick={showBasic}>{decision.item === 'anything' ? 'Browse general guidance (no AI)' : 'Find my next step (basic guidance)'}</button>
            <p className="text-sm text-ink/80">General starting points. Your object’s condition, model and local services can change what is possible.</p>
            </>}
          </div>
  );
  return (
    <section id="decision-helper" tabIndex={-1} aria-labelledby="decision-title" className={`scroll-mt-20 border-y border-ink/10 bg-sage ${standalone ? 'py-8 lg:py-12' : 'py-16 lg:py-24'}`}>
      <div className={`mx-auto ${standalone ? 'max-w-[52rem]' : 'max-w-7xl'} px-4 sm:px-6 lg:px-8`}>
        <div className={`max-w-3xl ${standalone ? 'mb-5' : 'mb-8'}`}>
          {!standalone && <p className="section-kicker text-forest mb-3">ONE OBJECT. ONE NEXT STEP.</p>}
          <Heading ref={titleRef} tabIndex={-1} id="decision-title" className="scroll-mt-20 font-editorial text-3xl sm:text-4xl lg:text-5xl">{standalone ? 'Ask Before Waste' : 'What should I do with this?'}</Heading>

          {(!standalone || !generated) && <p className={standalone ? 'mt-2 text-base' : 'mt-4 text-lg'}>{standalone ? 'Find a practical next step for your items and lower-waste living. No account needed.' : 'Before you buy, replace or let something go, find a starting point that fits your life.'}</p>}
          {!standalone && <p className="mt-2 text-sm text-ink/80">Ask about any item, reducing waste or sustainable living. No account needed.</p>}
          {standalone ? <div role="tablist" aria-label="Assistant sections" className="mt-4 flex gap-2 border-b border-ink/15 pb-3">
            {['ask', 'saved'].map((name, index) => <button key={name} id={`${name}-tab`} type="button" role="tab" aria-selected={tabs.tab === name} aria-controls={name} tabIndex={tabs.tab === name ? 0 : -1} onClick={() => tabs.select(name)} onKeyDown={event => {
              if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === 'Home' ? 'ask' : event.key === 'End' ? 'saved' : ['ask', 'saved'][1 - index];
              tabs.select(next); document.getElementById(`${next}-tab`)?.focus();
            }} className="min-h-[44px] rounded-xl border border-forest/30 px-4 py-2 font-semibold text-forest aria-selected:bg-forest aria-selected:text-white">{name === 'ask' ? 'Ask' : library.unavailable ? 'Saved (unavailable)' : `Saved (${library.answers.length})`}</button>)}
          </div> : <>          <nav aria-label="Assistant sections" className="mt-4 flex flex-wrap gap-3 border-b border-ink/15 pb-3">
            <a href="#decision-title" className="inline-flex min-h-[44px] items-center rounded px-3 py-2 font-semibold text-forest underline underline-offset-4">Ask</a>
            <a href="#saved-action" className="inline-flex min-h-[44px] items-center rounded border border-forest/30 bg-paper px-3 py-2 font-semibold text-forest hover:bg-sage">My saved action <span className="ml-2 rounded-full bg-sage px-2 text-sm">{saved ? (storageAvailable ? '1' : 'Session only') : (storageAvailable ? '0' : 'Unavailable')}</span></a>
          </nav></>}


        </div>
        <div id={standalone ? 'ask' : undefined} tabIndex={standalone ? 0 : undefined} role={standalone ? 'tabpanel' : undefined} aria-labelledby={standalone ? 'ask-tab' : undefined} hidden={standalone && tabs.tab !== 'ask'} data-assistant-panel={standalone ? '' : undefined} className={standalone ? `${tabs.tab !== 'ask' ? 'hidden' : 'flex'} max-w-3xl flex-col gap-6` : 'grid gap-6 lg:grid-cols-2 items-start'}>
          {!standalone && composer}
          {(!standalone || result) && <>
          <div ref={resultRef} tabIndex={-1} aria-label="Your answer" className={`min-w-0 break-words rounded-2xl border border-ink/15 bg-surface p-5 sm:p-8 ${standalone ? 'scroll-mt-20 w-full' : 'scroll-mt-20'}`}>
            {advice && result ? <>
              {generated ? <>
                {!standalone && <div className="mb-5 rounded-xl border border-ink/15 bg-surface p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide">Answering your question</p><p className="mt-2 whitespace-pre-wrap break-words text-sm">{answeredQuestion}</p>
                  <button type="button" onClick={editQuestion} className="mt-2 min-h-[44px] py-2 text-sm font-semibold text-forest underline underline-offset-4">{generated.plan.status === 'clarify' ? 'Add details to my question' : 'Edit my question'}</button>
                </div>}

                <AIPlanContent generated={generated} question={answeredQuestion} standalone={standalone} />
                {standalone && <details className="mt-4 border-t border-ink/15 pt-2"><summary className="min-h-[44px] cursor-pointer py-2 text-sm font-semibold text-forest">View your question</summary><p className="whitespace-pre-wrap break-words text-sm">{answeredQuestion}</p></details>}


              </> : standalone ? <>
              <p className="section-kicker text-clay mb-3">AI UNAVAILABLE</p>
              <h3 className="text-2xl sm:text-3xl font-editorial">AI guidance isn’t available right now</h3>
              <p className="mt-4 leading-relaxed">Your question is kept in the form below — try again in a moment.</p>
              </> : <>
              <p className="section-kicker text-clay mb-3">BASIC GUIDANCE · NOT AI GENERATED</p>
              <p className="text-sm mb-3">{itemLabels[result.item]} · {intentLabels[result.intent]}</p>
              <h3 className="text-2xl sm:text-3xl font-editorial">{advice.title}</h3>
              <p className="mt-4 leading-relaxed">{advice.step}</p>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2 text-sm"><div><dt className="font-semibold">Time & effort</dt><dd className="mt-1">{advice.effort}</dd></div><div><dt className="font-semibold">Cost to consider</dt><dd className="mt-1">{advice.cost}</dd></div></dl>
              <p className="mt-5 text-sm leading-relaxed"><strong>Another way forward: </strong>{advice.alternative}</p>
              {result.item === 'headphones' && result.intent === 'fix' && <p className="mt-4 text-sm">If a battery is swollen, hot or damaged, stop using and charging the device and contact the manufacturer or a qualified service. Do not open it as a beginner repair.</p>}
              <div className="mt-6 border-t border-ink/15 pt-5"><h4 className="font-semibold">A possible next chapter</h4><p className="mt-2 text-sm">{advice.chapter}</p>
                <button type="button" className="min-h-[44px] py-2 text-forest underline underline-offset-4 text-sm font-semibold" onClick={() => onExploreObject(result.item === 'headphones' ? 'smartphone' : 'tshirt')}>{result.item === 'anything' ? 'Explore an example object story' : result.item === 'clothes' ? 'Explore the T-shirt story' : 'Explore a related electronics story: smartphone'}</button>
              </div>
              <p className="mt-3 text-sm">Related guidance: <a className="underline text-forest underline-offset-4" href={advice.resource.url}>{advice.resource.label}</a>.</p>
              {result.intent === 'fix' && <p className="mt-2 text-sm">Choose a matching guide and check tools, difficulty and model before starting.</p>}
              {result.intent === 'pass' && <p className="mt-3 text-sm">Before travelling, contact the recipient or collection service. Ask whether they accept this item in its current condition{result.item === 'headphones' ? ', whether batteries need special handling,' : ''} and whether there is a fee. US guidance is background information; use your municipality or manufacturer for local rules.</p>}
              <p className="mt-3 text-xs text-ink/80">Editorial starting points, not a diagnosis or a measured environmental saving. Check collection and donation acceptance locally.</p>
              </>}
              {saveHint && <p id="answer-save-hint" className="mt-4 text-sm text-ink/80">{saveHint}</p>}
              {(standalone ? canSaveAnswer : generated?.plan.status === 'ready') && !editedPlan.trim() && <p role="status" className="mt-4 text-sm text-clay">Add some text to the draft before saving it.</p>}
              {!(standalone && !generated) && <>
              {!standalone && saved && !isSameSaved && !updatingSaved && (!generated || generated.plan.status === 'ready') && <p className="mt-5 text-sm">One action is kept at a time. Replacing it starts fresh notes and progress; you can undo until the next change or reload.</p>}
              {(standalone ? canSaveAnswer : generated?.plan.status === 'ready') && <p className="mt-4 text-sm text-ink/80">Saving keeps this draft and your question, including any supplied location, in this browser.</p>}
              <div className="mt-3 flex flex-wrap items-start gap-3">
                {(standalone ? canSaveAnswer : (!generated || generated.plan.status === 'ready')) && (isSameSaved
                  ? <a href={standalone ? "#saved" : "#saved-action"} onClick={() => savedRef.current?.focus({ preventScroll: true })} className="inline-flex min-h-[44px] items-center rounded py-3 font-semibold text-forest underline underline-offset-4">{standalone ? (library.sessionOnly ? 'Session only · View saved' : 'Saved · View saved') : storageAvailable ? 'Saved · View my action' : 'Session only · View my action'}</a>
                  : <button type="button" disabled={!!generated && !editedPlan.trim()} className={`${primary} disabled:opacity-60`} onClick={saveResult}>{standalone ? 'Save answer' : saved ? (updatingSaved ? 'Update my saved action' : 'Replace my saved action') : 'Save action on this device'}</button>)}
                {(standalone ? canSaveAnswer : generated?.plan.status === 'ready') && <details ref={editorDetailsRef} className="min-w-0 max-w-full rounded-xl border border-ink/20 bg-surface open:w-full">
                  <summary className="min-h-[44px] cursor-pointer px-4 py-3 font-semibold">Edit before saving</summary>
                  <div className="border-t border-ink/15 p-4">
                    <label htmlFor="reviewed-plan" className="block font-semibold">Edit the answer to save</label>
                    <p className="mt-2 text-sm">Adjust the wording, then use the save button above. Edits stay in the draft until you save.</p>
                    <textarea id="reviewed-plan" className={`${control} mt-3 min-h-48`} maxLength={6000} value={editedPlan} onChange={e => { setEditedPlan(e.target.value); setNotice('Edits are not saved yet. Save to keep the updated action.'); }} />
                  </div>
                </details>}
              </div>
              </>}
              {standalone ? <p role="status" className={library.notice ? "mt-4 text-sm" : "sr-only"}>{library.notice}</p> : feedback}
            </> : <><h3 className="text-2xl font-editorial">Your answer will appear here.</h3><p className="mt-4 leading-relaxed">Ask a question to understand an idea or find a practical next step. Your answer will appear here, ready to review, edit and save.</p><p className="mt-4 text-sm">Include the details that matter to you. You can refine your question after reading the answer.</p></>}
          </div>
          </>}

          {standalone && composer}
          {standalone && history.length > 0 && <details className="rounded-xl border border-ink/15 bg-paper p-4"><summary className="min-h-[44px] cursor-pointer py-2 font-semibold">Recent exchanges</summary><p className="mt-2 text-sm text-ink/80">Up to two earlier exchanges are shown; answers may be shortened. Reloading clears the conversation.</p>{history.map((turn, i) => <div key={i} className="mt-4 border-t border-ink/15 pt-4"><p className="whitespace-pre-wrap break-words font-semibold">{turn.question}</p><p className="mt-2 whitespace-pre-wrap break-words text-sm">{turn.answer}</p></div>)}</details>}
            {generated && <details className="rounded-xl border border-ink/15 bg-paper p-4"><summary className="min-h-[44px] cursor-pointer py-2 font-semibold">Conversation settings</summary><label htmlFor="conversation-background" className="mt-2 block text-sm">Earlier details to keep using (optional)</label><p id="background-hint" className="mt-2 text-sm text-ink/80">Your first question is kept here so details survive longer conversations. Edit or clear anything that no longer applies. This background is sent with follow-ups and clears when you reload or start again.</p><textarea id="conversation-background" aria-describedby="background-hint" maxLength={1700} disabled={asking} rows={3} value={background} onChange={event => setBackground(event.target.value)} className={`${control} mt-3 disabled:opacity-60`} /><button type="button" className="mt-4 min-h-[44px] py-2 font-semibold text-forest underline underline-offset-4" onClick={startConversation}>Start a new conversation</button></details>}

        </div>
        {standalone && <section id="saved" role="tabpanel" aria-labelledby="saved-tab" tabIndex={0} hidden={tabs.tab !== 'saved'} data-assistant-panel="" className="max-w-3xl"><span id="saved-action" /><SavedAnswersView library={library} /></section>}
        {!standalone && !result && feedback}
        {!standalone && <section id="saved-action" tabIndex={-1} className="scroll-mt-20 mt-8 rounded-2xl border border-forest/30 bg-surface p-5 sm:p-8 max-w-3xl" aria-labelledby="saved-section-title">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="saved-section-title" className="text-2xl font-editorial">My saved action</h2>
            <a href="#decision-title" className="inline-flex min-h-[44px] items-center rounded py-2 text-sm font-semibold text-forest underline underline-offset-4">Back to Ask</a>
          </div>
          <p className="mt-2 mb-5 text-sm text-ink/80">Keep one action on this device, in this browser. It does not sync across devices; clearing browser data removes it.</p>
          {saved ? <>
          {!storageAvailable && <div className="mb-4 rounded-xl border border-clay/30 bg-paper p-3 text-sm">
            <p role="status">Session only: this action could not be saved on this device. Keep this tab open or copy the plan.</p>
            <button type="button" className="mt-2 min-h-[44px] rounded py-2 font-semibold text-forest underline underline-offset-4" onClick={() => persist(saved)}>Try saving again</button>
          </div>}
          {!saved.customPlan && <p className="text-sm mb-2">{itemLabels[saved.item]} · {intentLabels[saved.intent]}</p>}
          <h3 ref={savedRef} tabIndex={-1} id="saved-action-title" className="scroll-mt-20 text-2xl font-editorial">{saved.customPlan ? savedHeading : recommend(saved).title}</h3>
          {saved.question && <details className="mt-4 rounded-xl border border-ink/15 p-4"><summary className="min-h-[44px] cursor-pointer py-2 font-semibold">Your original question and context</summary><p className="whitespace-pre-wrap break-words text-sm">{saved.question}</p></details>}
          {saved.customPlan ? <>
            <p className="mt-3 text-sm">{saved.customPlan.source === 'ai' ? 'AI-assisted plan' : 'Safety guidance'}</p>
            {savedBody && <p className="mt-4 whitespace-pre-wrap leading-relaxed">{savedBody}</p>}
            <CopyTextButton text={saved.customPlan.text} label="Copy saved plan" />
          </> : <>
          <p className="mt-3">{recommend(saved).step}</p>
          <a className="inline-flex min-h-[44px] items-center mt-2 text-forest underline underline-offset-4" href={recommend(saved).resource.url}>{recommend(saved).resource.label}</a>
          </>}
          <p className="mt-3 text-sm text-ink/80">Notes and outcomes save as you change them when storage is available. No automatic reminders.</p>
          <label className="block mt-5 font-semibold" htmlFor="action-outcome">What happened?</label>
          <select id="action-outcome" className={`${control} mt-2`} value={saved.outcome} onChange={e => persist({ ...saved, outcome: e.target.value as Outcome })}>
            <option value="planned">I am planning to try it</option><option value="done">I tried it and it worked</option><option value="blocked">Something got in the way</option><option value="changed">I chose another option</option>
          </select>
          {saved.outcome === 'blocked' && <div className="mt-5 rounded-xl border border-sage-border bg-sage p-4">
            <label className="block font-semibold" htmlFor="action-barrier">What got in the way?</label>
            <select id="action-barrier" className={`${control} mt-2`} value={saved.barrier ?? ''} onChange={e => persist({ ...saved, barrier: e.target.value ? e.target.value as Barrier : undefined })}>
              <option value="">Choose a barrier (optional)</option>
              {Object.entries(barrierLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
            <div role="status" className="mt-3 text-sm leading-relaxed">
              {saved.barrier ? recoveryAdvice(saved, saved.barrier) : 'Choose a barrier for another way forward. Your note and original action will stay here.'}
            </div>
            {(saved.barrier === 'tools' || saved.barrier === 'access') && saved.intent === 'fix' && <p className="mt-3 text-sm"><a href="https://www.repaircafe.org/en/visit/" className="text-forest underline underline-offset-4">Find a Repair Café</a>. Coverage, opening times and accepted repairs vary; contact the group first.</p>}
          </div>}
          <label className="block mt-5 font-semibold" htmlFor="action-note">My next step or what got in the way <span className="font-normal">(optional)</span></label>
          <textarea id="action-note" className={`${control} mt-2 min-h-28`} maxLength={1000} value={saved.note} onChange={e => persist({ ...saved, note: e.target.value })} />
          <button type="button" className="mt-4 min-h-[44px] py-2 underline underline-offset-4 text-sm" onClick={() => {
            if (persist(null)) {
              setUndoAction(saved);
              requestAnimationFrame(() => titleRef.current?.focus());
            }
          }}>Remove saved action</button>
          <a className="ml-5 inline-flex min-h-[44px] items-center text-sm underline underline-offset-4" href={standalone ? '/#pause' : '#pause'}>Try the 7-Day Pause</a>
          </> : <div className="rounded-xl border border-dashed border-forest/30 bg-paper p-4">
            <p className="font-semibold">{storageAvailable ? 'No saved action yet' : 'Saved action unavailable'}</p>
            <p className="mt-2 text-sm text-ink/80">{storageAvailable ? 'Ask for guidance, review an actionable answer, then choose “Save action on this device”. Explanations and clarification questions are not saved as actions.' : 'This browser could not read your saved action. An earlier action may still be stored; nothing has been removed.'}</p>
            {!storageAvailable && <button type="button" className="mt-2 min-h-[44px] rounded py-2 font-semibold text-forest underline underline-offset-4" onClick={() => {
              const loaded = readAction();
              setStorageAvailable(!loaded.unavailable);
              if (!loaded.unavailable) setSaved(loaded.action);
              setNotice(loaded.unavailable ? 'Your saved action still could not be read. Try another time or check this browser’s storage settings.' : loaded.action ? 'Saved action loaded on this browser.' : 'No saved action was found on this browser.');
            }}>Try loading again</button>}
          </div>}
        </section>}
      </div>
    </section>
  );
}
