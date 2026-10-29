import React from 'react';
import { ArrowRight, Calendar, HeartHandshake } from 'lucide-react';
import { MoodEntry } from '../../types';
import { MOOD_OPTIONS } from './HomeCheckInCard';

interface MoodTrackerPreviewProps {
  entries: MoodEntry[];
  onViewHistory: () => void;
}

export const MoodTrackerPreview: React.FC<MoodTrackerPreviewProps> = ({
  entries,
  onViewHistory,
}) => {
  // Last 7 days or recent 7 entries
  const recentEntries = [...entries].slice(0, 7);

  const getMoodEmoji = (type: string) => {
    const found = MOOD_OPTIONS.find((m) => m.type === type);
    return found ? found.emoji : '😐';
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
  };

  return (
    <section
      className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#E9EEE5] mt-4"
      aria-labelledby="mood-tracker-preview-title"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E9EEE5] text-[#58715B]">
              <Calendar size={16} />
            </span>
            <h2 id="mood-tracker-preview-title" className="text-base sm:text-lg font-bold text-[#293A30]">
              My mood tracker
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#687168] mt-1">
            Your check-ins, your patterns, your pace.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewHistory}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#58715B] hover:text-[#293A30] hover:underline underline-offset-4 py-1 px-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58715B]"
        >
          <span>View mood history</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {recentEntries.length === 0 ? (
        <div className="mt-4 p-4 rounded-xl bg-[#F7F5EF] border border-[#E9EEE5] text-center">
          <HeartHandshake size={24} className="mx-auto text-[#58715B] mb-2 opacity-80" />
          <p className="text-xs sm:text-sm text-[#687168] max-w-sm mx-auto leading-relaxed">
            Your mood history will appear here when you choose to check in. You can start whenever you're ready.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col items-center p-2 rounded-xl bg-[#F7F5EF] border border-[#E9EEE5]/70"
                title={`${formatDate(entry.timestamp)}: ${entry.mood}${entry.note ? ` - "${entry.note}"` : ''}`}
              >
                <span className="text-xl mb-1 select-none">{getMoodEmoji(entry.mood)}</span>
                <span className="text-[10px] font-semibold text-[#293A30] capitalize">
                  {entry.mood}
                </span>
                <span className="text-[9px] text-[#687168] mt-0.5">
                  {formatDate(entry.timestamp)}
                </span>
              </div>
            ))}
          </div>

          {recentEntries[0]?.note && (
            <p className="mt-3 text-xs text-[#687168] bg-[#F7F5EF]/60 p-2.5 rounded-lg border-l-2 border-[#58715B] italic">
              Latest note: &ldquo;{recentEntries[0].note}&rdquo;
            </p>
          )}
        </div>
      )}
    </section>
  );
};
