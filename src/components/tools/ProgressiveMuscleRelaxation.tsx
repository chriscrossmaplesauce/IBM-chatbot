import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, AlertCircle, Check, SkipForward } from 'lucide-react';
import { incrementCompletedTools } from '../../utils/storage';

interface MuscleGroup {
  name: string;
  tenseInstruction: string;
  relaxInstruction: string;
  duration: number; // in seconds
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  {
    name: 'Hands and Forearms',
    tenseInstruction: 'Clench both fists gently. Feel the firmness in your wrists and forearms. Hold comfortably without straining.',
    relaxInstruction: 'Open your hands wide, then let fingers soften and curl naturally on your lap. Feel the warmth and release.',
    duration: 10,
  },
  {
    name: 'Shoulders and Neck',
    tenseInstruction: 'Gently shrug both shoulders up towards your ears. Notice where the tension accumulates from classroom stress.',
    relaxInstruction: 'Drop your shoulders completely down. Feel them melt away from your neck. Notice the sudden feeling of lightness.',
    duration: 12,
  },
  {
    name: 'Face, Forehead and Jaw',
    tenseInstruction: 'Scrunch your facial muscles gently—frown slightly and clench your teeth very gently without grinding.',
    relaxInstruction: 'Let your jaw unhinge slightly. Smooth your forehead and let your tongue rest quietly on the floor of your mouth.',
    duration: 10,
  },
  {
    name: 'Chest, Back and Abdomen',
    tenseInstruction: 'Draw in a deep breath and gently tighten your abdominal core and upper back.',
    relaxInstruction: 'Breathe out with a soft release. Let your stomach soften completely. Allow the chair or floor to hold your weight.',
    duration: 12,
  },
  {
    name: 'Legs, Calves and Feet',
    tenseInstruction: 'Point your toes upward towards your shins, feeling the calves engage gently without cramping.',
    relaxInstruction: 'Release all tension in your lower limbs. Feel your feet resting flat, supported, and grounded.',
    duration: 10,
  },
];

export const ProgressiveMuscleRelaxation: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'tense' | 'relax'>('tense');
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [relaxationOnly, setRelaxationOnly] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const current = MUSCLE_GROUPS[currentIndex];

  useEffect(() => {
    let timer: any;
    if (isActive && !isDone) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (!relaxationOnly && phase === 'tense') {
              setPhase('relax');
              return 6; // relax for 6s
            } else {
              // Move to next muscle group
              if (currentIndex < MUSCLE_GROUPS.length - 1) {
                setCurrentIndex((i) => i + 1);
                setPhase(relaxationOnly ? 'relax' : 'tense');
                return relaxationOnly ? 8 : 5;
              } else {
                setIsDone(true);
                setIsActive(false);
                incrementCompletedTools();
                return 0;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase, currentIndex, relaxationOnly, isDone]);

  const handleStart = () => {
    setIsActive(true);
    setIsDone(false);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleSkip = () => {
    if (currentIndex < MUSCLE_GROUPS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setPhase(relaxationOnly ? 'relax' : 'tense');
      setSecondsLeft(relaxationOnly ? 8 : 5);
    } else {
      setIsDone(true);
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentIndex(0);
    setPhase(relaxationOnly ? 'relax' : 'tense');
    setSecondsLeft(relaxationOnly ? 8 : 5);
    setIsDone(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#293A30]">
            Progressive Muscle Relaxation
          </h3>
          <p className="text-xs text-[#687168]">
            Systematically release physical stress accumulated during the school day.
          </p>
        </div>

        {/* Relaxation-only toggle */}
        <button
          type="button"
          onClick={() => {
            setRelaxationOnly(!relaxationOnly);
            handleReset();
          }}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#DCE4D6] text-[#58715B] hover:bg-[#F7F5EF] transition-colors self-start sm:self-auto"
        >
          {relaxationOnly ? 'Switch to Tense & Release' : 'Use Relaxation-Only Mode'}
        </button>
      </div>

      {/* Safety notice */}
      <div className="mb-4 p-3 rounded-xl bg-[#F7F5EF] border border-[#E9EEE5] flex items-start gap-2.5 text-xs text-[#687168]">
        <AlertCircle size={15} className="text-[#58715B] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#293A30]">Comfort note:</strong> Do not tense painful or injured areas. If any muscle feels tight or uncomfortable, simply focus on gentle breathing and letting go.
        </p>
      </div>

      {!isDone ? (
        <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#E9EEE5] text-center">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {MUSCLE_GROUPS.map((_, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-[#58715B] scale-125'
                    : idx < currentIndex
                    ? 'bg-[#899F8E]'
                    : 'bg-[#DCE4D6]'
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[#58715B]">
            {relaxationOnly ? 'Softening & Resting' : phase === 'tense' ? 'Gently Engage (5s)' : 'Release & Let Go (6s)'}
          </span>

          <h4 className="text-lg font-bold text-[#293A30] mt-1 mb-2">
            {current.name}
          </h4>

          <div className="max-w-md mx-auto p-4 bg-white rounded-xl border border-[#DCE4D6] text-xs sm:text-sm text-[#293A30] leading-relaxed mb-4">
            {relaxationOnly
              ? current.relaxInstruction
              : phase === 'tense'
              ? current.tenseInstruction
              : current.relaxInstruction}
          </div>

          {/* Timer and status */}
          <div className="text-sm font-semibold text-[#58715B] mb-4">
            {isActive ? `${secondsLeft} seconds remaining` : 'Paused'}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            {!isActive ? (
              <button
                type="button"
                onClick={handleStart}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
              >
                <Play size={15} fill="currentColor" />
                <span>{currentIndex === 0 ? 'Begin Relaxation' : 'Resume'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePause}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#293A30] text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                <Pause size={15} fill="currentColor" />
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSkip}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#687168] hover:text-[#293A30] bg-white rounded-xl transition-colors"
              title="Skip this muscle group"
            >
              <SkipForward size={14} />
              <span>Skip Area</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 text-[#687168] hover:text-[#293A30] bg-white rounded-xl transition-colors"
              title="Reset"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-[#E9EEE5]/80 border border-[#DCE4D6] text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#58715B] text-white flex items-center justify-center mb-3 shadow-xs">
            <Check size={24} />
          </div>
          <h4 className="text-base font-bold text-[#293A30]">Session Completed</h4>
          <p className="text-xs text-[#4F5B50] max-w-sm mx-auto mt-1 leading-relaxed">
            Take a slow, natural breath. Notice the reduction of muscular tension in your shoulders, face, and hands.
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-[#58715B] text-white text-xs font-semibold rounded-xl shadow-xs"
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
