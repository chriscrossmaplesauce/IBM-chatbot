import React, { useState } from 'react';
import { Eye, Hand, Volume2, Flower2, Coffee, Check, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';
import { incrementCompletedTools } from '../../utils/storage';

interface SensoryResetProps {
  onFinish?: () => void;
}

interface GroundingStep {
  count: number;
  sense: string;
  instruction: string;
  prompt: string;
  icon: any;
  example: string;
}

const STEPS: GroundingStep[] = [
  {
    count: 5,
    sense: 'Sight',
    instruction: 'Look around your classroom, desk, or room right now.',
    prompt: 'Acknowledge 5 things you can see around you.',
    icon: Eye,
    example: 'E.g., A stack of exercise books, sunlight on the whiteboard, your favourite mug, green tree leaves through the window, the grain of your desk.',
  },
  {
    count: 4,
    sense: 'Touch',
    instruction: 'Bring awareness to physical contact points in the present moment.',
    prompt: 'Notice 4 things you can physically feel.',
    icon: Hand,
    example: 'E.g., The texture of your pen, your feet planted on the classroom floor, the backrest against your spine, the temperature of the air on your arms.',
  },
  {
    count: 3,
    sense: 'Sound',
    instruction: 'Listen beyond immediate thoughts to the ambient soundscape.',
    prompt: 'Listen for 3 distinct sounds in your environment.',
    icon: Volume2,
    example: 'E.g., The hum of the classroom air conditioner, distant chatter from the hallway, wind rustling outside.',
  },
  {
    count: 2,
    sense: 'Smell',
    instruction: 'Notice the subtle scents in your current space.',
    prompt: 'Notice 2 things you can smell right now.',
    icon: Flower2,
    example: 'E.g., Freshly brewed tea or coffee, dry whiteboard markers, paper, or fresh morning air.',
  },
  {
    count: 1,
    sense: 'Taste',
    instruction: 'Bring your awareness to the inside of your mouth.',
    prompt: 'Notice 1 taste or swallow gently with intention.',
    icon: Coffee,
    example: 'E.g., The lingering taste of mint or lunch, a sip of cool water, or simply noticing a clean palate.',
  },
];

export const SensoryReset: React.FC<SensoryResetProps> = ({ onFinish }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userNotes, setUserNotes] = useState<string[]>(['', '', '', '', '']);

  const step = STEPS[currentStepIndex];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      incrementCompletedTools();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsCompleted(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#293A30]">Sensory Reset (5-4-3-2-1)</h3>
          <p className="text-xs text-[#687168]">
            Anchor your racing thoughts into immediate physical reality.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E9EEE5] text-[#58715B]">
          Step {isCompleted ? '5/5' : `${currentStepIndex + 1}/5`}
        </span>
      </div>

      {!isCompleted ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F5EF] border border-[#E9EEE5]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#58715B] text-white flex items-center justify-center font-bold text-lg shadow-2xs">
              {step.count}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#58715B]">
                {step.sense}
              </span>
              <h4 className="text-base font-bold text-[#293A30]">
                {step.prompt}
              </h4>
            </div>
          </div>

          <p className="text-xs text-[#687168] leading-relaxed mb-3">
            {step.instruction}
          </p>

          <div className="p-3 bg-white/80 rounded-xl border border-[#E9EEE5] text-xs text-[#4F5B50] mb-4">
            <span className="font-semibold text-[#293A30]">Examples: </span>
            {step.example}
          </div>

          {/* Optional Reflection input */}
          <div className="mb-4">
            <label className="text-xs font-medium text-[#687168] block mb-1">
              What did you notice? (Optional):
            </label>
            <input
              type="text"
              value={userNotes[currentStepIndex]}
              onChange={(e) => {
                const next = [...userNotes];
                next[currentStepIndex] = e.target.value;
                setUserNotes(next);
              }}
              placeholder={`Notice ${step.count} things...`}
              className="w-full text-xs p-2.5 bg-white rounded-xl border border-[#DCE4D6] focus:border-[#58715B] focus:outline-none"
            />
          </div>

          {/* Stepper buttons */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E9EEE5]">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl text-[#687168] hover:text-[#293A30] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNext}
                className="px-3 py-2 text-xs text-[#687168] hover:text-[#293A30] font-medium transition-colors"
              >
                Skip step
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
              >
                <span>{currentStepIndex === STEPS.length - 1 ? 'Finish Exercise' : 'Next Step'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-[#E9EEE5]/80 border border-[#DCE4D6] text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#58715B] text-white flex items-center justify-center mb-3 shadow-xs">
            <Check size={24} />
          </div>
          <h4 className="text-base font-bold text-[#293A30]">
            Grounding Complete
          </h4>
          <p className="text-xs text-[#4F5B50] max-w-sm mx-auto mt-1 leading-relaxed">
            You took five conscious steps back into the physical present. Notice the difference in your breathing and heart rate.
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#687168] hover:text-[#293A30] bg-white rounded-xl transition-colors"
            >
              <RotateCcw size={14} />
              <span>Do Again</span>
            </button>
            {onFinish && (
              <button
                type="button"
                onClick={onFinish}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#58715B] text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                <Check size={14} />
                <span>Return to Tools</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
