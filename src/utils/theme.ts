/** Semantic colors match the tokens in index.css; material tints belong to the scenes. */
export const THEME = {
  forest: 'var(--color-forest)',
  clay: 'var(--color-clay)',
  materials: {
    tshirt: '#A44932',
    smartphone: '#526C61',
    food: '#55764E',
    package: '#B18A57'
  } as Record<string, string>
} as const;
