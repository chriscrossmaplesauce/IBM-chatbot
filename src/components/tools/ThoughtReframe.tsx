import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, BookOpen, RotateCcw, Sparkles } from 'lucide-react';
import { saveJournalEntry, incrementCompletedTools } from '../../utils/storage';

interface ThoughtReframeProps {
  onFinish?: () => void;
}

interface StepInfo {
  number: number;
  title: string;
  helper: string;
  placeholder: string;
  teacherExample: string;
}

const REFRAME_STEPS: StepInfo[] = [
  {
    number: 1,
    title: 'What situation is troubling you?',
    helper: 'Describe the factual trigger without judging yourself.',
    placeholder: 'E.g., I received an email from a parent questioning their child’s grade, or I looked at the pile of 50 unmarked mock exams.',
    teacherExample: 'Example: I have 2 hours left before going home and 45 history books still unread.',
  },
  {
    number: 2,
    title: 'What automatic thought or worry came up?',
    helper: 'What is your inner critic saying about this situation?',
    placeholder: 'E.g., "I am falling behind", "The parents think I’m incompetent", or "I will never get on top of this."',
    teacherExample: 'Example: "If I don’t finish these tonight, I am failing my class and people will judge me."',
  },
  {
    number: 3,
    title: 'What emotions are you experiencing?',
    helper: 'Name the feelings (e.g. guilt, anxiety, exhaustion, anger, inadequacy).',
    placeholder: 'E.g., Overwhelmed (8/10), guilty for wanting to go home, tense in the chest.',
    teacherExample: 'Example: Heavy dread and guilt, feeling like I have no right to rest.',
  },
  {
    number: 4,
    title: 'What facts support or challenge that thought?',
    helper: 'Look objectively: Is it 100% true that you are failing, or are expectations simply unrealistic?',
    placeholder: 'Facts against: I worked diligently all day, students got feedback on 3 prior tasks, no teacher could mark 45 books in 2 hours...',
    teacherExample: 'Example: Fact: The curriculum timeline is overloaded. The students do not need all 45 books tomorrow; they only need lesson notes.',
  },
  {
    number: 5,
    title: 'Is there a more balanced, fair way to view this?',
    helper: 'Not false toxic positivity, but realistic compassion for a hardworking educator.',
    placeholder: 'E.g., "Leaving unfinished marking at school tonight allows me to rest so I can teach with patience and clarity tomorrow."',
    teacherExample: 'Example: "Marking 15 books today and leaving the rest for Thursday is completely responsible. I am human, not a grading machine."',
  },
  {
    number: 6,
    title: 'What is one helpful next step?',
    helper: 'One small, concrete action to take right now.',
    placeholder: 'E.g., Pick 5 key questions to sample-grade, pack my bag, and head home at 5:00 PM.',
    teacherExample: 'Example: Mark just 5 books using the 80% rule, close the lid, and step outside for a 10-minute walk.',
  },
];

