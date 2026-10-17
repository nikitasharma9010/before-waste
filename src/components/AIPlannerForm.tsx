import { useEffect, useRef, useState } from 'react';
import { LoaderCircle, Sparkles } from 'lucide-react';
import type { Decision } from '../data/decisionData';
import { parseGeneratedPlan, type GeneratedPlan } from '../data/aiPlan';

const starters = ['How can I waste less food?', 'What can I do with a broken chair?', 'What does a circular economy mean?'];
export function AIPlannerForm({ decision, hasDraft, initialQuestion = '', standalone = false, onResult, onFallback, onBusyChange }: {
  decision: Decision;
  initialQuestion?: string;
  hasDraft: boolean;
  standalone?: boolean;
  onResult: (decision: Decision, plan: GeneratedPlan, question: string) => void;
  onFallback: (decision: Decision) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [description, setDescription] = useState(initialQuestion);
  const [location, setLocation] = useState('');
  const [showLocation, setShowLocation] = useState(!standalone);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [status, setStatus] = useState('');
  const field = useRef<HTMLTextAreaElement>(null);
  const locationField = useRef<HTMLInputElement>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    setBusy(false); setError(''); setInvalid(false); setStatus('');
    return () => controller.current?.abort();
  }, [decision]);
  useEffect(() => { onBusyChange?.(busy); }, [busy, onBusyChange]);
  function update(value: string) {
    controller.current?.abort(); setBusy(false); setDescription(value); setError(''); setInvalid(false);
    setStatus(busy ? 'Request cancelled because the question changed.' : '');
  }
  async function generate() {
    if (busy) return;
    if (description.trim().length < 10) {
      setInvalid(true); setError('Add a little more detail: use at least 10 characters.'); field.current?.focus(); return;
    }
    controller.current?.abort();
    const pending = new AbortController(); controller.current = pending;
    const snapshot = { ...decision };
    const question = description.trim();
    setBusy(true); setError(''); setInvalid(false); setStatus('Preparing your answer. This can take up to 25 seconds.');
    const timer = setTimeout(() => pending.abort('timeout'), 25000);
    try {
      const response = await fetch('/api/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...snapshot, description: question, ...(location.trim() ? { location: location.trim() } : {}) }), signal: pending.signal });
      const data: unknown = await response.json();
      if (pending.signal.aborted) return;
      if (!response.ok) {
        const message = typeof data === 'object' && data && 'error' in data && typeof data.error === 'string' ? data.error : 'AI assistance is unavailable right now.';
        throw new Error(message);
      }
      const plan = parseGeneratedPlan(data);
      if (!plan) throw new Error('AI returned an incomplete answer.');
      setStatus('Your answer is ready to review.');
      onResult(snapshot, plan, location.trim() ? `${question}\nLocation: ${location.trim()}` : question);
    } catch (failure) {
      if (pending.signal.aborted && pending.signal.reason !== 'timeout') return;
      const message = pending.signal.reason === 'timeout' ? 'The request timed out.' : failure instanceof Error && failure.message.length < 200 ? failure.message : 'AI could not connect.';
      setError(message); setStatus('');
      if (!hasDraft) onFallback(snapshot);
    } finally {
      clearTimeout(timer);
      if (controller.current === pending) setBusy(false);
    }
  }
  return <form aria-label="Ask Before Waste" className="border-t border-ink/15 pt-5 space-y-4" onSubmit={event => { event.preventDefault(); void generate(); }}>
    <div>
      <label htmlFor="ai-description" className="block font-semibold">Ask about an item or sustainable living</label>
      <p id="ai-hint" className="mt-2 text-sm text-ink/80">Ask a question or describe your situation. Add your location, budget, what you tried or other relevant details.</p>
    </div>
    <textarea ref={field} id="ai-description" rows={4} maxLength={1500} value={description}
      onChange={event => update(event.target.value)} aria-invalid={invalid || undefined}
      onKeyDown={event => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.nativeEvent.isComposing) { event.preventDefault(); void generate(); } }}
      aria-describedby={`ai-hint ai-privacy-summary ai-length${error ? ' ai-error' : ''}`} className="w-full min-h-32 rounded-xl border border-ink/25 bg-paper p-3 text-base font-normal aria-invalid:border-clay"
      placeholder="What would you like to know?" />
    {!description && decision.item === 'anything' && <div role="group" aria-label="Example questions" className="flex flex-wrap gap-2">
      {starters.map(question => <button key={question} type="button" className="min-h-[44px] rounded-xl border border-ink/20 px-3 py-2 text-left text-sm hover:bg-sage" onClick={() => { update(question); field.current?.focus(); }}>{question}</button>)}
    </div>}
    <p id="ai-length" className="text-xs text-ink/80">{description.length}/1500 characters · Minimum 10. Enter adds a new line; Ctrl or ⌘ + Enter sends.</p>
    {showLocation ? <div>
      <label htmlFor="ai-location" className="block text-sm font-semibold">City or region and country <span className="font-normal">(optional)</span></label>
      <input ref={locationField} id="ai-location" type="text" maxLength={120} value={location} aria-describedby="ai-location-hint" placeholder="For example: Pune, India" className="mt-2 w-full min-h-[44px] rounded-xl border border-ink/25 bg-paper p-3 text-base" onChange={event => {
        controller.current?.abort(); setBusy(false); setLocation(event.target.value); setError(''); setInvalid(false); setStatus('');
      }} />
      <p id="ai-location-hint" className="mt-2 text-sm text-ink/80">Share only if relevant. No address needed; location is never detected automatically. Local services and rules still need confirmation.</p>
    </div> : <button type="button" className="min-h-[44px] py-2 text-sm font-semibold text-forest underline underline-offset-4" onClick={() => { setShowLocation(true); requestAnimationFrame(() => locationField.current?.focus()); }}>+ Add your location (optional)</button>}
    <p id="ai-privacy-summary" className="text-sm text-ink/80">{standalone ? 'Leave out private information — your question goes to an external AI service.' : 'AI can make mistakes. Leave out private information. You choose what to save.'}</p>
    <details className="text-sm text-ink/80"><summary className="min-h-[44px] cursor-pointer py-3 underline underline-offset-4">How your question is used</summary>
      <p id="ai-privacy" className="pb-3">Your question, optional location and selected answers are sent to an external AI service to prepare a response. If the first service is unavailable, a backup service may process the same details. Your saved notes are not sent. Answers do not include a live local-service search.</p>
    </details>
    {hasDraft && <p className="text-sm">Your current draft stays available while you edit or retry. A successful new answer replaces the unsaved draft; your saved action stays.</p>}
    <div className="flex flex-wrap items-center gap-3">
      <button type="submit" disabled={busy} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 font-semibold text-white hover:bg-forest-strong disabled:opacity-60 disabled:cursor-not-allowed">
        {busy ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Sparkles aria-hidden="true" className="h-4 w-4" />}
        {busy ? 'Preparing answer…' : error && !invalid ? 'Try again' : 'Get AI guidance'}
      </button>
      {busy && <button type="button" className="min-h-[44px] rounded-xl border border-ink/25 px-4 py-3 font-semibold" onClick={() => {
        controller.current?.abort(); setBusy(false); setStatus('Request cancelled. Your question is kept.'); field.current?.focus();
      }}>Cancel request</button>}
    </div>
    <p role="status" aria-live="polite" aria-atomic="true" className="text-sm">{status}</p>
    {error && <div className="rounded-xl border border-clay/30 bg-paper p-4 text-sm"><p id="ai-error" role="alert">{error}</p>{!invalid && <p className="mt-2">{standalone ? 'Your question is kept. Try again in a moment.' : 'Your question is kept. Try again or use basic guidance.'}{hasDraft ? ' Your previous draft is still available.' : ''}</p>}</div>}
  </form>;
}
