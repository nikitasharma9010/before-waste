import { useState } from 'react';
import { handoffQuestion } from '../utils/questionDraft';

const questions: Record<string, string> = {
  tshirt: 'I have a T-shirt I no longer wear. What should I check before repairing, reusing or passing it on?',
  smartphone: 'I have an older smartphone. What should I check before keeping, repairing or passing it on?',
  food: 'How can I prevent food waste at home? Help me choose a practical action that fits my situation.',
  package: 'I have packaging to deal with. What information should I check to choose between reuse and local collection?',
};
export function StoryActionLink({ objectId }: { objectId: string }) {
  const [failed, setFailed] = useState(false);
  const question = questions[objectId] ?? 'Help me choose a practical next step to reduce waste in my situation.';
  return <div className="mt-5 border-t border-ink/15 pt-5">
    <p className="text-sm">Apply this story to your own situation. You can edit the question before sending it.</p>
    <a href="/ask" className="mt-3 inline-flex min-h-[44px] items-center rounded-xl bg-forest px-5 py-3 font-semibold text-white hover:bg-forest-strong" onClick={event => {
      if (!handoffQuestion(question)) { event.preventDefault(); setFailed(true); }
    }}>Plan my next step</a>
    {failed && <div role="alert" className="mt-3 text-sm"><p>Your browser could not carry the draft. Copy this question, then open the assistant:</p><p className="mt-2 select-text">{question}</p><a href="/ask" className="inline-flex min-h-[44px] items-center text-forest underline">Open assistant</a></div>}
  </div>;
}
