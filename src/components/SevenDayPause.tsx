import React, { useState, useEffect, useRef } from 'react';
import { PAUSE_DAYS } from '../data/pauseChallengeData';
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  Sparkles,
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
    setCompletedDays([]);
    setNotes({});
    clearPauseData();
    setShowResetConfirm(false);
  };

  return (
    <section id="pause" className="scroll-mt-20 py-16 lg:py-24 bg-white border-b border-[#202A35]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#C53B27] mb-2">
            <span>A GENTLE EXPERIMENT</span>
            <span aria-hidden="true">·</span>
            <span>THE 7-DAY PAUSE</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#202A35] font-normal leading-tight text-balance">
            You don&apos;t have to change everything. Start by noticing one thing.
          </h2>
          <p className="mt-3 text-lg text-[#202A35]/80 font-normal leading-relaxed">
            For seven days, pause for a quiet breath before buying something. No accounts, no leaderboards, no streaks—just seven simple questions to explore at your own pace.
          </p>
        </div>

        {/* Optional Storage Notice Banner */}
        {storageUnavailableNotice && (
          <div
            role="status"
            className="mb-6 p-4 rounded-xl bg-[#FFF9EB] border border-[#FFE7B3] flex items-start gap-3 text-xs sm:text-sm text-[#202A35]"
          >
            <AlertTriangle className="w-5 h-5 text-[#B88000] shrink-0 mt-0.5" aria-hidden="true" />
            <p>{storageUnavailableNotice}</p>
          </div>
        )}

        {/* Progress Strip & Reset Bar */}
        <div className="bg-[#FFF9F0] rounded-2xl border border-[#202A35]/10 p-4 sm:p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl bg-white border border-[#202A35]/15 flex items-center justify-center text-[#C53B27] font-bold font-mono text-base"
              aria-label={`${completedDays.length} of 7 days completed`}
            >
              {completedDays.length}/7
            </div>
            <div>
              <p className="text-sm font-semibold text-[#202A35]">
                {completedDays.length === 0
                  ? 'Ready to begin when you are'
                  : completedDays.length === 7
                  ? 'All seven days explored! You noticed everything.'
                  : `${completedDays.length} of 7 questions explored`}
              </p>
              <p className="text-xs text-[#202A35]/65">
                Saved privately on this browser only.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {hasUserProgress && (
              <button
                ref={resetTriggerRef}
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-semibold text-[#202A35] bg-white border border-[#202A35]/15 hover:bg-[#202A35]/5 focus-visible:ring-2 focus-visible:ring-[#202A35] transition-colors cursor-pointer"
                aria-label="Reset all 7-Day Pause progress and reflections"
              >
                <RotateCcw className="w-4 h-4 text-[#C53B27]" aria-hidden="true" />
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
          titleId="reset-dialog-title"
          title="Reset your 7-Day Pause?"
          descriptionId="reset-dialog-description"
          description="This will uncheck all marked days and clear your saved reflection notes on this device."
          maxWidthClass="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-[#202A35]/80 leading-relaxed">
              You can restart the 7-day reflection whenever you like. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#202A35]/10">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2.5 min-h-[44px] text-xs font-semibold rounded-xl text-[#202A35] hover:bg-[#202A35]/5 focus-visible:ring-2 focus-visible:ring-[#202A35] cursor-pointer"
              >
                Keep Progress
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 min-h-[44px] text-xs font-semibold rounded-xl text-white bg-[#C53B27] hover:bg-[#AB2F1D] focus-visible:ring-2 focus-visible:ring-[#C53B27] cursor-pointer shadow-sm"
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
                    ? 'bg-[#FFF9F0]/90 border-[#086E64]/40'
                    : 'bg-white border-[#202A35]/15 hover:border-[#202A35]/30'
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
                      className="mt-0.5 sm:mt-0 p-1.5 sm:p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#202A35]/50 hover:text-[#086E64] focus-visible:ring-2 focus-visible:ring-[#086E64] rounded-lg transition-colors cursor-pointer"
                      aria-label={`Day ${day.day}: ${day.shortLabel} — ${isCompleted ? 'Marked complete' : 'Mark complete'}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-[#086E64]" aria-hidden="true" />
                      ) : (
                        <Circle className="w-6 h-6 text-[#202A35]/40 hover:text-[#202A35]" aria-hidden="true" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#C53B27]">
                          DAY 0{day.day}
                        </span>
                        <span aria-hidden="true" className="text-xs text-[#202A35]/40">·</span>
                        <span className="text-xs font-medium text-[#202A35]/70">
                          {day.shortLabel}
                        </span>
                      </div>
                      <h3
                        className={`font-editorial text-base sm:text-xl font-semibold mt-0.5 ${
                          isCompleted ? 'text-[#202A35]/75 line-through decoration-[#086E64]/60' : 'text-[#202A35]'
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
                    className="p-2 sm:p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#202A35]/70 hover:text-[#202A35] hover:bg-[#202A35]/5 focus-visible:ring-2 focus-visible:ring-[#202A35] transition-colors cursor-pointer shrink-0"
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
                    className="px-4 sm:px-5 pb-5 sm:pb-6 pt-2 border-t border-[#202A35]/10 space-y-4 animate-in fade-in duration-200"
                  >
                    <p className="text-sm text-[#202A35]/85 leading-relaxed max-w-3xl">
                      {day.context}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#202A35]/10">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#C53B27] block mb-1">
                          Today&apos;s Invitation
                        </span>
                        <p className="text-xs sm:text-sm text-[#202A35]/85 leading-relaxed">
                          {day.actionPrompt}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#E6F8F6] border border-[#B2ECE6]">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#086E64] block mb-1">
                          Practical Tip
                        </span>
                        <p className="text-xs sm:text-sm text-[#202A35]/85 leading-relaxed">
                          {day.practicalTip}
                        </p>
                      </div>
                    </div>

                    {/* Thought starter quote */}
                    <div className="p-3.5 bg-white/70 rounded-xl border border-[#202A35]/10 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#B88000] shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-xs italic text-[#202A35]/85">
                        &ldquo;{day.thoughtStarter}&rdquo;
                      </p>
                    </div>

                    {/* Personal scratchpad note with label association */}
                    <div className="pt-2">
                      <label htmlFor={inputId} className="text-xs font-medium text-[#202A35]/80 block mb-1.5">
                        Your quiet reflection or what you noticed (saved locally):
                      </label>
                      <input
                        type="text"
                        id={inputId}
                        name={inputId}
                        value={notes[day.day] || ''}
                        onChange={(e) => handleNoteChange(day.day, e.target.value)}
                        placeholder="e.g. Almost bought a thermal mug, but found one in the cupboard..."
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#202A35]/20 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C53B27]"
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
