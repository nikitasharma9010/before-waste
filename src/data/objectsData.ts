export interface StoryStage {
  stageNumber: number;
  stageName: string;
  stageTitle: string;
  body: string;
  detail: string;
  materialFlow: string;
  curiousFact: string;
  source?: { title: string; url: string };
}

export interface StoryObject {
  id: string;
  name: string;
  itemType: string;
  tagline: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  finalReflection: string;
  stages: StoryStage[];
}

export const OBJECTS_DATA: StoryObject[] = [
  {
    id: 'tshirt',
    name: 'Cotton T-Shirt',
    itemType: 'Garment',
    tagline: 'From rainfed soil and distant looms to your morning wardrobe',
    accentColor: '#FF654F', // vibrant coral
    accentBg: '#FFF0EE',
    accentBorder: '#FFD6D0',
    finalReflection: 'What if the best way to deal with clothing waste is simply wearing what we love a little longer?',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Before me',
        stageTitle: 'Before it was a T-shirt, it was a field',
        body: 'Months before reaching a clothing rack, it began as cotton seeds in fertile soil—requiring sunlight, soil nutrients, and water from rain or irrigation. Water demand varies by growing conditions and garment weight.',
        detail: 'Bolls of cotton are harvested, cleaned of seeds, and baled before embarking on an international shipping network spanning thousands of kilometers.',
        materialFlow: 'Raw cotton bolls → Ginning mill → Export cargo containers',
        curiousFact: 'Cotton can pass through several countries as it is grown, spun, dyed, sewn, and shipped.'
      },
      {
        stageNumber: 2,
        stageName: 'Becoming',
        stageTitle: 'People, looms, dye vats, and machines',
        body: 'Raw fibers were carded into slivers, spun into yarn, knitted into jersey fabric, and submerged in pressurized dye baths with stabilizing agents.',
        detail: 'Garment workers in cut-and-sew workshops assemble the garment, sewing the collar ribbing, sleeves, and hems on high-speed industrial overlockers.',
        materialFlow: 'Carded fiber → Spun yarn → Knitted fabric → Dye baths → Sewing line',
        curiousFact: 'More human hands touched your shirt during its assembly than will ever touch it while you own it.'
      },
      {
        stageNumber: 3,
        stageName: 'With me',
        stageTitle: 'The quiet chapter in your wardrobe',
        body: 'Now it rests in your drawer. Every wash cycle, cold rinse, line dry, or tumble hot influences how long its cotton fibers retain their structural strength.',
        detail: 'Washing in cold water and air-drying can reduce drying energy and wear on the fabric; follow the garment care label.',
        materialFlow: 'Gentle wash cycles · Hanging to dry · Folding · Repeated wear',
        curiousFact: 'WRAP identifies longer active use and clothing-care practices as opportunities to reduce the environmental impacts of UK clothing. Savings depend on the garment and how it is used.',
        source: { title: 'WRAP: Valuing Our Clothes (2017, UK clothing sector)', url: 'https://www.wrap.ngo/resources/report/valuing-our-clothes-cost-uk-fashion' }
      },
      {
        stageNumber: 4,
        stageName: 'After me',
        stageTitle: 'When you no longer reach for it',
        body: 'Globally, an estimated 73% of discarded apparel is either incinerated or sent to landfills, while less than 1% of material is recycled into new clothing (Ellen MacArthur Foundation, 2017).',
        detail: 'Blended fibers (like cotton-polyester blends) and chemical finishes make mechanical fiber recycling technically challenging in existing municipal facilities.',
        materialFlow: 'Closet clear-out → Donation sorting → Global secondhand export / Landfill',
        curiousFact: 'Donation bins often send surplus textiles overseas, where local sorting markets can be overwhelmed by high volumes of fast fashion.'
      },
      {
        stageNumber: 5,
        stageName: 'Another possibility',
        stageTitle: 'Wear longer, mend simply, pass it forward',
        body: 'Its next chapter is not fixed. A loose hem can be re-stitched in five minutes. A faded shirt becomes loungewear, then cleaning cloths, then shredded acoustic insulation.',
        detail: 'When clothing is cared for, traded with friends, or repurposed, the materials stay in circulation—delaying the demand for virgin cotton acreage.',
        materialFlow: 'Wear longer → Visible mending → Clothing swap → Workshop rags → Insulation',
        curiousFact: 'In circular fashion, the most sustainable garment is always the one already hanging in your closet.'
      }
    ]
  },
  {
    id: 'smartphone',
    name: 'Smartphone',
    itemType: 'Electronics',
    tagline: '16 rare elements and global micro-engineering in your palm',
    accentColor: '#425BFF', // electric cobalt
    accentBg: '#EEF1FF',
    accentBorder: '#CCD4FF',
    finalReflection: 'What if keeping our devices for four years instead of two became the standard for modern tech?',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Before me',
        stageTitle: 'Extracted from the Earth\'s crust',
        body: 'Inside rests aluminum from bauxite, copper for circuit traces, lithium and cobalt for the battery, and neodymium for the tiny haptic vibration motor.',
        detail: 'Over 30 distinct minerals are mined across six continents, requiring intensive rock crushing and chemical separation before refining.',
        materialFlow: 'Mineral ores → Chemical smelting → High-purity bullion & semiconductor ingots',
        curiousFact: 'More than 70 elements of the periodic table are utilized to build a single modern smartphone.'
      },
      {
        stageNumber: 2,
        stageName: 'Becoming',
        stageTitle: 'Nanometer precision in cleanrooms',
        body: 'Silicon ingots are sliced into atomic wafers, etched with extreme ultraviolet light to print billions of transistors, and assembled in sealed robotic cleanrooms.',
        detail: 'The Gorilla glass screen, OLED display layer, multi-lens camera module, and logic boards are married with micron-level tolerances.',
        materialFlow: 'Silicon wafer photolithography → Surface-mount pick-and-place → Final casing seal',
        curiousFact: 'Over 80% of a smartphone\'s lifetime carbon footprint occurs during manufacturing before it is ever switched on.'
      },
      {
        stageNumber: 3,
        stageName: 'With me',
        stageTitle: 'Your constant companion for daily life',
        body: 'It connects you to loved ones, directions, music, and ideas. How it is charged, shielded with a case, and updated defines how smoothly it ages.',
        detail: 'Keeping the battery between 20% and 80% charge slows chemical degradation, keeping the device responsive for multiple additional years.',
        materialFlow: 'Protective casing · Software security updates · Battery care · Daily utility',
        curiousFact: 'A high-grade protective case and screen protector prevent 90% of screen fractures that lead to premature upgrades.'
      },
      {
        stageNumber: 4,
        stageName: 'After me',
        stageTitle: 'The fate of forgotten desk drawers',
        body: 'Millions of phones sit retired in home drawers. When finally thrown out with household trash, hazardous heavy metals risk leaching into municipal landfills.',
        detail: 'According to the UN Global E-waste Monitor (2024), e-waste reached 62 million tonnes in 2022, with less than 23% documented as formally collected and recycled.',
        materialFlow: 'Desk drawer storage → Forgotten obsolescence → General waste / E-waste scrap',
        curiousFact: 'One ton of discarded circuit boards yields significantly more gold and copper than one ton of typical raw gold ore (UNEP).'
      },
      {
        stageNumber: 5,
        stageName: 'Another possibility',
        stageTitle: 'Modular repair and urban mineral harvesting',
        body: 'Imagine phones with swappable batteries, standardized screws, and certified refurbishment programs that keep precious metals in closed-loop reuse.',
        detail: 'Authorized e-waste drop-offs recover gold, copper, cobalt, and rare earths without open-pit mining, while trade-ins give working phones to secondary users.',
        materialFlow: 'Battery replacement → Certified trade-in → Secondary owner → Precision urban mining',
        curiousFact: 'Modular phones allow users to swap cameras and batteries with a simple screwdriver in under three minutes.'
      }
    ]
  },
  {
    id: 'food',
    name: 'Fresh Apple',
    itemType: 'Nourishment',
    tagline: 'Spring blossoms, orchard bee pollination, and the cold chain',
    accentColor: '#0D9F91', // fresh teal
    accentBg: '#E6F8F6',
    accentBorder: '#B2ECE6',
    finalReflection: 'What if we respected food as the living energy of soil, water, and human care rather than an endless commodity?',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Before me',
        stageTitle: 'A blossom pollinated by bees',
        body: 'In late spring, honeybees pollinate apple blossoms on mature orchard trees. Over five months, solar energy, groundwater, and tree sap swell the fruit.',
        detail: 'Orchardists prune branches, manage frost risk, and monitor soil biology to nurture crisp sweetness and vibrant skin color.',
        materialFlow: 'Winter dormant bud → Spring blossom pollination → Summer fruit cell division',
        curiousFact: 'It takes approximately 70 liters of water—from rain and irrigation—to grow and ripen a single crisp apple.'
      },
      {
        stageNumber: 2,
        stageName: 'Becoming',
        stageTitle: 'Hand-picked and cold-stored',
        body: 'Apples are hand-picked to avoid bruising, washed, optically sorted by size and color, and stored in controlled-atmosphere refrigeration rooms.',
        detail: 'Lowered oxygen levels and cool temperatures pause the fruit\'s respiration, allowing seasonal autumn fruit to remain crisp through late spring.',
        materialFlow: 'Hand harvesting → Flume washing → Camera grading → Controlled atmosphere cold storage',
        curiousFact: 'Apples float in water because roughly 25% of their internal volume is pocketed with air.'
      },
      {
        stageNumber: 3,
        stageName: 'With me',
        stageTitle: 'On the kitchen counter or in the crisper',
        body: 'In your home, the apple continues to breathe. Storing it in the refrigerator crisper drawer keeps it firm and juicy for weeks rather than softening.',
        detail: 'Keeping apples away from leafy greens prevents natural ethylene gas from prematurely ripening nearby salad vegetables.',
        materialFlow: 'Market display → Home crisper drawer → Sliced snack or baked recipe',
        curiousFact: 'Apples kept in the fridge crisper last up to 6 to 8 times longer than apples left in a warm fruit bowl.'
      },
      {
        stageNumber: 4,
        stageName: 'After me',
        stageTitle: 'When an apple ends up in the bin',
        body: 'When organic food scraps are sealed inside plastic bags in municipal landfills without oxygen, anaerobic bacteria generate methane—a potent greenhouse gas.',
        detail: 'Approximately one-third of all food produced worldwide for human consumption is lost or wasted between farm gate and dining table.',
        materialFlow: 'Leftover core or bruised fruit → Plastic trash bag → Anaerobic landfill decomposition',
        curiousFact: 'If global food waste were a nation, it would be the third-largest emitter of greenhouse gases on Earth.'
      },
      {
        stageNumber: 5,
        stageName: 'Another possibility',
        stageTitle: 'Soil to fruit, fruit back to soil',
        body: 'Apples with a minor bruise make wonderful applesauce, smoothies, or oatmeal toppings. The core can be aerated in backyard or municipal compost.',
        detail: 'Composting returns rich organic carbon and trace minerals back to garden soil, feeding future earthworms and nourishing the next harvest.',
        materialFlow: 'Creative kitchen cooking → Aerobic composting → Nutrient humus → Healthy garden soil',
        curiousFact: 'Composted organic matter helps garden soil retain up to 20% more moisture during dry summer droughts.'
      }
    ]
  },
  {
    id: 'package',
    name: 'Delivery Box',
    itemType: 'Packaging',
    tagline: 'Coniferous timber, corrugated fluting, and doorstep journeys',
    accentColor: '#FFC857', // sunny marigold
    accentBg: '#FFF9EB',
    accentBorder: '#FFE7B3',
    finalReflection: 'What if packaging was designed to be folded flat and borrowed twenty times, instead of torn open once?',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Before me',
        stageTitle: 'Forest canopy and recycled pulping',
        body: 'Corrugated cardboard starts with softwood pine trees harvested from working timberlands, mixed with post-consumer recycled paper and cardboard pulp.',
        detail: 'The wood chips are steamed, digested with mild chemical salts, and washed to separate durable cellulose fibers without destroying fiber length.',
        materialFlow: 'Pulpwood & recovered paper bales → Hydro-pulper → Cellulose fiber slurry',
        curiousFact: 'Cardboard wood fibers can be recycled and repulped up to 5 to 7 times before becoming too short to bond.'
      },
      {
        stageNumber: 2,
        stageName: 'Becoming',
        stageTitle: 'The architectural genius of the flute',
        body: 'Heated corrugators fold the interior paper into an undulating wave (the flute), gluing it between two smooth linerboards with starch-based adhesive.',
        detail: 'This geometric arch structure provides astonishing crush resistance using minimal raw material, before being die-cut and printed with water-based inks.',
        materialFlow: 'Kraft linerboards → Steam-heated corrugating rolls → Die cutting & scoring',
        curiousFact: 'The corrugated arch was inspired by Gothic cathedral arches to maximize load-bearing strength with minimal mass.'
      },
      {
        stageNumber: 3,
        stageName: 'With me',
        stageTitle: 'A momentary hero on the front porch',
        body: 'It protected your order across sorting hubs, conveyor belts, delivery vans, and rain sprinkles. It lands at your door intact, its primary job done.',
        detail: 'Most cardboard shipping boxes are opened within minutes of arrival, ending an intricate multi-thousand-kilometer protective journey.',
        materialFlow: 'Delivery van doorstep drop-off → Tape cutting → Contents unpacked',
        curiousFact: 'The average parcel delivery box is in active protective transit for roughly 48 hours before being discarded.'
      },
      {
        stageNumber: 4,
        stageName: 'After me',
        stageTitle: 'Crushed and mixed with plastics',
        body: 'When cardboard boxes are tossed into regular trash bins or contaminated with synthetic bubble wrap, food grease, or plastic tape, recovery becomes tricky.',
        detail: 'Flattening boxes is essential: unflattened boxes take up 80% empty air in recycling trucks, burning unnecessary transport fuel.',
        materialFlow: 'Unflattened toss → Contamination with film plastics → Sorting line jams',
        curiousFact: 'Flattening your boxes before recycling allows collection trucks to carry nearly four times as many containers per route.'
      },
      {
        stageNumber: 5,
        stageName: 'Another possibility',
        stageTitle: 'Reuse, gift mailing, and clean paper loops',
        body: 'A sturdy box can be used to ship a care package to a friend, store seasonal winter scarves, or protect garden beds as biodegradable sheet mulch.',
        detail: 'When clean and flattened into paper recycling, it dissolves in water within 15 minutes at a paper mill, becoming tomorrow\'s new cereal box.',
        materialFlow: 'Home storage box → Flat folding → Clean curbside fiber bin → Repulped carton',
        curiousFact: 'Cardboard has one of the highest recycling success rates of any packaging material when kept dry and clean.'
      }
    ]
  }
];
