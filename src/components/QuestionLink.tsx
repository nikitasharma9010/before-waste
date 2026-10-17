import { useState } from 'react';
import { handoffQuestion } from '../utils/questionDraft';

/** Carry an editable question within this tab; sending to AI is a separate user action. */
export function QuestionLink({ question, label }: { question: string; label: string }) {
  const [failed, setFailed] = useState(false);
  return <>
    <a href="/ask" className="mt-3 inline-flex min-h-[44px] items-center rounded-xl bg-forest px-5 py-3 font-semibold text-white hover:bg-forest-strong" onClick={event => {
      if (!handoffQuestion(question)) { event.preventDefault(); setFailed(true); }
    }}>{label}</a>
    {failed && <div role="alert" className="mt-3 text-sm"><p>Your browser could not carry the draft. Copy this question, then open the assistant:</p><p className="mt-2 select-text">{question}</p><a href="/ask" className="inline-flex min-h-[44px] items-center text-forest underline">Open assistant</a></div>}
  </>;
}
