export type Item = 'clothes' | 'headphones';
export type Intent = 'buy' | 'fix' | 'pass';
export type Support = 'myself' | 'help';
export type Budget = 'free' | 'flexible';
export type Issue = 'unsure' | 'button' | 'seam' | 'hole' | 'sound' | 'connection' | 'pads';
export type Barrier = 'cost' | 'time' | 'tools' | 'access';
export interface Decision { item: Item; intent: Intent; support: Support; budget: Budget; issue?: Issue }
export const issues: Record<Item, { id: Issue; label: string; step: string }[]> = {
  clothes: [
    { id: 'unsure', label: 'Another issue / I am not sure', step: 'Identify the issue and look for a matching guide before starting.' },
    { id: 'button', label: 'Missing or loose button', step: 'Check whether you have the button or a suitable spare. Find a button-sewing guide and check the needle and thread needed for the fabric.' },
    { id: 'seam', label: 'An open seam', step: 'Check whether the stitching has opened or the fabric itself has torn. For an open seam, find a hand-sewing seam guide suited to the fabric.' },
    { id: 'hole', label: 'A small hole or tear', step: 'Check the care label and whether the fabric is knitted or woven. Look for a matching darning or patching guide; delicate fabric may need specialist help.' },
  ],
  headphones: [
    { id: 'unsure', label: 'Another issue / I am not sure', step: 'Find the model number and check its manual, warranty and manufacturer troubleshooting.' },
    { id: 'sound', label: 'No sound or sound on one side', step: 'Check volume, mute settings and the selected audio output. If possible, test with another compatible device to help distinguish a source problem from a headphone fault.' },
    { id: 'connection', label: 'Connection or pairing problem', step: 'For wireless headphones, follow the model’s pairing instructions and check which device is connected. For a wired pair, check compatibility and try another supported source without forcing the connector.' },
    { id: 'pads', label: 'Worn ear pads', step: 'Find the exact model and check whether compatible replacement pads are available and user-replaceable. Read the fitting instructions before buying parts or removing the old pads.' },
  ],
};
export function sameDecision(a: Decision, b: Decision) {
  return a.item === b.item && a.intent === b.intent &&
    (a.intent === 'pass' || a.budget === b.budget) &&
    (a.intent !== 'fix' || (a.support === b.support && (a.issue ?? 'unsure') === (b.issue ?? 'unsure')));
}
export const barrierLabels: Record<Barrier, string> = { cost: 'Cost', time: 'Time', tools: 'Tools or skills', access: 'Help or services unavailable' };
export function recoveryAdvice(d: Decision, barrier: Barrier): string {
  switch (barrier) {
    case 'cost': return d.intent === 'buy' ? 'Write down the requirement and ask whether you can borrow something suitable. Revisit the purchase when it fits your budget.' : d.intent === 'pass' ? 'If transport or collection costs are a barrier, ask a nearby recipient about a direct handover or a service about free collection. Confirm acceptance and any fees before arranging it.' : 'Ask about a free assessment or community help before paying. Confirm fees and parts costs first; you can pause this action if it is unaffordable.';
    case 'time': return 'Make the next step smaller: write down the model or condition and one person or service to contact when you have time. You do not have to finish today.';
    case 'tools': return d.item === 'clothes' ? 'Ask someone who sews or a community repair group about help or borrowing supplies. Check that the repair suits the fabric before attempting it.' : 'Start with manufacturer support and checks that require no disassembly. Ask a qualified repairer about work needing specialist tools or battery handling.';
    case 'access': return d.intent === 'pass' ? 'Ask a potential recipient directly if the item is usable. If it is not, check your municipality or manufacturer for an accepted collection route before travelling.' : 'Try manufacturer support or ask a community repair group whether remote advice is possible. If no practical option exists, choosing a suitable replacement is reasonable.';
  }
}
export const itemLabels: Record<Item, string> = { clothes: 'Clothes', headphones: 'Headphones' };
export const intentLabels: Record<Intent, string> = { buy: 'Thinking of buying', fix: 'Something needs attention', pass: 'No longer needed' };

