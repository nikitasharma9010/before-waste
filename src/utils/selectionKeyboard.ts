import type { KeyboardEvent } from 'react';

/** Roving keyboard selection for the scenario radio cards. */
export function handleRadioKeyDown(event: KeyboardEvent<HTMLElement>) {
  const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
  if (!keys.includes(event.key)) return;
  const radios = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]:not([disabled])'));
  const index = radios.indexOf(event.target as HTMLButtonElement);
  if (index < 0 || !radios.length) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? radios.length - 1
    : (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + radios.length) % radios.length;
  radios[next].focus();
  radios[next].click();
}
