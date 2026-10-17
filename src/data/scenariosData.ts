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
        nuanceBody: 'A sound problem can have several causes, including settings, connections or a damaged component. Start with the manufacturer’s troubleshooting and warranty information for your model. A repair assessment can help you decide whether a fix is practical; the time and cost vary.',
        practicalInsight: 'Repair Cafés are a volunteer repair network. Availability, accepted items, charges and volunteer expertise vary; contact the group before travelling.',
        nextStepSuggestion: 'Check your model’s manufacturer troubleshooting and warranty guidance first. For internal faults or batteries, ask qualified repair support rather than opening the device.'
      },
      {
        id: 'replace_part',
        label: 'Check whether a part can be replaced',
        actionSummary: 'Inspecting whether only the battery, cable, or ear pad needs swapping.',
        nuanceTitle: 'Targeting the specific point of wear',
        nuanceBody: 'A worn cushion or detachable cable may be replaceable while other parts still work. Lifespan and repairability depend on the model, condition and available parts. A battery fault needs qualified advice.',
        practicalInsight: 'Check the exact model and manufacturer fitting instructions before buying a part. Compatibility, tools, difficulty and total cost vary; a similar-looking part may not fit.',
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
        nextStepSuggestion: 'Even if you want a new style, repairing the button may help, but ask the recipient whether they accept the coat in its current condition.'
      },
      {
        id: 'sew_it',
        label: 'Sew a spare button on',
        actionSummary: 'Grabbing a basic needle, thread, and stitching a replacement button in place.',
        nuanceTitle: 'A useful mending skill',
        nuanceBody: 'A basic button repair may need a needle, suitable thread and a replacement button. Time and difficulty depend on the fabric and your experience; ask someone who sews if you need help.',
        practicalInsight: 'A contrasting button can make a repair part of the garment’s character. Check that its size and fastening work before sewing it in place.',
        nextStepSuggestion: 'Keep a small travel sewing kit in a desk drawer. You\'ll be amazed how often a needle and thread saves the day for you or a colleague.'
      },
      {
        id: 'local_tailor',
        label: 'Take it to a local tailor or dry-cleaner',
        actionSummary: 'Dropping it off at the neighborhood alteration shop on the corner.',
        nuanceTitle: 'Supporting local craftspeople in your neighborhood',
        nuanceBody: 'Local seamstresses, dry-cleaners, and cobblers are the quiet backbone of the circular economy. Ask about the price, turnaround and whether you need to supply a button before agreeing to the repair.',
        practicalInsight: 'Using local repair services supports neighborhood independent small businesses while keeping skilled craft traditions alive in our communities.',
        nextStepSuggestion: 'Take a mental note of your nearest tailor or shoe repair shop the next time you walk through your neighborhood.'
      }
    ]
  }
];
