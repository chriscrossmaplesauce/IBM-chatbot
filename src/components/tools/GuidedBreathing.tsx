import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';
import { incrementCompletedTools } from '../../utils/storage';

interface GuidedBreathingProps {
  onFinish?: () => void;
}

type BreathingTechnique = 'box' | '478';
type BreathPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Pause';

export const GuidedBreathing: React.FC<GuidedBreathingProps> = ({ onFinish }) => {
  const [technique, setTechnique] = useState<BreathingTechnique>('box');
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('Inhale');
  const [secondsLeftInPhase, setSecondsLeftInPhase] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [gentleMode, setGentleMode] = useState(false); // No-hold alternative for 4-7-8

  // Box: Inhale 4s -> Hold 4s -> Exhale 4s -> Pause 4s
  // 4-7-8 standard: Inhale 4s -> Hold 7s -> Exhale 8s
  // 4-7-8 gentle: Inhale 4s -> Exhale 6s (no breath holding)
  const getPhaseSequence = (): { phase: BreathPhase; duration: number }[] => {
    if (technique === 'box') {
      return [
        { phase: 'Inhale', duration: 4 },
        { phase: 'Hold', duration: 4 },
        { phase: 'Exhale', duration: 4 },
        { phase: 'Pause', duration: 4 },
      ];
    } else {
      if (gentleMode) {
        return [
          { phase: 'Inhale', duration: 4 },
          { phase: 'Exhale', duration: 6 },
        ];
      }
      return [
        { phase: 'Inhale', duration: 4 },
        { phase: 'Hold', duration: 7 },
        { phase: 'Exhale', duration: 8 },
      ];
    }
  };

  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeftInPhase((prev) => {
          if (prev <= 1) {
            const sequence = getPhaseSequence();
            const nextIdx = (phaseIndex + 1) % sequence.length;
            if (nextIdx === 0) {
              setCompletedCycles((c) => {
                const nextC = c + 1;
                if (nextC === 4) {
                  incrementCompletedTools();
                }
                return nextC;
              });
            }
            setPhaseIndex(nextIdx);
            setCurrentPhase(sequence[nextIdx].phase);
            return sequence[nextIdx].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phaseIndex, technique, gentleMode]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    const seq = getPhaseSequence();
    setCurrentPhase(seq[0].phase);
    setSecondsLeftInPhase(seq[0].duration);
    setCompletedCycles(0);
  };

  const switchTechnique = (tech: BreathingTechnique) => {
    setIsActive(false);
    setTechnique(tech);
    setPhaseIndex(0);
    setCompletedCycles(0);
    if (tech === 'box') {
      setCurrentPhase('Inhale');
      setSecondsLeftInPhase(4);
    } else {
      setCurrentPhase('Inhale');
      setSecondsLeftInPhase(4);
    }
  };

  // Visual scale for breath circle
  const getCircleScale = () => {
    if (!isActive) return 'scale-90';
    if (currentPhase === 'Inhale') return 'scale-110 transition-transform duration-[4000ms] ease-out';
    if (currentPhase === 'Hold') return 'scale-110';
    if (currentPhase === 'Exhale') return 'scale-75 transition-transform duration-[4000ms] ease-in';
    return 'scale-75';
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#293A30]">Guided Breathing</h3>
          <p className="text-xs text-[#687168]">
            Ease physical tension and restore parasympathetic calm in under 3 minutes.
          </p>
        </div>

        {/* Technique Switcher */}
        <div className="inline-flex p-1 bg-[#F7F5EF] rounded-xl border border-[#E9EEE5] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => switchTechnique('box')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              technique === 'box'
                ? 'bg-white text-[#58715B] shadow-2xs'
                : 'text-[#687168] hover:text-[#293A30]'
            }`}
          >
            Box Breathing (4-4-4-4)
          </button>
          <button
            type="button"
            onClick={() => switchTechnique('478')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              technique === '478'
                ? 'bg-white text-[#58715B] shadow-2xs'
                : 'text-[#687168] hover:text-[#293A30]'
            }`}
          >
            4-7-8 Calm
          </button>
        </div>
      </div>

      {technique === '478' && (
        <div className="mb-4 p-3 rounded-xl bg-[#F7F5EF] border border-[#E9EEE5] flex items-start gap-2.5 text-xs text-[#687168]">
          <AlertCircle size={16} className="text-[#58715B] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>
              Do not force your breath or hold if you feel lightheaded.
            </span>
            <button
              type="button"
              onClick={() => {
                setGentleMode(!gentleMode);
                handleReset();
              }}
              className="ml-2 font-semibold text-[#58715B] hover:underline"
            >
              {gentleMode ? 'Switch to Standard 4-7-8' : 'Use Gentle Flow (no breath holding)'}
            </button>
          </div>
        </div>
      )}

      {/* Visual Animation Circle Area */}
      <div className="flex flex-col items-center justify-center py-6 sm:py-8 bg-[#FDFCF9] rounded-2xl border border-[#E9EEE5]">
        <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
          {/* Subtle Outer Pulsing Wave */}
          <div
            className={`absolute inset-0 rounded-full bg-[#E9EEE5]/60 transition-transform duration-1000 ${
              isActive ? 'scale-105 animate-pulse' : 'scale-95'
            }`}
          />

          {/* Core Interactive Breathing Orb */}
          <div
            className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-[#899F8E] to-[#58715B] shadow-md flex flex-col items-center justify-center text-white select-none ${getCircleScale()}`}
          >
            <span className="text-xl sm:text-2xl font-bold tracking-tight">
              {isActive ? currentPhase : 'Ready'}
            </span>
            <span className="text-sm font-medium opacity-90 mt-0.5">
              {isActive ? `${secondsLeftInPhase}s` : 'Press Play'}
            </span>
          </div>
        </div>

        {/* Phase instructions */}
        <p className="mt-4 text-xs font-medium text-[#687168] text-center max-w-xs">
          {isActive ? (
            currentPhase === 'Inhale'
              ? 'Breathe in slowly through your nose, expanding your belly...'
              : currentPhase === 'Hold'
              ? 'Hold gently without straining shoulders or neck...'
              : currentPhase === 'Exhale'
              ? 'Release smoothly through parted lips with a soft sigh...'
              : 'Pause quietly before the next gentle inhale...'
          ) : (
            'Find a comfortable posture. Keep your shoulders down and relaxed.'
          )}
        </p>

        {/* Cycle Counter */}
        <div className="mt-2 text-[11px] text-[#58715B] font-semibold bg-[#E9EEE5] px-2.5 py-0.5 rounded-full">
          Cycles completed: {completedCycles}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-center gap-3">
        {!isActive ? (
          <button
            type="button"
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#58715B] hover:bg-[#485e4b] text-white font-medium text-sm rounded-xl shadow-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58715B]"
          >
            <Play size={16} fill="currentColor" />
            <span>Start Exercise</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#293A30] hover:bg-[#1f2c24] text-white font-medium text-sm rounded-xl shadow-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#293A30]"
          >
            <Pause size={16} fill="currentColor" />
            <span>Pause</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="p-2.5 text-[#687168] hover:text-[#293A30] bg-[#F7F5EF] hover:bg-[#E9EEE5] rounded-xl transition-colors"
          title="Reset exercise"
          aria-label="Reset exercise"
        >
          <RotateCcw size={16} />
        </button>

        {completedCycles > 0 && onFinish && (
          <button
            type="button"
            onClick={onFinish}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#58715B] bg-[#E9EEE5] hover:bg-[#DCE4D6] rounded-xl transition-colors ml-2"
          >
            <Check size={14} />
            <span>Finished</span>
          </button>
        )}
      </div>
    </div>
  );
};
