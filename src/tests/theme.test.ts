import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8');

function color(token: string): number[] {
  const hex = css.match(new RegExp(`--color-${token}:\\s*#([0-9A-Fa-f]{6})`))?.[1];
  if (!hex) throw new Error(`Missing semantic color: ${token}`);
  return [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16));
}
function luminance(rgb: number[]): number {
  return rgb.map(value => value / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}
function contrast(foreground: number[], background: number[]) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => a - b);
  return (values[1] + 0.05) / (values[0] + 0.05);
}

describe('semantic theme contrast', () => {
  it.each([
    ['ink', 'paper'], ['ink', 'surface'], ['forest', 'sage'],
    ['forest', 'paper'], ['clay', 'paper'], ['ink', 'oat']
  ])('keeps %s text readable on %s', (foreground, background) => {
    expect(contrast(color(foreground), color(background))).toBeGreaterThanOrEqual(4.5);
  });
  it('keeps primary action labels readable on default and hover fills', () => {
    for (const token of ['forest', 'forest-strong', 'clay', 'clay-strong']) {
      expect(contrast([255, 255, 255], color(token))).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('keeps the weakest common muted body text readable on paper', () => {
    const background = color('paper');
    const foreground = color('ink').map((value, index) => value * 0.75 + background[index] * 0.25);
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });
});
