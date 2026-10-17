import { PLAN_LABELS, PLAN_RESOURCES, type GeneratedPlan } from '../data/aiPlan';

export function AIPlanContent({ generated, question = '' }: { generated: GeneratedPlan; question?: string }) {
  const { plan } = generated;
  return <div className="space-y-4">
    <p className="section-kicker text-forest">{generated.source === 'ai' ? 'AI-GENERATED DRAFT · REVIEW BEFORE ACTING' : 'SAFETY GUIDANCE · NOT AI GENERATED'}</p>
    <h3 className="text-2xl sm:text-3xl font-editorial">{plan.action}</h3>
    <p>{plan.summary}</p>
    <p><strong>{PLAN_LABELS.reason}: </strong>{plan.reason}</p>
    {plan.steps.length > 0 && <div><h4 className="font-semibold mb-2">{PLAN_LABELS.steps}</h4><ol className="list-decimal pl-5 space-y-2">{plan.steps.map((step, i) => <li key={i}>{step}</li>)}</ol></div>}
    {plan.alternative && <p><strong>{PLAN_LABELS.alternative}: </strong>{plan.alternative}</p>}
    {plan.questions.length > 0 && <div className="rounded-xl bg-sage p-4"><h4 className="font-semibold">{PLAN_LABELS.questions}</h4><ul className="list-disc pl-5 mt-2 space-y-2">{plan.questions.map(q => <li key={q}>{q}</li>)}</ul></div>}
    {plan.resourceIds.length > 0 && <div><h4 className="font-semibold">{PLAN_LABELS.resources}</h4><ul className="mt-2 space-y-2">{plan.resourceIds.map(id => <li key={id}><a className="text-forest underline underline-offset-4" href={PLAN_RESOURCES[id].url}>{PLAN_RESOURCES[id].label}</a></li>)}</ul></div>}
    {/food|vegetable|fruit|scrap|broth|leftover|produce/i.test(question + ' ' + plan.summary + ' ' + plan.steps.join(' ')) && <aside className="rounded-xl border border-ink/20 bg-sage p-4 text-sm" aria-label="Food safety"><strong>Food safety comes first.</strong> Use only ingredients you know are edible and handle and store them safely. This assistant cannot determine whether food is safe to eat. When condition or storage is uncertain, check qualified food-safety guidance before consuming it. <a className="text-forest underline underline-offset-4" href="https://www.fda.gov/food/buy-store-serve-safe-food/selecting-and-serving-produce-safely">FDA produce handling guidance (US resource)</a></aside>}
    {generated.source === 'ai' && <p className="text-xs text-ink/80">{plan.resourceIds.length === 0 ? 'No matching resource in our catalogue accompanies this answer. ' : ''}AI can make mistakes. Verify specific claims, item instructions and local rules before acting; local services are not checked live.</p>}
  </div>;
}
