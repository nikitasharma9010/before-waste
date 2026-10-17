export interface PauseDay {
  day: number;
  question: string;
  shortLabel: string;
  context: string;
  actionPrompt: string;
  practicalTip: string;
  thoughtStarter: string;
}

export const PAUSE_DAYS: PauseDay[] = [
  {
    day: 1,
    question: 'Do I need this right now, or am I answering a fleeting impulse?',
    shortLabel: 'Do I need this?',
    context: 'Modern retail is engineered to make clicking "buy" effortless. Giving yourself a simple 24-hour breathing room between desire and purchase breaks the artificial urgency of sales timers.',
    actionPrompt: 'Before purchasing any non-essential item today, wait 24 hours. Put it in a wishlist or write it on a notepad. See if tomorrow morning you still feel that exact pull.',
    practicalTip: 'If after a night of sleep you forget you even wanted it, you just saved money, closet space, and natural resources.',
    thoughtStarter: 'What feeling am I hoping this purchase will bring me? Can I find that feeling in something I already do?'
  },
  {
    day: 2,
    question: 'Could I borrow this from a friend, neighbor, or library?',
    shortLabel: 'Could I borrow it?',
    context: 'Many tools and gadgets—like power drills, camping tents, carpet steamers, or formal suits—are only used for a few hours in an entire year. The average power drill is used for less than 15 minutes over its whole lifetime.',
    actionPrompt: 'If you need a specialized item for a weekend project, ask a neighbor, colleague, or local tool library before ordering a brand new one.',
    practicalTip: 'Borrowing also builds neighborly relationships. When you return it with a piece of fruit or a warm thank-you note, you cultivate community.',
    thoughtStarter: 'Is this an object I need to own forever, or is it an outcome I just need for an afternoon?'
  },
  {
    day: 3,
    question: 'Could I use something I already have tucked away in a cupboard?',
    shortLabel: 'Could I use what I have?',
    context: 'We often purchase replacements simply because what we own is out of sight. A quick drawer inventory frequently reveals forgotten notebooks, chargers, mugs, or pantry staples.',
    actionPrompt: 'Take five minutes to look through one drawer, cupboard, or shelf you haven’t opened recently. Rediscover one useful item you forgot was there.',
    practicalTip: 'Try the "shop your own home" mindset: arrange your favourite items where you can see and appreciate them.',
    thoughtStarter: 'How many things in my home are quietly waiting to be used and enjoyed again?'
  },
  {
    day: 4,
    question: 'Could I find this secondhand, refurbished, or pre-loved?',
    shortLabel: 'Could I buy it secondhand?',
    context: 'Buying secondhand gives existing manufactured goods another chapter of life. It avoids the energy, water, and extraction needed to produce a replacement from scratch.',
    actionPrompt: 'Next time you need a book, piece of furniture, warm jacket, or kitchenware, check an independent vintage shop, refurbished tech reseller, or community marketplace.',
    practicalTip: 'Pre-owned items often have character, time-tested durability, and cost a fraction of retail price.',
    thoughtStarter: 'Objects with a previous life carry character and patina. What history might this object continue with me?'
  },
  {
    day: 5,
    question: 'Could I repair what is broken instead of throwing it away?',
    shortLabel: 'Could I repair something instead?',
    context: 'A torn seam, a wobbly table leg, a dusty phone speaker, or a loose toaster spring often require minimal attention to work like new.',
    actionPrompt: 'Pick one item in your home with a minor defect. Search for a 3-minute video repair tutorial or take it to a local tailor or repair cafe.',
    practicalTip: 'Fixing something with your own hands delivers an unmatched feeling of quiet capability and pride.',
    thoughtStarter: 'When did we begin viewing minor wear as a signal to discard, rather than a natural part of living with things?'
  },
  {
    day: 6,
    question: 'Will I realistically use this for a long time?',
    shortLabel: 'Will I use this for a long time?',
    context: 'The true value of an object is measured over years, not minutes. The "30-Wear Test" in clothing asks whether you can picture yourself wearing a piece at least thirty times.',
    actionPrompt: 'When evaluating any new item, imagine your life three years from now. Can you picture this object still sitting beside you, respected and functional?',
    practicalTip: 'Look for durable materials: solid woods, natural cotton weaves, metal fastenings, and modular parts over flimsy glued plastic.',
    thoughtStarter: 'If I knew I had to keep this item for the next five years, would I still want it today?'
  },
  {
    day: 7,
    question: 'What will happen to this object when I am eventually finished with it?',
    shortLabel: 'What happens when I finish?',
    context: 'Everything we buy will one day leave our hands. Asking about an item’s exit path before welcoming it into your life prevents future disposal dilemmas.',
    actionPrompt: 'Before purchasing, check: Can it be safely disassembled? Are replacement parts sold? Is it compostable or accepted by local recycling streams?',
    practicalTip: 'When you know an object has a safe, clean exit path, you make peace with its entire lifecycle.',
    thoughtStarter: 'What story do I want this object to leave behind when our time together is over?'
  }
];
