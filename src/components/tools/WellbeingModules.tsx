import React, { useState } from 'react';
import { BookOpen, Clock, CheckCircle2, Circle, ArrowRight, X, Sparkles, HeartHandshake } from 'lucide-react';
import { WellbeingModule } from '../../types';
import { getCompletedModules, toggleModuleCompleted } from '../../utils/storage';

export const MODULES_DATA: WellbeingModule[] = [
  {
    id: 'mod-mindfulness',
    title: 'Mindfulness for the Classroom',
    subtitle: 'Grounding yourself amidst 30 bustling students.',
    category: 'Focus & Calm',
    duration: '5 mins',
    completed: false,
    learningObjectives: [
      'Learn the 30-second silent transition breath between periods.',
      'Notice cognitive fatigue cues before reacting to disruptions.',
      'Practice compassionate awareness with challenging classes.',
    ],
    sections: [
      {
        title: 'The Reality of Classroom Overstimulation',
        content:
          'A teacher makes up to 1,500 pedagogical and behavioral decisions every school day. Sensory overload from bell tones, student questions, and fluorescent lighting slowly depletes your executive function. Mindfulness in teaching is not about sitting in lotus pose; it is about micro-pauses.',
        keyTakeaway: 'Before opening the classroom door, take one conscious inhale with your hand on the door handle.',
      },
      {
        title: 'Micro-Mindfulness Between Periods',
        content:
          'When students change classrooms or move to group work, take 20 seconds. Feel your feet making contact with the floor. Drop your shoulders away from your ears. Check in with your breath without trying to fix anything.',
        keyTakeaway: 'Your calm regulation is contagious. A regulated teacher creates a calm room.',
      },
    ],
  },
  {
    id: 'mod-stress',
    title: 'Stress Management & Nervous System Reset',
    subtitle: 'Understanding the physical toll of adrenaline and cortisol.',
    category: 'Body & Energy',
    duration: '8 mins',
    completed: false,
    learningObjectives: [
      'Recognise sympathetic fight-or-flight triggers in school staff meetings.',
      'Apply physiological sighs to lower heart rate within 45 seconds.',
      'Understand chronic teacher burnout cycles.',
    ],
    sections: [
      {
        title: 'Why Stress Stays in the Body',
        content:
          'When faced with difficult behavior or high-stakes inspection, adrenaline spikes. If you sit down immediately to mark 60 papers, the physical stress cycle never completes. The body still feels in danger.',
        keyTakeaway: 'Physical movement—even walking briskly down the corridor—helps discharge biological stress chemicals.',
      },
      {
        title: 'The Double Inhale Sigh',
        content:
          'Inhale deeply through your nose, take a second tiny "sip" of air at the top to pop open collapsed alveoli in the lungs, and then release a long, smooth exhale through your mouth.',
        keyTakeaway: 'Two rounds of double-inhale sighs measurably lower systolic blood pressure and heart rate.',
      },
    ],
  },
  {
    id: 'mod-regulation',
    title: 'Emotional Regulation in High-Stress Moments',
    subtitle: 'Responding instead of reacting when pushed to your limits.',
    category: 'Emotional Health',
    duration: '6 mins',
    completed: false,
    learningObjectives: [
      'Identify personal buttons and trigger phrases.',
      'Implement the "Pause-Name-Breathe" sequence.',
      'Maintain dignity when addressing defiant classroom situations.',
    ],
    sections: [
      {
        title: 'Separating Behavior from Identity',
        content:
          'When a student refuses to participate or answers back rudely, it is natural to feel disrespected or threatened. Remind yourself: a dysregulated student is not attacking your worth as an educator; they are revealing their own lack of coping tools.',
        keyTakeaway: 'Never attend an argument you weren’t invited to. Give the student space to comply privately.',
      },
    ],
  },
  {
    id: 'mod-gratitude',
    title: 'Gratitude & Micro-Moments of Joy',
    subtitle: 'Rewiring the brain beyond the negativity bias of school problems.',
    category: 'Mindset',
    duration: '5 mins',
    completed: false,
    learningObjectives: [
      'Notice small student breakthroughs that usually get overshadowed.',
      'Keep a "Joy Folder" or physical tin of student thank-you notes.',
      'Counter the mental tally of unsolved administrative demands.',
    ],
    sections: [
      {
        title: 'The Teacher Negativity Bias',
        content:
          'Our evolutionary biology forces us to fixate on the one student who disrupted lesson four or the single critical parent email, completely ignoring the 28 students who learned quietly and smiled.',
        keyTakeaway: 'At the end of the school day, write down ONE ordinary moment that made you smile.',
      },
    ],
  },
  {
    id: 'mod-resilience',
    title: 'Resilience and Sustainable Coping',
    subtitle: 'Staying in teaching for the long haul without sacrificing yourself.',
    category: 'Long-term Health',
    duration: '10 mins',
    completed: false,
    learningObjectives: [
      'Distinguish healthy professional commitment from self-sacrificing martyrdom.',
      'Build peer educator alliances where you can speak frankly.',
      'Set sustainable standards for exam terms and inspection cycles.',
    ],
    sections: [
      {
        title: 'The Myth of the Super-Teacher',
        content:
          'School culture often glamorizes the teacher who stays until 8:00 PM and spends weekends cutting laminated cardboard. True resilience is acknowledging human limits and advocating for sustainable working conditions.',
        keyTakeaway: 'Sustainable mediocrity on paperwork is better than burnout-driven excellence that ends your career.',
      },
    ],
  },
  {
    id: 'mod-sleep',
    title: 'Sleep and Recovery for Educators',
    subtitle: 'Switching off the "school brain" when you lay your head down.',
    category: 'Rest & Recovery',
    duration: '7 mins',
    completed: false,
    learningObjectives: [
      'Establish a "Worry Dump" notebook by your bed.',
      'Create a sensory shutdown buffer between lesson planning and bedtime.',
      'Manage waking up at 3:00 AM with tomorrow’s timetable racing in mind.',
    ],
    sections: [
      {
        title: 'De-escalating the 3:00 AM Lesson Plan',
        content:
          'If your mind wakes up worrying about curriculum targets or problem parents, write it on paper. Once your brain knows the thought is physically captured outside your skull, it permits sleep to resume.',
        keyTakeaway: 'Never keep work materials or marking files on your bedside table or sleeping area.',
      },
    ],
  },
  {
    id: 'mod-boundaries',
    title: 'Work-Life Boundaries & Guilt-Free Rest',
    subtitle: 'Learning how to close the laptop and say no with warmth and firmness.',
    category: 'Boundaries & Balance',
    duration: '9 mins',
    completed: false,
    learningObjectives: [
      'Remove work chat and email notifications from your personal mobile phone.',
      'Formulate polite, professional boundary responses for non-urgent weekend requests.',
      'Release the false guilt of leaving unfinished grading at school.',
    ],
    sections: [
      {
        title: 'The Endless School To-Do List',
        content:
          'Teaching is an infinite profession: you could spend 24 hours a day creating better resources and there would still be more to do. Therefore, leaving work unfinished is not procrastination—it is mathematics.',
        keyTakeaway: 'You do not have to finish everything to deserve a peaceful dinner and good sleep tonight.',
      },
    ],
  },
];

