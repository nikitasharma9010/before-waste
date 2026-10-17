# Before Waste

An interactive educational site built with React, TypeScript, Vite, and Tailwind CSS.

## Development

Use Node.js 24 and npm. The committed `package-lock.json` is the dependency source of truth.

```sh
npm ci
npm run dev
```

## Checks

```sh
npm run lint
npm test
npm run build
```

The component tests render the application in jsdom. They cover scenario keyboard
selection, dialog focus and background isolation, mobile Sources focus restoration,
story restart, and reflection storage failures. They do not verify visual layout.
Before release, manually check narrow viewports, text zoom, and screen-reader behavior.

## Content

Environmental estimates depend on product, geography, and study assumptions. The
Sources dialog provides background references; the garment-care story also links
directly to WRAP's 2017 UK clothing-sector report. This is educational content, not
a product-specific footprint calculator or a comprehensive independent fact audit.
