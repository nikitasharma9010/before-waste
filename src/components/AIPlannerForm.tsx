import { useEffect, useRef, useState } from 'react';
import type { Decision } from '../data/decisionData';
import { parseGeneratedPlan, type GeneratedPlan } from '../data/aiPlan';

export function AIPlannerForm({ decision, onResult, onFallback, onClear }: {
  decision: Decision;
  onResult: (decision: Decision, plan: GeneratedPlan) => void;
  onFallback: (decision: Decision) => void;
  onClear: () => void;
}) {
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    setBusy(false); setError('');
    return () => controller.current?.abort();
  }, [decision]);
  async function generate() {
    controller.current?.abort();
    const pending = new AbortController(); controller.current = pending;
    const snapshot = { ...decision };
    onClear();
    setBusy(true); setError('');
    const timer = setTimeout(() => pending.abort('timeout'), 25000);
    try {
      const response = await fetch('/api/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...snapshot, description }), signal: pending.signal });
      const data: unknown = await response.json();
      if (pending.signal.aborted) return;
      if (!response.ok) {
        const message = typeof data === 'object' && data && 'error' in data && typeof data.error === 'string' ? data.error : 'AI planning is unavailable. Use the basic guidance below.';
        throw new Error(message);
      }
      const plan = parseGeneratedPlan(data);
      if (!plan) throw new Error('AI returned an incomplete plan. Basic guidance is shown below.');
      onResult(snapshot, plan);
    } catch (failure) {
      if (pending.signal.aborted && pending.signal.reason !== 'timeout') return;
      setError(pending.signal.reason === 'timeout' ? 'AI took too long. Basic guidance is shown below.' : failure instanceof Error && failure.message.length < 200 ? failure.message : 'AI could not connect. Basic guidance is shown below.');
      onFallback(snapshot);
    } finally {
      clearTimeout(timer);
      if (controller.current === pending) setBusy(false);
    }
  }
  return <div className="border-t border-ink/15 pt-5 space-y-3">
    <label htmlFor="ai-description" className="block font-semibold">Describe your situation for an AI plan <span className="font-normal">(optional)</span></label>
    <textarea id="ai-description" rows={5} maxLength={1500} value={description}
      onChange={event => { controller.current?.abort(); setBusy(false); setDescription(event.target.value); setError(''); onClear(); }}
      aria-describedby="ai-privacy ai-length" className="w-full min-h-32 rounded-xl border border-ink/25 bg-paper p-3 font-normal"
      placeholder="What is wrong, what have you tried, and what fits your budget, time and available tools?" />
    <p id="ai-length" className="text-xs text-ink/80">{description.length}/1500 characters. Write at least 20 to generate a plan.</p>
    <p id="ai-privacy" className="text-sm text-ink/80">Generate sends this description and selected answers to the configured AI service: Google Gemini or AICredits and its model provider. Automatic fallback may send it to both services. Leave out private information. Your saved notes are not sent.</p>
    <button type="button" disabled={busy || description.trim().length < 20} onClick={() => void generate()}
      className="min-h-[44px] rounded-xl bg-forest px-5 py-3 font-semibold text-white hover:bg-forest-strong disabled:opacity-60 disabled:cursor-not-allowed">{busy ? 'Creating your AI plan…' : 'Generate AI plan'}</button>
    {busy && <button type="button" className="ml-3 min-h-[44px] py-2 underline" onClick={() => { controller.current?.abort(); setBusy(false); }}>Cancel</button>}
    <p role="status" className="text-sm">{busy ? 'Reading your situation and preparing a draft. You will choose what to save.' : ''}</p>
    {error && <p role="alert" className="text-sm text-clay">{error}</p>}
  </div>;
}
