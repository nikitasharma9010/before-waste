export interface CountryFootprint {
  id: string;
  country: string;
  earths: number;
  highlightText: string;
  sourceNote: string;
  context: string;
  primaryDrivers: string[];
}

export const ECOLOGICAL_FOOTPRINT_DATA: CountryFootprint[] = [
  {
    id: 'us',
    country: 'United States',
    earths: 5.1,
    highlightText: 'High mobility infrastructure, heating/cooling energy, and suburban spatial footprint.',
    sourceNote: 'Global Footprint Network, National Footprint & Biocapacity Accounts (2024 Edition)',
    context: 'Reflects higher per-capita energy consumption, single-occupancy vehicle commuting, and extensive supply chains.',
    primaryDrivers: ['Transportation distances', 'Residential energy & HVAC', 'High goods turnover']
  },
  {
    id: 'germany',
    country: 'Germany',
    earths: 3.0,
    highlightText: 'Advanced industrial manufacturing alongside strong municipal sorting and public transit networks.',
    sourceNote: 'Global Footprint Network, National Footprint & Biocapacity Accounts (2024 Edition)',
    context: 'Shows how industrial economies can integrate high recycling rates while still carrying substantial thermal energy and material demands.',
    primaryDrivers: ['Industrial processing', 'Imported material footprints', 'Consumer goods demand']
  },
  {
    id: 'japan',
    country: 'Japan',
    earths: 2.9,
    highlightText: 'High population density and exceptional rail transit balanced by heavy food and raw resource imports.',
    sourceNote: 'Global Footprint Network, National Footprint & Biocapacity Accounts (2024 Edition)',
    context: 'Demonstrates high transit efficiency in dense cities alongside significant embedded resource imports from island geography.',
    primaryDrivers: ['Imported food & materials', 'Packaging density', 'Thermal electricity mix']
  },
  {
    id: 'world',
    country: 'World Average',
    earths: 1.7,
    highlightText: 'Current global aggregate demand across all 8 billion people living on Earth.',
    sourceNote: 'Global Footprint Network (2024 Global Ecological Overshoot calculation)',
    context: 'Humanity collectively uses ecological resources 70% faster than Earth’s biological ecosystems can regenerate within twelve months.',
    primaryDrivers: ['Global fossil energy use', 'Agricultural expansion', 'Linear supply chains']
  },
  {
    id: 'costa_rica',
    country: 'Costa Rica',
    earths: 1.5,
    highlightText: '99% renewable electricity grid with extensive forest conservation programs.',
    sourceNote: 'Global Footprint Network, National Footprint & Biocapacity Accounts (2024 Edition)',
    context: 'Demonstrates high human well-being and life expectancy achieved with substantially lower material demand per person.',
    primaryDrivers: ['Hydropower & geothermal mix', 'National park corridors', 'Moderate consumption']
  },
  {
    id: 'india',
    country: 'India',
    earths: 0.8,
    highlightText: 'Traditions of frugality, repair culture, and high plant-based dietary foundations.',
    sourceNote: 'Global Footprint Network, National Footprint & Biocapacity Accounts (2024 Edition)',
    context: 'Per-capita resource consumption remains within planetary regeneration boundaries, while growing cities build modern infrastructure.',
    primaryDrivers: ['Plant-forward culinary habits', 'Local neighborhood bazaars', 'High domestic mending culture']
  }
];

export const FOOTPRINT_EXPLAINER = {
  headline: 'We all share one Earth. But we don\'t all ask the same amount of it.',
  definition: 'An ecological footprint compares how fast humans harvest resources and produce waste against how fast our biosphere can regenerate those resources and absorb our emissions.',
  analogy: 'Think of Earth like a savings account that earns a set amount of annual interest. When we live within the interest, the capital stays healthy. Asking for 1.7 Earths means drawing down the natural balance faster than it replenishes.',
  nuanceTitle: 'What "Number of Earths" Actually Means',
  nuanceText: 'This is an ecological accounting ratio, not a literal tally of multiple planets. It asks: "If everyone on Earth consumed resources and generated carbon at the rate of an average resident of this country, how many Earths\' annual biocapacity would be required?" It helps communities understand relative pressure on shared ecosystems without individual blame.'
};
