import React, { useState } from 'react';
import { CaraAvatar } from '../common/CaraAvatar';
import { MoodType, MoodOption } from '../../types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HomeCheckInCardProps {
  preferredName: string;
  onStartCheckIn: (selectedMood?: MoodType) => void;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { type: 'low', label: 'Low', emoji: '😞', description: 'Feeling drained or down' },
  { type: 'stressed', label: 'Stressed', emoji: '😟', description: 'Under heavy pressure' },
  { type: 'okay', label: 'Okay', emoji: '😐', description: 'Getting through the day' },
  { type: 'good', label: 'Good', emoji: '🙂', description: 'Things are steady' },
  { type: 'great', label: 'Great', emoji: '😄', description: 'Energised and thriving' },
];

export const HomeCheckInCard: React.FC<HomeCheckInCardProps> = ({
  preferredName,
  onStartCheckIn,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  const handleStart = () => {
    onStartCheckIn(selectedMood || undefined);
  };

  return (
    <section
      className="bg-[#E9EEE5] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#DCE4D6] relative overflow-hidden"
      aria-labelledby="checkin-heading"
    >
      {/* Gentle background accent curve */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/30 rounded-full blur-2xl pointer-events-none" />

      {/* Greeting and Cara Header */}
      <div className="flex items-start gap-3.5 mb-4 relative z-10">
        <CaraAvatar size="lg" className="shrink-0" />
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/70 text-[#58715B] text-xs font-medium mb-1">
            <Sparkles size={12} />
            <span>Cara.ai Guide & Coach</span>
          </div>
          <h1 id="checkin-heading" className="text-xl sm:text-2xl font-bold text-[#293A30]">
            Hello, {preferredName}!
          </h1>
          <p className="text-sm text-[#4F5B50] mt-0.5 leading-relaxed">
            I'm Cara.ai, your confidential wellbeing space. I'm here to listen, guide, and help you find a calm next step.
          </p>
        </div>
      </div>

      {/* Main question */}
      <div className="mt-4 pt-4 border-t border-[#D6DFD0] relative z-10">
        <h2 className="text-base font-semibold text-[#293A30]">
          How are you feeling today?
        </h2>
        <p className="text-xs text-[#687168] mt-0.5">
          Take a moment for yourself. There is no right or wrong answer.
        </p>

        {/* 5 Selectable Mood Options */}
        <div
          role="radiogroup"
          aria-label="How are you feeling today?"
          className="grid grid-cols-5 gap-2 sm:gap-3 mt-3.5"
        >
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood === mood.type;
            return (
              <button
                key={mood.type}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedMood(isSelected ? null : mood.type)}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58715B] text-center ${
                  isSelected
                    ? 'bg-white shadow-md border-2 border-[#58715B] scale-105'
                    : 'bg-white/80 hover:bg-white hover:shadow-xs border border-transparent'
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-1 select-none" role="img" aria-label={mood.label}>
                  {mood.emoji}
                </span>
                <span
                  className={`text-xs ${
                    isSelected ? 'font-bold text-[#293A30]' : 'font-medium text-[#4F5B50]'
                  }`}
                >
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={handleStart}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#58715B] hover:bg-[#485e4b] active:scale-[0.99] text-white font-medium text-sm shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#58715B]"
          >
            <span>{selectedMood ? `Start my check-in (${selectedMood})` : 'Start my check-in'}</span>
            <ArrowRight size={16} />
          </button>

          {!selectedMood && (
            <button
              type="button"
              onClick={() => onStartCheckIn()}
              className="px-3 py-2 text-xs text-[#58715B] hover:text-[#293A30] underline underline-offset-4 text-center font-medium transition-colors"
            >
              Talk to Cara without selecting
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
