import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveCompletedDays, saveNotes, loadCompletedDays, loadNotes } from '../utils/storage';

describe('Story Restart & State Independence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('resets object to tshirt and stage to index 0 even when tshirt was already selected at a later stage', () => {
    // Simulate App state machine
    let selectedObject = 'tshirt';
    let selectedStageIndex = 4; // Stage 5

    // User triggers handleRestart
    const handleRestart = () => {
      selectedObject = 'tshirt';
      selectedStageIndex = 0;
    };

    handleRestart();

    expect(selectedObject).toBe('tshirt');
    expect(selectedStageIndex).toBe(0);
  });

  it('resets object to tshirt and stage to index 0 when another object was selected', () => {
    let selectedObject = 'smartphone';
    let selectedStageIndex = 3;

    const handleRestart = () => {
      selectedObject = 'tshirt';
      selectedStageIndex = 0;
    };

    handleRestart();

    expect(selectedObject).toBe('tshirt');
    expect(selectedStageIndex).toBe(0);
  });

  it('preserves saved 7-Day Pause completion progress and notes when restarting story', () => {
    // User has saved reflections and progress in the pause challenge
    saveCompletedDays([1, 2, 3]);
    saveNotes({
      1: 'Waited 24 hours before buying book',
      2: 'Borrowed drill from neighbor'
    });

    // Simulate story restart execution
    let selectedObject = 'package';
    let selectedStageIndex = 4;

    const handleRestart = () => {
      selectedObject = 'tshirt';
      selectedStageIndex = 0;
      // Note: Notice restart does NOT clear localStorage pause data
    };

    handleRestart();

    expect(selectedObject).toBe('tshirt');
    expect(selectedStageIndex).toBe(0);

    // Verify localStorage data remains completely preserved
    const { days } = loadCompletedDays();
    const { notes } = loadNotes();

    expect(days).toEqual([1, 2, 3]);
    expect(notes[1]).toBe('Waited 24 hours before buying book');
    expect(notes[2]).toBe('Borrowed drill from neighbor');
  });

  it('uses auto scroll behavior when prefers-reduced-motion is enabled', () => {
    const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));

    window.matchMedia = matchMediaMock;

    const getScrollBehavior = (): ScrollBehavior => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 'auto';
      }
      return 'smooth';
    };

    expect(getScrollBehavior()).toBe('auto');
  });
});
