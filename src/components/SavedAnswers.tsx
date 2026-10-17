import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { CopyTextButton } from './CopyTextButton';
import { readSavedAnswers, writeSavedAnswers, type SavedAnswer } from '../utils/savedAnswers';
export function useAnswerLibrary(enabled: boolean) {
  const [initial] = useState(() => enabled ? readSavedAnswers() : { answers: [], unavailable: false });
  const [answers, setAnswers] = useState(initial.answers);
  const [unavailable, setUnavailable] = useState(initial.unavailable);
  const [sessionOnly, setSessionOnly] = useState(false);
  const [notice, setNotice] = useState('');
  const [removed, setRemoved] = useState<SavedAnswer | null>(null);
  function persist(next: SavedAnswer[], allowSession = false) {
    if (unavailable) { setNotice('Saved answers could not be read. Try loading again before making changes.'); return false; }
    const latest = readSavedAnswers();
    if (latest.unavailable) { setUnavailable(true); setNotice('Saved answers could not be read. Nothing has been overwritten.'); return false; }
    const additions = latest.answers.filter(a => !answers.some(previous => previous.id === a.id) && !next.some(candidate => candidate.id === a.id));
    next = [...next, ...additions];
    if (next.length > 100) { setNotice('You have 100 saved answers. Remove one before saving another.'); return false; }
    const success = writeSavedAnswers(next);
    if (!success && !allowSession) { setNotice('This change could not be saved. Your answers have been kept.'); return false; }
    setAnswers(next); setSessionOnly(!success);
    setNotice(success ? 'Saved answers updated on this browser.' : 'Session only: keep this tab open or copy your answer. Browser storage is unavailable.');
    return true;
  }
  return { answers, unavailable, sessionOnly, notice, removed, clearNotice() { setNotice(''); },
    save(question: string, text: string) {
      if (answers.some(a => a.question === question && a.text === text)) return;
      if (answers.length >= 100) { setNotice('You have 100 saved answers. Remove one before saving another.'); return; }
      persist([{ id: crypto.randomUUID(), question, text, createdAt: Date.now() }, ...answers], true);
    },
    remove(answer: SavedAnswer) { if (persist(answers.filter(a => a.id !== answer.id))) setRemoved(answer); },
    undo() { if (removed && persist([removed, ...answers])) setRemoved(null); },
    retry() { persist(answers); },
    reload() { const loaded = readSavedAnswers(); setUnavailable(loaded.unavailable); if (!loaded.unavailable) { setAnswers(loaded.answers); setSessionOnly(false); } setNotice(loaded.unavailable ? 'Saved answers still could not be read. Nothing has been removed.' : 'Saved answers loaded.'); },
  };
}
export function useAssistantTabs(enabled: boolean) {
  const fromHash = () => ['#saved', '#saved-action'].includes(location.hash) ? 'saved' : 'ask';
  const [tab, setTab] = useState(fromHash);
  const current = useRef(tab); current.current = tab;
  useEffect(() => {
    if (!enabled) return;
    const sync = () => flushSync(() => setTab(fromHash()));
    const reveal = (event: Event) => {
      const panel = (event.target as HTMLElement).closest('[data-assistant-panel]');
      if (panel) flushSync(() => setTab(panel.id));
    };
    window.addEventListener('hashchange', sync); window.addEventListener('popstate', sync);
    document.addEventListener('section-reveal', reveal);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); document.removeEventListener('section-reveal', reveal); };
  }, [enabled]);
  return { tab, current, select(next: string) { setTab(next); if (location.hash !== `#${next}`) history.pushState(null, '', `#${next}`); } };
}
export function SavedAnswersView({ library }: { library: ReturnType<typeof useAnswerLibrary> }) {
  const heading = useRef<HTMLHeadingElement>(null);
  return <div className="space-y-5">
    <div><h2 ref={heading} tabIndex={-1} className="font-editorial text-2xl">Saved answers</h2><p className="mt-2 text-sm text-ink/80">Stored in this browser on this device. No account or sync; clearing browser data removes saved answers. Questions and any supplied location are included.</p></div>
    <p role="status" className={library.notice ? 'text-sm' : 'sr-only'}>{library.notice}</p>
    {library.removed && <button type="button" className="min-h-[44px] font-semibold text-forest underline" onClick={library.undo}>Undo removal</button>}
    {library.unavailable ? <div><p>Saved answers could not be read. Nothing has been removed.</p><button type="button" className="min-h-[44px] text-forest underline" onClick={library.reload}>Try loading again</button></div> : <>
      {library.sessionOnly && <div className="rounded-xl border border-clay/30 p-4"><p>Some answers are available for this session only. Copy them before closing this tab.</p><button type="button" className="min-h-[44px] text-forest underline" onClick={library.retry}>Try saving again</button></div>}
      {!library.answers.length && <div className="rounded-2xl border border-dashed border-forest/30 bg-surface p-5"><h3 className="font-semibold">No saved answers yet</h3><p className="mt-2">Save useful guidance or explanations to return to them here.</p><a className="inline-flex min-h-[44px] items-center text-forest underline" href="#ask">Ask a question</a></div>}
      {library.answers.map(answer => <details key={answer.id} className="min-w-0 rounded-2xl border border-ink/15 bg-surface p-5 sm:p-6">
        <summary className="min-h-[44px] cursor-pointer break-words font-semibold"><span>{answer.text.trim().split('\n')[0].slice(0, 160)}</span><span className="mt-2 block text-sm font-normal text-ink/80">{answer.createdAt ? new Date(answer.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Previously saved'}</span></summary>
        <div className="mt-4 whitespace-pre-wrap break-words leading-relaxed">{answer.text}</div>
        {answer.question && <details className="mt-4 border-t border-ink/15"><summary className="min-h-[44px] cursor-pointer py-3 text-sm font-semibold">Original question</summary><p className="whitespace-pre-wrap break-words text-sm">{answer.question}</p></details>}
        {(answer.legacyNote || answer.legacyOutcome) && <details className="mt-3"><summary className="min-h-[44px] cursor-pointer py-3 text-sm">Earlier notes and progress</summary><p className="whitespace-pre-wrap break-words text-sm">{answer.legacyNote}</p><p className="text-sm">{answer.legacyOutcome}</p></details>}
        <div className="mt-4 flex flex-wrap items-center gap-4"><CopyTextButton text={answer.text} label="Copy saved answer" /><button type="button" className="min-h-[44px] text-sm text-forest underline underline-offset-4" onClick={() => { library.remove(answer); requestAnimationFrame(() => heading.current?.focus({ preventScroll: true })); }}>Remove saved answer</button></div>
      </details>)}
    </>}
  </div>;
}
