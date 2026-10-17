import { PLAN_RESOURCES, type GeneratedPlan } from '../data/aiPlan';

export function AIPlanContent({ generated }: { generated: GeneratedPlan }) {
  const { plan } = generated;
  return <div className="space-y-4">
    <p className="section-kicker text-forest">{generated.source === 'ai' ? 'AI-GENERATED DRAFT · REVIEW BEFORE ACTING' : 'SAFETY GUIDANCE · NOT AI GENERATED'}</p>
    <h3 className="text-2xl sm:text-3xl font-editorial">{plan.action}</h3>
    <p>{plan.summary}</p>
    <p><strong>Why this fits: </strong>{plan.reason}</p>
    {plan.steps.length > 0 && <ol className="list-decimal pl-5 space-y-2">{plan.steps.map((step, i) => <li key={i}>{step}</li>)}</ol>}
    <p><strong>Another way forward: </strong>{plan.alternative}</p>
    {plan.questions.length > 0 && <div className="rounded-xl bg-sage p-4"><h4 className="font-semibold">Before deciding</h4><ul className="list-disc pl-5 mt-2 space-y-2">{plan.questions.map(q => <li key={q}>{q}</li>)}</ul><p className="mt-3 text-sm">Add your answers to the description and generate again.</p></div>}
    {plan.resourceIds.length > 0 && <div><h4 className="font-semibold">Resources to check</h4><ul className="mt-2 space-y-3">{plan.resourceIds.map(id => <li key={id}><a className="text-forest underline underline-offset-4" href={PLAN_RESOURCES[id].url}>{PLAN_RESOURCES[id].label}</a><p className="mt-1 text-xs text-ink/80">{PLAN_RESOURCES[id].note}</p></li>)}</ul></div>}
    {generated.source === 'ai' && plan.resourceIds.length === 0 && <p className="text-sm text-ink/80">No matching resource in our catalogue accompanies this answer. Treat it as general AI guidance and verify specific claims before acting.</p>}
    {generated.source === 'ai' && <p className="text-xs text-ink/80">Generated via {generated.provider === 'aicredits' ? 'AICredits' : 'Google Gemini'} with {generated.model} using supplied guidance, without a live local-service search. AI can make mistakes; confirm model-specific instructions and local rules.</p>}
  </div>;
}
