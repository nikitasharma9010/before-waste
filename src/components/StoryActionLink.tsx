import { QuestionLink } from './QuestionLink';

const questions: Record<string, string> = {
  tshirt: 'I have a T-shirt I no longer wear. What should I check before repairing, reusing or passing it on?',
  smartphone: 'I have an older smartphone. What should I check before keeping, repairing or passing it on?',
  food: 'How can I prevent food waste at home? Help me choose a practical action that fits my situation.',
  package: 'I have packaging to deal with. What information should I check to choose between reuse and local collection?',
};
export function StoryActionLink({ objectId }: { objectId: string }) {
  const question = questions[objectId] ?? 'Help me choose a practical next step to reduce waste in my situation.';
  return <div className="mt-5 border-t border-ink/15 pt-5">
    <p className="text-sm">Apply this story to your own situation. You can edit the question before sending it.</p>
    <QuestionLink question={question} label="Plan my next step" />
  </div>;
}
