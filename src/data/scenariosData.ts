export interface ScenarioOption {
  id: string;
  label: string;
  actionSummary: string;
  nuanceTitle: string;
  nuanceBody: string;
  practicalInsight: string;
  nextStepSuggestion: string;
}

export interface Scenario {
  id: string;
  title: string;
  prompt: string;
  context: string;
  options: ScenarioOption[];
}

export const SCENARIOS_DATA: Scenario[] = [
  {
    id: 'headphones',
    title: 'Audio Troubles',
    prompt: 'Your headphones stopped working. What\'s your next move?',
    context: 'You put your favourite headphones on, but the sound cuts in and out, or one side goes completely silent.',
    options: [
      {
        id: 'replace',
        label: 'Replace them',
        actionSummary: 'Ordering or picking up a brand new pair.',
        nuanceTitle: 'A completely understandable reaction',
        nuanceBody: 'When modern electronics break, replacement feels like the default path because stores make ordering instantaneous, while repair shops are often hidden or expensive. In fast-paced daily schedules, having reliable audio for work calls or commutes is essential.',
        practicalInsight: 'Before dropping them in the bin, check if the old pair has an official take-back trade-in or e-waste drop-off. Even broken headphones carry valuable neodymium magnets and copper windings that can be safely recovered.',
        nextStepSuggestion: 'If replacing, check if the new model features user-replaceable ear cushions or a detachable 3.5mm/USB-C audio cable.'
      },
      {
        id: 'repair',
        label: 'See if they can be repaired',
        actionSummary: 'Investigating whether a quick fix or local repair cafe can bring them back to life.',
        nuanceTitle: 'A curious and rewarding choice',
        nuanceBody: 'Over 60% of common wired headphone failures happen at the 3.5mm plug or inside the jack due to everyday pocket stress or accumulated lint. With a wooden toothpick or five minutes at a community repair cafe with a soldering iron, they can often work as good as new.',
        practicalInsight: 'Community Repair Cafes are volunteer spaces worldwide where neighbors fix electronics together for free over coffee. Many people discover that fixing something with their own hands turns frustration into confidence.',
        nextStepSuggestion: 'Search "Repair Cafe near me" or look up your headphone model on iFixit to see step-by-step disassembly guides.'
      },
      {
        id: 'replace_part',
        label: 'Check whether a part can be replaced',
        actionSummary: 'Inspecting whether only the battery, cable, or ear pad needs swapping.',
        nuanceTitle: 'Targeting the specific point of wear',
        nuanceBody: 'Often, the audio drivers inside headphones are built to last for decades, but the synthetic leather ear pads flake after 18 months, or a wireless battery loses capacity after 500 charge cycles. Replacing the worn component preserves 90% of the working hardware.',
        practicalInsight: 'Third-party ear pads and modular cables are widely available online for under $10–$15 and snap on in seconds without any special technical tools.',
        nextStepSuggestion: 'Check if your headphone brand sells modular replacement cushions, headbands, or audio cables.'
      }
    ]
  },
  {
    id: 'jacket',
    title: 'Wardrobe Snag',
    prompt: 'A button popped off your favourite warm jacket. What\'s your next move?',
    context: 'You reach to fasten your winter coat and realize the middle button came loose and vanished somewhere on your morning walk.',
    options: [
      {
        id: 'donate_or_replace',
        label: 'Retire it or buy a new coat',
        actionSummary: 'Setting it aside in a donation bag and browsing for a warm new coat.',
        nuanceTitle: 'When time and energy are short',
        nuanceBody: 'When we have hectic schedules or limited sewing experience, putting a garment aside is a very common response. However, charity sorting facilities often reject garments with missing buttons or tears because they lack on-site repair teams.',
        practicalInsight: 'Most quality coats come with an extra spare button stitched discreetly into the interior lining or care label tag! Taking a quick look inside often reveals the exact match.',
        nextStepSuggestion: 'Even if you want a new style, having the button fixed first ensures the coat can actually find a happy second owner at a charity shop.'
      },
      {
        id: 'sew_it',
        label: 'Sew a spare button on in 5 minutes',
        actionSummary: 'Grabbing a basic needle, thread, and stitching a replacement button in place.',
        nuanceTitle: 'The satisfying 5-minute superpower',
        nuanceBody: 'Sewing a button is one of the most empowering basic domestic skills. It requires zero machinery—just a needle, some thread, and two minutes. It instantly rescues a $150 coat from disuse.',
        practicalInsight: 'Mismatched buttons can even add personalized personality (known as "visible mending" or Japanese *mottainai* / *boro*), making your coat unique and full of character.',
        nextStepSuggestion: 'Keep a small travel sewing kit in a desk drawer. You\'ll be amazed how often a needle and thread saves the day for you or a colleague.'
      },
      {
        id: 'local_tailor',
        label: 'Take it to a local tailor or dry-cleaner',
        actionSummary: 'Dropping it off at the neighborhood alteration shop on the corner.',
        nuanceTitle: 'Supporting local craftspeople in your neighborhood',
        nuanceBody: 'Local seamstresses, dry-cleaners, and cobblers are the quiet backbone of the circular economy. For just $3–$5, an experienced tailor will re-stitch the button securely with industrial thread in under two minutes.',
        practicalInsight: 'Using local repair services supports neighborhood independent small businesses while keeping skilled craft traditions alive in our communities.',
        nextStepSuggestion: 'Take a mental note of your nearest tailor or shoe repair shop the next time you walk through your neighborhood.'
      }
    ]
  }
];
