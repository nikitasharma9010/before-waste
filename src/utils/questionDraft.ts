export const QUESTION_DRAFT_KEY = 'beforewaste_question_handoff';
export function handoffQuestion(question: string): boolean {
  try { sessionStorage.setItem(QUESTION_DRAFT_KEY, JSON.stringify({ question: question.trim().slice(0, 1500), created: Date.now() })); return true; }
  catch { return false; }
}
export function takeQuestionDraft(): string {
  try {
    const raw = sessionStorage.getItem(QUESTION_DRAFT_KEY);
    sessionStorage.removeItem(QUESTION_DRAFT_KEY);
    const draft: unknown = raw ? JSON.parse(raw) : null;
    if (!draft || typeof draft !== 'object' || !('question' in draft) || typeof draft.question !== 'string' || draft.question.length > 1500 ||
      !('created' in draft) || typeof draft.created !== 'number' || draft.created > Date.now() || Date.now() - draft.created > 15 * 60 * 1000) return '';
    return draft.question.trim();
  } catch { return ''; }
}
