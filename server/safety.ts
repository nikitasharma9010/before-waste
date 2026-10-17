import type { GeneratedPlan } from '../src/data/aiPlan.js';

// Conservative English symptom routing, not a diagnosis or a general hazard classifier.
// Keep clauses separate so negated/hypothetical discussion does not suppress another active symptom.
export function batterySafety(description: string): GeneratedPlan | null {
  const clauses = description.split(/[.!?;\n]|\bbut\b/i);
  let warning = false;
  let emergency = false;
  for (const clause of clauses) {
    if (!/battery|batteries|phone|laptop|tablet|earbud|headphone|power bank|device/i.test(clause)) continue;
    const symptoms = [...clause.matchAll(/\b(?:swollen|swelling|bulging|smoking|smoke|burning|on fire|hot|overheating|leaking|damaged)\b/gi)];
    for (const symptom of symptoms) {
      const prefix = clause.slice(0, symptom.index);
      if (/\b(?:prevent|prevention|hypothetical|suppose|imagine|what if|if my|if a|if the)\b/i.test(prefix)) continue;
      if (/\b(?:not|isn't|is not|isn’t|no|without|never)\s+(?:(?:currently|visibly|getting|any|signs? of)\s+)*$/i.test(prefix)) continue;
      if (/damaged/i.test(symptom[0]) && !/batter(?:y|ies)/i.test(clause)) continue;
      warning = true;
      if (/smok|burning|on fire/i.test(symptom[0])) emergency = true;
    }
  }
  if (!warning) return null;
  return { source: 'safety', model: '', plan: {
    status: 'ready',
    action: emergency ? 'Move away from the device and seek emergency help' : 'Stop using and charging the device',
    summary: emergency ? 'You described possible smoke or fire involving a device.' : 'Your description may indicate a damaged battery.',
    reason: emergency ? 'Immediate safety comes before repair, reuse or collection.' : 'A potentially damaged battery needs qualified advice before further troubleshooting.',
    steps: emergency ? ['Move away and keep others away. Contact your local emergency service from a safe place.', 'Do not handle, open or attempt to repair the device.'] : ['Do not open, puncture or attempt to repair the battery.', 'Contact the manufacturer or a qualified service for handling and collection advice.'],
    alternative: emergency ? 'Follow the emergency service’s instructions; do not return to handle the device.' : 'If there is smoke, fire or immediate danger, move away and contact your local emergency service.',
    questions: [], resourceIds: emergency ? [] : ['electronics'],
  } };
}

// Targeted rejection of known prohibited instructions. This does not establish general safety.
export function violatesOutputPolicy(fields: string[]): boolean {
  if (fields.some(text => /\b(?:gemini|aicredits|gpt[- ]?\d[\w.-]*|chatgpt|openai|anthropic|claude)\b/i.test(text))) return true;
  return fields.some(text => text.split(/[.!?;\n]/).some(clause => {
    const dangers = clause.matchAll(/\b(?:open|opening|puncture|puncturing|heat|heating|dismantle|dismantling|cut|cutting)\b.{0,50}?\b(?:battery|batteries)\b|\b(?:mix|mixing|combine|combining)\b.{0,40}\b(?:bleach\b.{0,30}\bammonia|ammonia\b.{0,30}\bbleach)\b/gi);
    return [...dangers].some(danger => !/\b(?:do not|don't|don’t|never|avoid|must not|should not)\s*$/i.test(clause.slice(0, danger.index)));
  }));
}
