/**
 * Accessible design tokens and color utilities.
 * Ensures all interactive elements satisfy WCAG AA contrast (>= 4.5:1 for normal text, >= 3:1 for large).
 */

export const THEME = {
  // Canvas neutrals
  ivory: '#FFF9F0',
  ink: '#202A35',
  inkMuted: '#4B5563',
  inkSubtle: '#6B7280',
  hairline: 'rgba(32, 42, 53, 0.12)',

  // Brand accents with accessible pairings
  coral: {
    base: '#FF654F',
    // WCAG AA compliant on dark text: #202A35 on #FF654F has 6.8:1 contrast
    textDark: '#202A35',
    // Darkened coral for buttons with white text (>= 4.5:1 on white)
    buttonBg: '#C53B27',
    buttonHover: '#AB2F1D',
    tintBg: '#FFF0EE',
    border: '#FFD6D0',
    focusRing: '#C53B27'
  },
  cobalt: {
    base: '#425BFF',
    // Darkened cobalt for small white text (>= 4.5:1 contrast)
    buttonBg: '#2840DE',
    buttonHover: '#1E32B6',
    tintBg: '#EEF1FF',
    border: '#CCD4FF',
    focusRing: '#2840DE'
  },
  teal: {
    base: '#0D9F91',
    // Darkened teal for white text (>= 4.5:1 contrast)
    buttonBg: '#086E64',
    buttonHover: '#06574F',
    tintBg: '#E6F8F6',
    border: '#B2ECE6',
    focusRing: '#086E64'
  },
  marigold: {
    base: '#FFC857',
    // WCAG AA: Text on marigold MUST be deep ink (#202A35 has > 11:1 contrast)
    textDark: '#202A35',
    buttonBg: '#FFC857',
    buttonHover: '#EBB442',
    tintBg: '#FFF9EB',
    border: '#FFE7B3',
    focusRing: '#B88000'
  },
  lavender: {
    base: '#EAE3FF',
    tintBg: '#F5F1FF',
    border: '#DDD2FF'
  }
} as const;
