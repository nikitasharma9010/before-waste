import { readSavedAnswers } from '../utils/savedAnswers';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { handoffQuestion } from '../utils/questionDraft';

export function AssistantEntry() {
  const [saved] = useState(() => readSavedAnswers().answers.length);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  return <section id="assistant-entry" aria-labelledby="entry-title" className="border-y border-ink/10 bg-sage py-8 sm:py-10">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-6 lg:grid-cols-2 lg:items-center">
      <div><p className="section-kicker text-forest">A PRACTICAL NEXT STEP</p><h2 id="entry-title" className="mt-3 font-editorial text-2xl sm:text-3xl">Choose a next step for your situation.</h2><p className="mt-3 max-w-xl text-ink/80">Ask about any item, repair, reuse or sustainable living. Continue to a dedicated space to add context, review guidance and save useful guidance.</p></div>
      <div>{saved && <a href="/ask#saved" className="mb-4 inline-flex min-h-[44px] items-center font-semibold text-forest underline underline-offset-4">View saved answers</a>}
      <form action="/ask" method="get" className="space-y-3" onSubmit={event => {
        if (!handoffQuestion(question)) { event.preventDefault(); setError('This browser could not carry your draft. Copy your question, then open the assistant using the link below.'); }
      }}>
        <label htmlFor="entry-question" className="block font-semibold">What would you like to know?</label>
        <textarea id="entry-question" required minLength={10} maxLength={1500} rows={2} value={question} onChange={event => {setQuestion(event.target.value);setError('');}} aria-describedby="entry-hint" className="w-full min-h-24 rounded-xl border border-ink/25 bg-paper p-3 text-base" placeholder="How can I waste less food in a small flat?" />
        <p id="entry-hint" className="text-sm text-ink/80">Use 10-1500 characters. Continue keeps your draft temporarily in this tab. Nothing is sent to AI yet. Leave out private information.</p>
        <button type="submit" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 font-semibold text-white hover:bg-forest-strong">Continue to assistant<ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
        {error && <div role="alert" className="text-sm"><p>{error}</p><a href="/ask" className="inline-flex min-h-[44px] items-center font-semibold text-forest underline">Open assistant without the draft</a></div>}
      </form></div>
    </div>
  </section>;
}