export const ThoughtReframe: React.FC<ThoughtReframeProps> = ({ onFinish }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '', '']);
  const [isSavedToJournal, setIsSavedToJournal] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = REFRAME_STEPS[stepIndex];

  const handleNext = () => {
    if (stepIndex < REFRAME_STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      incrementCompletedTools();
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const handleSaveToJournal = () => {
    const summary = `Thought Reframe:\n- Situation: ${answers[0] || 'N/A'}\n- Initial Thought: ${answers[1] || 'N/A'}\n- Balanced View: ${answers[4] || 'N/A'}\n- Next Step: ${answers[5] || 'N/A'}`;
    saveJournalEntry({
      promptText: 'Thought Reframe Reflection',
      content: summary,
    });
    setIsSavedToJournal(true);
  };

  const handleReset = () => {
    setStepIndex(0);
    setAnswers(['', '', '', '', '', '']);
    setIsSavedToJournal(false);
    setIsFinished(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#293A30]">Thought Reframe</h3>
          <p className="text-xs text-[#687168]">
            A CBT-inspired reflection to step out of perfectionism and overwhelm.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E9EEE5] text-[#58715B] shrink-0">
          Step {isFinished ? '6/6' : `${stepIndex + 1}/6`}
        </span>
      </div>

      {!isFinished ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F5EF] border border-[#E9EEE5]">
          {/* Progress bar */}
          <div className="w-full bg-[#E9EEE5] h-1.5 rounded-full overflow-hidden mb-4">
            <div
              className="bg-[#58715B] h-full transition-all duration-300"
              style={{ width: `${((stepIndex + 1) / 6) * 100}%` }}
            />
          </div>

          <h4 className="text-base font-bold text-[#293A30] mb-1">
            {currentStep.title}
          </h4>
          <p className="text-xs text-[#687168] mb-3 leading-relaxed">
            {currentStep.helper}
          </p>

          <textarea
            rows={3}
            value={answers[stepIndex]}
            onChange={(e) => {
              const next = [...answers];
              next[stepIndex] = e.target.value;
              setAnswers(next);
            }}
            placeholder={currentStep.placeholder}
            className="w-full text-xs sm:text-sm p-3 bg-white rounded-xl border border-[#DCE4D6] focus:border-[#58715B] focus:outline-none mb-3 resize-none leading-relaxed"
          />

          <div className="p-2.5 bg-white/70 rounded-xl border border-[#E9EEE5] text-[11px] text-[#4F5B50] mb-4">
            <span className="font-semibold text-[#293A30]">Teacher note: </span>
            {currentStep.teacherExample}
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E9EEE5]">
            <button
              type="button"
              onClick={handleBack}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl text-[#687168] hover:text-[#293A30] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNext}
                className="px-3 py-2 text-xs text-[#687168] hover:text-[#293A30] font-medium transition-colors"
              >
                Skip question
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
              >
                <span>{stepIndex === 5 ? 'Review Reframe' : 'Continue'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#E9EEE5]/80 border border-[#DCE4D6]">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-2 rounded-xl bg-[#58715B] text-white">
              <Sparkles size={18} />
            </span>
            <div>
              <h4 className="text-base font-bold text-[#293A30]">Your Balanced Perspective</h4>
              <p className="text-xs text-[#687168]">Notice the shift from panic to realistic agency.</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs bg-white p-4 rounded-xl border border-[#DCE4D6] mb-4">
            <div>
              <span className="font-bold text-[#687168] block text-[10px] uppercase">Original worry:</span>
              <p className="text-[#293A30] font-medium">{answers[1] || '(Skipped original worry)'}</p>
            </div>
            <div className="pt-2 border-t border-[#E9EEE5]">
              <span className="font-bold text-[#58715B] block text-[10px] uppercase">Balanced view:</span>
              <p className="text-[#293A30] font-semibold">{answers[4] || '(Adopt a compassionate, balanced boundary)'}</p>
            </div>
            <div className="pt-2 border-t border-[#E9EEE5]">
              <span className="font-bold text-[#293A30] block text-[10px] uppercase">Next manageable step:</span>
              <p className="text-[#293A30]">{answers[5] || '(Take one small action and finish for today)'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#687168] hover:text-[#293A30] bg-white rounded-xl transition-colors"
            >
              <RotateCcw size={14} />
              <span>Start New Reframe</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveToJournal}
                disabled={isSavedToJournal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F7F5EF] text-[#58715B] border border-[#58715B] text-xs font-semibold rounded-xl shadow-2xs transition-colors disabled:opacity-60"
              >
                <BookOpen size={14} />
                <span>{isSavedToJournal ? 'Saved to Journal ✓' : 'Save to My Journal'}</span>
              </button>

              {onFinish && (
                <button
                  type="button"
                  onClick={onFinish}
                  className="px-4 py-2 bg-[#58715B] text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
