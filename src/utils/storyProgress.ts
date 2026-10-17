export const STORY_PROGRESS_KEY = 'beforewaste_story_session';
const ids = ['tshirt', 'smartphone', 'food', 'package'];
export function readStoryProgress(): { id: string; stage: number } {
  try {
    const value = JSON.parse(sessionStorage.getItem(STORY_PROGRESS_KEY) ?? 'null');
    if (value && ids.includes(value.id) && Number.isInteger(value.stage) && value.stage >= 0 && value.stage <= 4) return { id: value.id, stage: value.stage };
  } catch { /* Browsing still works when tab storage is blocked. */ }
  return { id: 'tshirt', stage: 0 };
}
export function writeStoryProgress(id: string, stage: number) {
  try { sessionStorage.setItem(STORY_PROGRESS_KEY, JSON.stringify({ id, stage })); } catch { /* Session resume is optional. */ }
}