export const WellbeingModules: React.FC = () => {
  const [completedIds, setCompletedIds] = useState<string[]>(getCompletedModules());
  const [activeModule, setActiveModule] = useState<WellbeingModule | null>(null);

  const handleToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleModuleCompleted(id);
    setCompletedIds(updated);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs">
      {/* Section Header */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E9EEE5] text-[#58715B] text-xs font-semibold mb-1.5">
          <BookOpen size={12} />
          <span>Skills & Psychoeducation</span>
        </div>
        <h3 className="text-xl font-bold text-[#293A30]">Learn and Build Your Skills</h3>
        <p className="text-xs text-[#687168] mt-0.5">
          Explore short learning experiences to support your wellbeing over time.
        </p>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {MODULES_DATA.map((module) => {
          const isDone = completedIds.includes(module.id);

          return (
            <div
              key={module.id}
              onClick={() => setActiveModule(module)}
              className={`p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between group ${
                isDone
                  ? 'bg-[#FDFCF9] border-[#E9EEE5] hover:border-[#58715B]'
                  : 'bg-white border-[#E9EEE5] hover:border-[#58715B] hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#58715B] px-2 py-0.5 rounded-md bg-[#E9EEE5]">
                    {module.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#687168]">
                    <Clock size={12} />
                    <span>{module.duration}</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-[#293A30] group-hover:text-[#58715B] transition-colors">
                  {module.title}
                </h4>
                <p className="text-xs text-[#687168] mt-1 leading-relaxed">
                  {module.subtitle}
                </p>

                {/* Learning Objectives Preview */}
                <div className="mt-2.5 pt-2 border-t border-[#F0F4EE] space-y-1">
                  {module.learningObjectives.slice(0, 2).map((obj, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#4F5B50]">
                      <span className="text-[#58715B] font-bold">&bull;</span>
                      <span className="line-clamp-1">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#E9EEE5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => handleToggle(module.id, e)}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold py-1 px-2 rounded-lg transition-colors ${
                    isDone ? 'text-[#58715B] bg-[#E9EEE5]' : 'text-[#687168] hover:bg-[#F7F5EF]'
                  }`}
                  title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 size={15} className="text-[#58715B]" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle size={15} />
                      <span>Mark done</span>
                    </>
                  )}
                </button>

                <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#58715B] group-hover:translate-x-0.5 transition-transform">
                  <span>{isDone ? 'Review' : 'Read'}</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reader Modal */}
      {activeModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6 shadow-xl border border-[#E9EEE5]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E9EEE5]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#58715B] px-2 py-0.5 rounded bg-[#E9EEE5]">
                  {activeModule.category} &bull; {activeModule.duration}
                </span>
                <h3 className="text-lg font-bold text-[#293A30] mt-1">
                  {activeModule.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModule(null)}
                className="p-1.5 text-[#687168] hover:text-[#293A30] hover:bg-[#F7F5EF] rounded-lg transition-colors"
                aria-label="Close module reader"
              >
                <X size={20} />
              </button>
            </div>

            {/* Learning Objectives */}
            <div className="my-4 p-3.5 rounded-xl bg-[#F4F7F2] border border-[#DCE4D6]">
              <h5 className="text-xs font-bold text-[#293A30] uppercase tracking-wider mb-2">
                What you will take away:
              </h5>
              <ul className="space-y-1.5 text-xs text-[#4F5B50]">
                {activeModule.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#58715B] font-bold">✓</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            <div className="space-y-5 my-4">
              {activeModule.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-sm font-bold text-[#293A30]">
                    {idx + 1}. {sec.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4F5B50] leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </p>
                  <div className="p-3 rounded-xl bg-[#F7F5EF] border-l-4 border-[#58715B] text-xs text-[#293A30] italic font-medium">
                    &ldquo;{sec.keyTakeaway}&rdquo;
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#E9EEE5] flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  handleToggle(activeModule.id, e);
                }}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl transition-colors ${
                  completedIds.includes(activeModule.id)
                    ? 'bg-[#E9EEE5] text-[#58715B]'
                    : 'bg-[#58715B] text-white hover:bg-[#485e4b]'
                }`}
              >
                {completedIds.includes(activeModule.id) ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Completed ✓</span>
                  </>
                ) : (
                  <span>Mark as Completed</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveModule(null)}
                className="px-4 py-2 text-xs font-semibold text-[#687168] hover:text-[#293A30] bg-[#F7F5EF] rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