// Editorial suggestions, not product-specific diagnoses or calculated impact claims.
export function recommend(d: Decision) {
  const clothing = d.item === 'clothes';
  const resource = d.intent === 'fix'
    ? { label: clothing ? 'iFixit clothing guides' : 'iFixit headphone guides', url: clothing ? 'https://www.ifixit.com/Device/Clothing' : 'https://www.ifixit.com/Device/Headphone' }
    : { label: !clothing && d.intent === 'pass' ? 'US EPA: electronics donation and recycling (US guidance)' : 'US EPA: reuse and donation guidance (US guidance)', url: !clothing && d.intent === 'pass' ? 'https://www.epa.gov/recycle/electronics-donation-and-recycling' : 'https://www.epa.gov/recycle/what-you-can-do' };
  if (d.intent === 'buy') return {
    title: clothing ? 'Try what is already in your wardrobe' : 'Check what you need your headphones to do',
    step: clothing ? 'Put together one outfit for the occasion using what you own. If something is missing, ask whether you can borrow it.' : 'Write down the feature you need. Check whether your current pair can do it, or whether you can borrow a pair to try before choosing.',
    effort: 'A short check before deciding', cost: 'No purchase needed for this first step',
    alternative: d.budget === 'free' ? 'If borrowing is unavailable, save the requirement and revisit when your budget allows.' : 'If you still need to buy, compare fit, durability, warranty and repair options. A suitable replacement is a valid choice.',
    chapter: clothing ? 'A garment already in your wardrobe can have another chapter with you.' : 'Knowing what you need helps you choose something you are likely to keep using.', resource,
  };
  if (d.intent === 'pass') return {
    title: clothing ? 'Check whether someone else can wear it' : 'Check whether your headphones still work',
    step: clothing ? 'Check condition and care instructions. If clean and wearable, ask a person or organisation whether they want it before passing it on.' : 'Test basic operation and describe any faults honestly. If working, ask a recipient whether they can use this model and its accessories.',
    effort: 'A condition check and a message', cost: 'Giving directly can avoid listing fees; transport may cost extra',
    alternative: clothing ? 'For unwearable textiles, check your local collector’s accepted materials. Donation is not a guaranteed recycling route.' : 'For unusable headphones, check manufacturer take-back or your local e-waste service. Confirm model and battery acceptance before travelling.',
    chapter: 'Another chapter depends on a real person or service being able to use or accept this object.', resource,
  };
  const issue = issues[d.item].find(i => i.id === d.issue) ?? issues[d.item][0];
  return {
    title: clothing ? (d.support === 'myself' ? 'Match the small repair to a guide' : 'Ask for help with one specific repair') : (d.support === 'help' ? 'Ask for a model-specific repair assessment' : 'Check support before opening your headphones'),
    step: d.support === 'help'
      ? `${issue.label === 'Another issue / I am not sure' ? 'Describe what you noticed' : `Describe the issue: ${issue.label.toLowerCase()}`}. ${clothing ? 'Photograph the issue and ask a tailor or someone who sews what is possible. Request a quote before agreeing to work.' : 'Find the model number and ask manufacturer support or a repairer about warranty coverage, assessment fees and repair options. Request a quote before agreeing to work.'}`
      : `${issue.step} ${clothing ? 'Check the fabric, tools and steps in a matching guide before starting.' : 'Use model-specific instructions for any further work, and check warranty coverage first.'}`,
    effort: clothing ? 'Identify the issue first; repair time varies' : 'Start with a model and warranty check',
    cost: d.budget === 'free' ? 'Start with existing supplies or a free support enquiry. Confirm any charges first.' : 'Parts and labour vary. Compare a quote with a suitable replacement.',
    alternative: d.budget === 'free' ? 'If supplies or help cost too much, keep a note of the issue and ask about borrowing tools or community repair help.' : 'If repair is unavailable or impractical, replacement is reasonable. Check reuse or collection options for the old item.',
    chapter: clothing ? 'A small repair may let this garment return to everyday use.' : 'A repairable component may keep the rest of the object useful. This depends on the model and fault.', resource,
  };
}
