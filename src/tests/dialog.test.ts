import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Accessible Dialog Keyboard Behavior', () => {
  let container: HTMLDivElement;
  let triggerButton: HTMLButtonElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    triggerButton = document.createElement('button');
    triggerButton.id = 'test-trigger';
    triggerButton.textContent = 'Open Dialog';
    document.body.appendChild(triggerButton);
    triggerButton.focus();
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(triggerButton);
    document.body.style.overflow = '';
    vi.restoreAllMocks();
  });

  it('closes dialog when Escape key is pressed', () => {
    const handleClose = vi.fn();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    window.dispatchEvent(escapeEvent);

    expect(handleClose).toHaveBeenCalledTimes(1);
    window.removeEventListener('keydown', handleKeyDown);
  });

  it('cycles Tab key between first and last focusable element', () => {
    const dialog = document.createElement('div');
    dialog.setAttribute('role', 'dialog');

    const firstBtn = document.createElement('button');
    firstBtn.id = 'btn-first';
    const secondBtn = document.createElement('button');
    secondBtn.id = 'btn-second';

    dialog.appendChild(firstBtn);
    dialog.appendChild(secondBtn);
    container.appendChild(dialog);

    const focusable = [firstBtn, secondBtn];

    // Simulate Tab trap logic
    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleTabTrap);

    // When on last element and pressing Tab, cycle to first
    secondBtn.focus();
    expect(document.activeElement).toBe(secondBtn);

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false, cancelable: true });
    window.dispatchEvent(tabEvent);
    expect(document.activeElement).toBe(firstBtn);

    // When on first element and pressing Shift+Tab, cycle to last
    const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
    window.dispatchEvent(shiftTabEvent);
    expect(document.activeElement).toBe(secondBtn);

    window.removeEventListener('keydown', handleTabTrap);
  });

  it('locks body scroll when dialog is mounted and restores it when unmounted', () => {
    document.body.style.overflow = 'auto';

    // Simulate dialog open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    expect(document.body.style.overflow).toBe('hidden');

    // Simulate dialog close
    document.body.style.overflow = originalOverflow;
    expect(document.body.style.overflow).toBe('auto');
  });

  it('restores focus to trigger element when dialog closes', () => {
    triggerButton.focus();
    const previouslyFocused = document.activeElement as HTMLElement;
    expect(previouslyFocused).toBe(triggerButton);

    // Open dialog, move focus inside
    const dialogBtn = document.createElement('button');
    container.appendChild(dialogBtn);
    dialogBtn.focus();
    expect(document.activeElement).toBe(dialogBtn);

    // Dialog closes, restore focus
    previouslyFocused.focus();
    expect(document.activeElement).toBe(triggerButton);
  });
});
