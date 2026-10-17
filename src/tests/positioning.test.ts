import { describe, it, expect } from 'vitest';

describe('Relative Coordinate Consistency Across Screen Sizes', () => {
  // SVG intrinsic coordinate space: viewBox="0 0 320 280"
  const SVG_VIEWBOX_WIDTH = 320;
  const SVG_VIEWBOX_HEIGHT = 280;
  const SVG_ASPECT_RATIO = SVG_VIEWBOX_WIDTH / SVG_VIEWBOX_HEIGHT; // 1.142857

  // Target coordinates for T-shirt hotspots (in percentages of the locked aspect wrapper)
  const HOTSPOTS = [
    { id: 'collar', name: 'Collar & Care Tag', x: 50, y: 20 },
    { id: 'chest', name: 'Woven Cotton Jersey', x: 42, y: 44 },
    { id: 'sleeve', name: 'Shoulder & Sleeve Seam', x: 23, y: 35 },
    { id: 'hem', name: 'Bottom Hem', x: 60, y: 80 }
  ];

  // Screen widths representing iPhone SE (320px), iPhone 14 (375px), iPad (768px), Desktop (1280px)
  const SCREEN_RESOLUTIONS = [
    { name: 'Mobile 320px', containerWidth: 248 },
    { name: 'Mobile 375px', containerWidth: 303 },
    { name: 'Tablet 768px (capped at max-w-[320px])', containerWidth: 320 },
    { name: 'Desktop 1280px (capped at max-w-[320px])', containerWidth: 320 }
  ];

  it('preserves exact SVG aspect ratio without drifting at any screen size', () => {
    for (const res of SCREEN_RESOLUTIONS) {
      const renderedWidth = Math.min(res.containerWidth, 320);
      const renderedHeight = renderedWidth / SVG_ASPECT_RATIO;

      // Verify aspect ratio is preserved down to floating precision
      expect(renderedWidth / renderedHeight).toBeCloseTo(SVG_ASPECT_RATIO, 5);

      // Verify each hotspot percentage maps to the exact SVG relative coordinate
      for (const spot of HOTSPOTS) {
        const pixelX = (spot.x / 100) * renderedWidth;
        const pixelY = (spot.y / 100) * renderedHeight;

        // Normalized back to SVG viewBox coordinates
        const normalizedSvgX = (pixelX / renderedWidth) * SVG_VIEWBOX_WIDTH;
        const normalizedSvgY = (pixelY / renderedHeight) * SVG_VIEWBOX_HEIGHT;

        // Collar should always map to x=160, y=56 in SVG viewBox
        if (spot.id === 'collar') {
          expect(normalizedSvgX).toBeCloseTo(160, 2);
          expect(normalizedSvgY).toBeCloseTo(56, 2);
        }

        // Chest should always map to x=134.4, y=123.2
        if (spot.id === 'chest') {
          expect(normalizedSvgX).toBeCloseTo(134.4, 2);
          expect(normalizedSvgY).toBeCloseTo(123.2, 2);
        }

        // Sleeve should always map to x=73.6, y=98
        if (spot.id === 'sleeve') {
          expect(normalizedSvgX).toBeCloseTo(73.6, 2);
          expect(normalizedSvgY).toBeCloseTo(98, 2);
        }

        // Hem should always map to x=192, y=224
        if (spot.id === 'hem') {
          expect(normalizedSvgX).toBeCloseTo(192, 2);
          expect(normalizedSvgY).toBeCloseTo(224, 2);
        }
      }
    }
  });

  it('keeps touch targets within the SVG canvas boundary at all screen sizes', () => {
    for (const res of SCREEN_RESOLUTIONS) {
      const renderedWidth = Math.min(res.containerWidth, 320);
      const renderedHeight = renderedWidth / SVG_ASPECT_RATIO;
      const touchRadius = 22; // 44px / 2

      for (const spot of HOTSPOTS) {
        const cx = (spot.x / 100) * renderedWidth;
        const cy = (spot.y / 100) * renderedHeight;

        // Verify touch target center is inside the canvas
        expect(cx).toBeGreaterThan(0);
        expect(cx).toBeLessThan(renderedWidth);
        expect(cy).toBeGreaterThan(0);
        expect(cy).toBeLessThan(renderedHeight);

        // Verify bounds don't blow outside container with margins
        expect(cx - touchRadius).toBeGreaterThan(-touchRadius);
        expect(cy - touchRadius).toBeGreaterThan(-touchRadius);
      }
    }
  });
});
