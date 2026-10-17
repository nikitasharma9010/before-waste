import React, { useState, useEffect } from 'react';
import { PAUSE_DAYS, PauseDay } from '../data/pauseChallengeData';
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  HeartHandshake
} from 'lucide-react';

const STORAGE_KEY_COMPLETED = 'beforewaste_completed_days_v1';
const STORAGE_KEY_NOTES = 'beforewaste_day_notes_v1';

export const SevenDayPause: React.FC = () => {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem(STORAGE_KEY_COMPLETED);
      if (savedCompleted) {
        setCompletedDays(JSON.parse(savedCompleted));
      }
      const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (e) {
      console.warn('Could not read localStorage:', e);
    }
  }, []);

  // Save changes
  const toggleDayCompletion = (dayNumber: number) => {
    setCompletedDays((prev) => {
      const isCompleted = prev.includes(dayNumber);
      const updated = isCompleted
        ? prev.filter((d) => d !== dayNumber)
        : [...prev, dayNumber].sort((a, b) => a - b);
      try {
        localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not write to localStorage:', e);
      }
      return updated;
    });
  };

  const handleNoteChange = (dayNumber: number, text: string) => {
    const updated = { ...notes, [dayNumber]: text };
    setNotes(updated);
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not write notes:', e);
    }
  };

  const handleReset = () => {
    setCompletedDays([]);
    setNotes({});
    try {
      localStorage.removeItem(STORAGE_KEY_COMPLETED);
      localStorage.removeItem(STORAGE_KEY_NOTES);
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
    setShowResetConfirm(false);
  };

  return (
    <section id="pause" className="py-16 lg:py-24 bg-white border-b border-[#202A35]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#FF654F] mb-2">
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

        {/* Progress Strip & Reset Bar */}
        <div className="bg-[#FFF9F0] rounded-2xl border border-[#202A35]/10 p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#202A35]/10 flex items-center justify-center text-[#FF654F] font-bold font-mono">
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
              <p className="text-xs text-[#202A35]/60">
                Progress saved privately on this browser only.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {completedDays.length > 0 && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#202A35]/70 hover:text-[#202A35] hover:bg-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Modal for Reset */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-[#202A35]/10 space-y-4">
              <h3 className="font-editorial text-xl font-semibold text-[#202A35]">
                Reset your 7-Day Pause?
              </h3>
              <p className="text-xs sm:text-sm text-[#202A35]/75 leading-relaxed">
                This will uncheck your completed days and clear saved notes on this device. You can start fresh anytime.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg text-[#202A35]/80 hover:bg-[#202A35]/5 cursor-pointer"
                >
                  Keep progress
                </button>
                <button
                  onClick={handleReset}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg text-white bg-[#FF654F] hover:bg-[#e8543f] cursor-pointer"
                >
                  Yes, reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7-Day Accordion / Cards List */}
        <div className="space-y-4">
          {PAUSE_DAYS.map((day) => {
            const isCompleted = completedDays.includes(day.day);
            const isExpanded = expandedDay === day.day;

            return (
              <div
                key={day.day}
                className={`rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-[#FFF9F0]/80 border-[#0D9F91]/30'
                    : 'bg-white border-[#202A35]/10 hover:border-[#202A35]/20'
                }`}
              >
                {/* Day Header Row */}
                <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Checkbox Button */}
                    <button
                      type="button"
                      onClick={() => toggleDayCompletion(day.day)}
                      className="mt-0.5 sm:mt-0 p-1 text-[#202A35]/40 hover:text-[#0D9F91] focus:outline-none transition-colors cursor-pointer"
                      aria-label={`Mark Day ${day.day} as ${isCompleted ? 'incomplete' : 'completed'}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-[#0D9F91]" />
                      ) : (
                        <Circle className="w-6 h-6 text-[#202A35]/30 hover:text-[#202A35]/60" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#FF654F]">
                          DAY 0{day.day}
                        </span>
                        <span aria-hidden="true" className="text-xs text-[#202A35]/30">·</span>
                        <span className="text-xs font-medium text-[#202A35]/60">
                          {day.shortLabel}
                        </span>
                      </div>
                      <h3
                        className={`font-editorial text-lg sm:text-xl font-semibold mt-0.5 ${
                          isCompleted ? 'text-[#202A35]/80 line-through decoration-[#0D9F91]/50' : 'text-[#202A35]'
                        }`}
                      >
                        {day.question}
                      </h3>
                    </div>
                  </div>

                  {/* Toggle Details Button */}
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                    className="p-2 rounded-lg text-[#202A35]/60 hover:text-[#202A35] hover:bg-[#202A35]/5 transition-colors cursor-pointer shrink-0"
                    aria-label="Toggle reflection details"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-[#202A35]/8 space-y-4 animate-in fade-in duration-200">
                    <p className="text-sm text-[#202A35]/80 leading-relaxed max-w-3xl">
                      {day.context}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#202A35]/8">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#FF654F] block mb-1">
                          Today&apos;s Invitation
                        </span>
                        <p className="text-xs sm:text-sm text-[#202A35]/85 leading-relaxed">
                          {day.actionPrompt}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#E6F8F6] border border-[#B2ECE6]">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#0D9F91] block mb-1">
                          Practical Tip
                        </span>
                        <p className="text-xs sm:text-sm text-[#202A35]/85 leading-relaxed">
                          {day.practicalTip}
                        </p>
                      </div>
                    </div>

                    {/* Thought starter quote */}
                    <div className="p-3.5 bg-white/60 rounded-xl border border-[#202A35]/5 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#FFC857] shrink-0 mt-0.5" />
                      <p className="text-xs italic text-[#202A35]/80">
                        &ldquo;{day.thoughtStarter}&rdquo;
                      </p>
                    </div>

                    {/* Personal scratchpad note */}
                    <div className="pt-2">
                      <label className="text-xs font-medium text-[#202A35]/70 block mb-1.5">
                        Your quiet reflection or what you noticed (saved locally):
                      </label>
                      <input
                        type="text"
                        value={notes[day.day] || ''}
                        onChange={(e) => handleNoteChange(day.day, e.target.value)}
                        placeholder="e.g. Almost bought a thermal mug, but found one in the cupboard..."
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#202A35]/15 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF654F]/30"
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
