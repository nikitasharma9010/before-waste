import React, { useState, useEffect, useRef } from 'react';
import { PAUSE_DAYS } from '../data/pauseChallengeData';
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';
import {
  loadCompletedDays,
  loadNotes,
  saveCompletedDays,
  saveNotes,
  clearPauseData
} from '../utils/storage';
import { AccessibleDialog } from './AccessibleDialog';

export const SevenDayPause: React.FC = () => {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [storageUnavailableNotice, setStorageUnavailableNotice] = useState<string | null>(null);

  const progressRef = useRef<HTMLDivElement>(null);
  const resetTriggerRef = useRef<HTMLButtonElement>(null);

  // Load from localStorage on mount with schema validation
  useEffect(() => {
    const { days, isStorageAvailable: daysAvail } = loadCompletedDays();
    const { notes: loadedNotes, isStorageAvailable: notesAvail } = loadNotes();

    setCompletedDays(days);
    setNotes(loadedNotes);

    if (!daysAvail || !notesAvail) {
      setStorageUnavailableNotice(
        'Notice: Device storage is restricted or unavailable. Your reflections will be active for this session only.'
      );
    }
  }, []);

  // Has any user progress (completed day OR non-empty note)
  const hasUserProgress =
    completedDays.length > 0 ||
    Object.values(notes).some((text) => typeof text === 'string' && text.trim().length > 0);

  // Toggle completion with side-effect outside updater
  const toggleDayCompletion = (dayNumber: number) => {
    const isCompleted = completedDays.includes(dayNumber);
    const updated = isCompleted
      ? completedDays.filter((d) => d !== dayNumber)
      : [...completedDays, dayNumber].sort((a, b) => a - b);

    setCompletedDays(updated);

    const success = saveCompletedDays(updated);
    if (!success) {
      setStorageUnavailableNotice(
        'Notice: Unable to save progress to device storage. Reflections are active for this session only.'
      );
    }
  };

  // Handle note change with side-effect outside updater
  const handleNoteChange = (dayNumber: number, text: string) => {
    const updated = { ...notes, [dayNumber]: text };
    setNotes(updated);

    const success = saveNotes(updated);
    if (!success) {
      setStorageUnavailableNotice(
        'Notice: Unable to save progress to device storage. Reflections are active for this session only.'
      );
    }
  };

  // Safe reset
  const handleReset = () => {
    if (!clearPauseData()) {
      setStorageUnavailableNotice(
        "Unable to clear saved reflections. Your progress is still shown; please try resetting again. Previously saved notes may return after reloading."
      );
      setShowResetConfirm(false);
      return;
    }
    setCompletedDays([]);
    setNotes({});
    setStorageUnavailableNotice(null);
    setShowResetConfirm(false);
  };

  return (
    <section id="pause" className="scroll-mt-20 py-16 lg:py-24 bg-surface border-b border-ink/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="section-kicker text-clay mb-2">
            <span>A GENTLE EXPERIMENT</span>
            <span aria-hidden="true">·</span>
            <span>THE 7-DAY PAUSE</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-ink font-normal leading-tight text-balance">
            You don&apos;t have to change everything. Start by noticing one thing.
          </h2>
          <p className="mt-3 text-lg text-ink/80 font-normal leading-relaxed">
            For seven days, pause for a quiet breath before buying something. Explore one question each day, or choose the one that fits today.
          </p>
        </div>

        <p className="mb-6 text-sm text-ink/80">These reflections are separate from your saved action. Completion records the questions you explored, rather than measuring waste avoided.</p>

        {/* Storage Notice Banner */}
        {storageUnavailableNotice && (
          <div
            role="status"
            className="mb-6 p-4 rounded-xl bg-paper border border-oat-border flex items-start gap-3 text-xs sm:text-sm text-ink"
          >
            <AlertTriangle className="w-5 h-5 text-clay shrink-0 mt-0.5" aria-hidden="true" />
            <p>{storageUnavailableNotice}</p>
          </div>
        )}

        {/* Progress Strip & Reset Bar */}
        <div ref={progressRef} tabIndex={-1} aria-label="7-Day Pause progress" className="bg-paper rounded-2xl border border-ink/10 p-4 sm:p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 shrink-0 rounded-xl bg-surface border border-ink/15 flex items-center justify-center text-clay font-bold font-mono text-base"
              aria-label={`${completedDays.length} of 7 days completed`}
            >
              {completedDays.length}/7
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">
                {completedDays.length === 0
                  ? 'Ready to begin when you are'
                  : completedDays.length === 7
                  ? 'All seven days explored! You noticed everything.'
                  : `${completedDays.length} of 7 questions explored`}
              </p>
              <p className="text-xs text-ink/75">
                {storageUnavailableNotice ? 'Device storage could not be confirmed. See the notice above.' : 'Saved privately on this browser only.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {hasUserProgress && (
              <button
                ref={resetTriggerRef}
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-semibold text-ink bg-surface border border-ink/15 hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-ink transition-colors cursor-pointer"
                aria-label="Reset all 7-Day Pause progress and reflections"
              >
                <RotateCcw className="w-4 h-4 text-clay" aria-hidden="true" />
                <span>Reset Progress</span>
              </button>
            )}
          </div>
        </div>

        {/* Reusable Accessible Dialog for Reset Confirmation */}
        <AccessibleDialog
          isOpen={showResetConfirm}
          onClose={() => setShowResetConfirm(false)}
          triggerRef={resetTriggerRef}
          fallbackFocusRef={progressRef}
          titleId="reset-dialog-title"
          title="Reset your 7-Day Pause?"
          descriptionId="reset-dialog-description"
          description="This will uncheck all marked days and clear your saved reflection notes on this device."
          maxWidthClass="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
              You can restart the 7-day reflection whenever you like. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink/10">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2.5 min-h-[44px] text-xs font-semibold rounded-xl text-ink hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-ink cursor-pointer"
              >
                Keep Progress
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 min-h-[44px] text-xs font-semibold rounded-xl text-white bg-clay hover:bg-clay-strong focus-visible:ring-2 focus-visible:ring-clay cursor-pointer shadow-sm"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </AccessibleDialog>

        {/* 7-Day Accordion / Cards List */}
        <div className="space-y-4">
          {PAUSE_DAYS.map((day) => {
            const isCompleted = completedDays.includes(day.day);
            const isExpanded = expandedDay === day.day;
            const inputId = `reflection-note-day-${day.day}`;
            const contentId = `day-content-${day.day}`;

            return (
              <div
                key={day.day}
                className={`rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-paper/90 border-forest/40'
                    : 'bg-surface border-ink/15 hover:border-ink/30'
                }`}
              >
                {/* Day Header Row */}
                <div className="p-3.5 sm:p-5 flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5">
                    {/* Checkbox Button */}
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isCompleted}
                      onClick={() => toggleDayCompletion(day.day)}
                      className="mt-0.5 sm:mt-0 p-1.5 sm:p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-ink/75 hover:text-forest focus-visible:ring-2 focus-visible:ring-forest rounded-lg transition-colors cursor-pointer"
                      aria-label={`Day ${day.day}: ${day.shortLabel} — ${isCompleted ? 'Marked complete' : 'Mark complete'}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-forest" aria-hidden="true" />
                      ) : (
                        <Circle className="w-6 h-6 text-ink/40 hover:text-ink" aria-hidden="true" />
                      )}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-xs font-mono font-bold text-clay">
                          DAY 0{day.day}
                        </span>
                        <span aria-hidden="true" className="text-xs text-ink/40">·</span>
                        <span className="text-xs font-medium text-ink/75">
                          {day.shortLabel}
                        </span>
                      </div>
                      <h3
                        className={`font-editorial text-base sm:text-xl font-semibold mt-0.5 ${
                          isCompleted ? 'text-ink/75 line-through decoration-forest/60' : 'text-ink'
                        }`}
                      >
                        {day.question}
                      </h3>
                    </div>
                  </div>

                  {/* Toggle Details Button */}
                  <button
                    type="button"
                    onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                    aria-expanded={isExpanded}
                    aria-controls={contentId}
                    className="p-2 sm:p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-ink/75 hover:text-ink hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-ink transition-colors cursor-pointer shrink-0"
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for Day ${day.day}`}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div
                    id={contentId}
                    role="region"
                    aria-label={`Day ${day.day} details and reflection`}
                    className="px-4 sm:px-5 pb-5 sm:pb-6 pt-2 border-t border-ink/10 space-y-4 animate-in fade-in duration-200"
                  >
                    <p className="text-sm leading-relaxed">{day.actionPrompt}</p>
                    <details className="rounded-xl border border-ink/15 p-3"><summary className="min-h-[44px] cursor-pointer py-2 text-sm font-semibold">More context and a practical tip</summary><p className="mt-2 text-sm">{day.context}</p><p className="mt-3 text-sm">{day.practicalTip}</p></details>
                    {/* Personal scratchpad note with label association */}
                    <div className="pt-2">
                      <label htmlFor={inputId} className="text-xs font-medium text-ink/80 block mb-1.5">
                        Your quiet reflection or what you noticed ({storageUnavailableNotice ? 'saving unavailable' : 'saved locally'}):
                      </label>
                      <textarea
                        rows={3}
                        id={inputId}
                        name={inputId}
                        value={notes[day.day] || ''}
                        onChange={(e) => handleNoteChange(day.day, e.target.value)}
                        placeholder="e.g. Almost bought a thermal mug, but found one in the cupboard..."
                        className="w-full resize-y min-h-[96px] text-base px-3.5 py-2.5 rounded-xl border border-ink/20 bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-clay"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
