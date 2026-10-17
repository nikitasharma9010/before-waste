export type Item = 'clothes' | 'headphones';
export type Intent = 'buy' | 'fix' | 'pass';
export type Support = 'myself' | 'help';
export type Budget = 'free' | 'flexible';
export interface Decision { item: Item; intent: Intent; support: Support; budget: Budget }
export const itemLabels: Record<Item, string> = { clothes: 'Clothes', headphones: 'Headphones' };
export const intentLabels: Record<Intent, string> = { buy: 'Thinking of buying', fix: 'Something needs attention', pass: 'No longer needed' };

// Editorial suggestions, not product-specific diagnoses or calculated impact claims.
export function recommend(d: Decision) {
  const clothing = d.item === 'clothes';
  const resource = { label: clothing ? 'iFixit clothing guides' : 'iFixit headphone guides', url: clothing ? 'https://www.ifixit.com/Device/Clothing' : 'https://www.ifixit.com/Device/Headphone' };
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
  return {
    title: clothing ? (d.support === 'myself' ? 'Match the small repair to a guide' : 'Ask for help with one specific repair') : (d.support === 'help' ? 'Ask for a model-specific repair assessment' : 'Check support before opening your headphones'),
    step: clothing ? (d.support === 'myself' ? 'Identify the issue: a missing button, open seam or small hole. Find a matching guide and check the fabric, tools and steps before starting.' : 'Photograph the issue and ask a tailor or someone who sews what is possible. Request a quote before agreeing to work.') : 'Find the model number and check its manual, warranty and manufacturer troubleshooting. Use a matching guide only if you have the right skills and tools.',
    effort: clothing ? 'Identify the issue first; repair time varies' : 'Start with a model and warranty check',
    cost: d.budget === 'free' ? 'Start with existing supplies or a free support enquiry. Confirm any charges first.' : 'Parts and labour vary. Compare a quote with a suitable replacement.',
    alternative: d.budget === 'free' ? 'If supplies or help cost too much, keep a note of the issue and ask about borrowing tools or community repair help.' : 'If repair is unavailable or impractical, replacement is reasonable. Check reuse or collection options for the old item.',
    chapter: clothing ? 'A small repair may let this garment return to everyday use.' : 'A repairable component may keep the rest of the object useful. This depends on the model and fault.', resource,
  };
}
