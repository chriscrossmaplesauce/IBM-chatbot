import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, RotateCcw, Save, Sparkles, Clock, Coffee } from 'lucide-react';
import { TriageTask, TriageCategory, TriagePlan } from '../../types';
import { getStoredTriagePlan, saveTriagePlan, incrementCompletedTools } from '../../utils/storage';

const INITIAL_TEACHER_TASKS: TriageTask[] = [
  { id: 't-1', title: 'Grade 35 English diagnostic papers', category: 'simplify' },
  { id: 't-2', title: 'Print worksheets for tomorrow’s Year 8 math class', category: 'must-today' },
  { id: 't-3', title: 'Reply to long parent email regarding field trip schedule', category: 'can-wait' },
  { id: 't-4', title: 'Update term 2 administrative attendance register', category: 'delegate' },
];

export const WorkloadTriage: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [tasks, setTasks] = useState<TriageTask[]>(INITIAL_TEACHER_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [savedPlan, setSavedPlan] = useState<TriagePlan | null>(getStoredTriagePlan());
  const [planSavedNotice, setPlanSavedNotice] = useState(false);

  // Reflection responses in Step 3
  const [reflectionCore, setReflectionCore] = useState('Tomorrow’s math lesson is essential for learning; the diagnostic marking can be sample-graded.');
  const [reflectionBreak, setReflectionBreak] = useState('15-minute quiet tea break at 4:30 PM before leaving school.');

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: TriageTask = {
      id: 'task-' + Date.now(),
      title: newTaskTitle.trim(),
      category: 'must-today',
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const updateCategory = (id: string, category: TriageCategory) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, category } : t)));
  };

  const generatePlan = (): TriagePlan => {
    const mustToday = tasks.filter((t) => t.category === 'must-today');
    const simplified = tasks.filter((t) => t.category === 'simplify');
    const canWait = tasks.filter((t) => t.category === 'can-wait' || t.category === 'delegate');

    return {
      firstTask: mustToday[0]?.title || simplified[0]?.title || 'Prepare essential lesson materials',
      nextAction: mustToday.length > 1
        ? `Focus strictly on: ${mustToday.slice(1).map((t) => t.title).join(', ')}`
        : 'Once essential task is done, pack up without guilt.',
      whatCanWait: canWait.map((t) => t.title),
      simplifiedTasks: simplified.map((t) => `${t.title} (Apply 80% Rule: fit for purpose, not perfection)`),
      breakPlan: reflectionBreak,
      createdAt: Date.now(),
    };
  };

  const handleSavePlan = () => {
    const plan = generatePlan();
    saveTriagePlan(plan);
    setSavedPlan(plan);
    setPlanSavedNotice(true);
    incrementCompletedTools();
    setTimeout(() => setPlanSavedNotice(false), 3000);
  };

  const handleReset = () => {
    setTasks(INITIAL_TEACHER_TASKS);
    setStep(1);
    setPlanSavedNotice(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs">
      {/* Header */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E9EEE5] text-[#58715B] text-xs font-semibold mb-1.5">
          <Sparkles size={12} />
          <span>Workload Triage & 80% Rule</span>
        </div>
        <h3 className="text-xl font-bold text-[#293A30]">Workload Triage</h3>
        <p className="text-xs text-[#687168] mt-0.5">
          Make your workload more manageable, one decision at a time.
        </p>
      </div>

      {/* 80% Heuristic Banner */}
      <div className="p-3.5 rounded-xl bg-[#F4F7F2] border border-[#DCE4D6] mb-5 text-xs text-[#4F5B50] leading-relaxed">
        <strong className="text-[#293A30] font-semibold">The 80% Rule Heuristic: </strong>
        Aim for work that is <em>fit for purpose</em> rather than automatically pursuing perfection on every task. In teaching, 80% thoroughness delivers 100% of the educational value to students, while protecting your emotional stamina.
      </div>

      {/* Stepper Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E9EEE5] text-xs">
        <div className="flex items-center gap-2 font-semibold">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-[#58715B] text-white' : 'bg-[#E9EEE5] text-[#58715B]'}`}>1</span>
          <span className={step === 1 ? 'text-[#293A30]' : 'text-[#687168]'}>List</span>

          <span className="text-[#DCE4D6]">&bull;</span>

          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-[#58715B] text-white' : 'bg-[#E9EEE5] text-[#58715B]'}`}>2</span>
          <span className={step === 2 ? 'text-[#293A30]' : 'text-[#687168]'}>Categorise</span>

          <span className="text-[#DCE4D6]">&bull;</span>

          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-[#58715B] text-white' : 'bg-[#E9EEE5] text-[#58715B]'}`}>3</span>
          <span className={step === 3 ? 'text-[#293A30]' : 'text-[#687168]'}>Reflect</span>

          <span className="text-[#DCE4D6]">&bull;</span>

          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 4 ? 'bg-[#58715B] text-white' : 'bg-[#E9EEE5] text-[#58715B]'}`}>4</span>
          <span className={step === 4 ? 'text-[#293A30]' : 'text-[#687168]'}>Action Plan</span>
        </div>
        <span className="text-[#687168] text-[11px]">Step {step} of 4</span>
      </div>

      {/* Step 1: List Tasks */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xs text-[#687168]">
            What is crowding your mind right now? Add the marking, prep, administrative paperwork, or communications that feel urgent:
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="e.g., Mark 30 Year 10 biology quizzes..."
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#DCE4D6] focus:border-[#58715B] focus:outline-none"
            />
            <button
              type="button"
              onClick={addTask}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2 mt-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F7F5EF] border border-[#E9EEE5] text-xs text-[#293A30]"
              >
                <span className="font-medium">{task.title}</span>
                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  className="text-[#687168] hover:text-red-600 p-1"
                  title="Remove task"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={tasks.length === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-40"
            >
              <span>Next: Categorise Tasks</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Categorise */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-xs text-[#687168]">
            Not everything carries equal weight. Assign each task to a realistic category:
          </p>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl bg-[#F7F5EF] border border-[#E9EEE5]"
              >
                <p className="text-xs font-bold text-[#293A30] mb-2">{task.title}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'must-today' as TriageCategory, label: 'Must Do Today', color: 'bg-red-50 text-red-800 border-red-200' },
                    { id: 'can-wait' as TriageCategory, label: 'Important, Can Wait', color: 'bg-blue-50 text-blue-800 border-blue-200' },
                    { id: 'simplify' as TriageCategory, label: 'Can Simplify (80%)', color: 'bg-amber-50 text-amber-800 border-amber-200' },
                    { id: 'delegate' as TriageCategory, label: 'Postpone / Delegate', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                  ].map((cat) => {
                    const isSelected = task.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => updateCategory(task.id, cat.id)}
                        className={`text-[11px] p-2 rounded-lg font-medium border text-center transition-all ${
                          isSelected
                            ? `${cat.color} font-bold ring-2 ring-[#58715B]`
                            : 'bg-white text-[#687168] border-[#E9EEE5] hover:bg-[#F2F5F0]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-xs text-[#687168] hover:text-[#293A30] font-medium"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl shadow-xs"
            >
              <span>Next: Guiding Reflection</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Reflection */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-xs text-[#687168]">
            Pause and challenge common assumptions before writing the final plan:
          </p>

          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-[#F7F5EF] border border-[#E9EEE5]">
              <label className="text-xs font-bold text-[#293A30] block mb-1">
                What is essential for students’ learning or safety vs. what is good enough?
              </label>
              <textarea
                rows={2}
                value={reflectionCore}
                onChange={(e) => setReflectionCore(e.target.value)}
                className="w-full text-xs p-2.5 bg-white rounded-lg border border-[#DCE4D6] focus:border-[#58715B] focus:outline-none"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F5EF] border border-[#E9EEE5]">
              <label className="text-xs font-bold text-[#293A30] block mb-1">
                When will you take a recovery break and officially stop work today?
              </label>
              <input
                type="text"
                value={reflectionBreak}
                onChange={(e) => setReflectionBreak(e.target.value)}
                placeholder="e.g., Stop at 5:00 PM; no school emails checked at home."
                className="w-full text-xs p-2.5 bg-white rounded-lg border border-[#DCE4D6] focus:border-[#58715B] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1 text-xs text-[#687168] hover:text-[#293A30] font-medium"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl shadow-xs"
            >
              <span>Build Action Plan</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Simple Action Plan */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#E9EEE5]/80 border border-[#DCE4D6]">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} className="text-[#58715B]" />
              <h4 className="text-base font-bold text-[#293A30]">Your Realistic Action Plan</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#DCE4D6]">
                <span className="font-bold text-[#58715B] block text-[10px] uppercase">1. First Essential Task:</span>
                <p className="font-semibold text-[#293A30] text-sm mt-0.5">
                  {tasks.find((t) => t.category === 'must-today')?.title || 'No urgent tasks remain for today!'}
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#DCE4D6]">
                <span className="font-bold text-amber-700 block text-[10px] uppercase">2. Tasks to Simplify with 80% Rule:</span>
                <ul className="list-disc pl-4 mt-1 text-[#4F5B50] space-y-1">
                  {tasks.filter((t) => t.category === 'simplify').length > 0 ? (
                    tasks
                      .filter((t) => t.category === 'simplify')
                      .map((t) => <li key={t.id}>{t.title} (Target: fit for purpose, not perfection)</li>)
                  ) : (
                    <li className="italic text-[#687168]">None marked to simplify</li>
                  )}
                </ul>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#DCE4D6]">
                <span className="font-bold text-[#687168] block text-[10px] uppercase">3. What Can Wait or Be Postponed:</span>
                <ul className="list-disc pl-4 mt-1 text-[#687168] space-y-1">
                  {tasks.filter((t) => t.category === 'can-wait' || t.category === 'delegate').length > 0 ? (
                    tasks
                      .filter((t) => t.category === 'can-wait' || t.category === 'delegate')
                      .map((t) => <li key={t.id}>{t.title}</li>)
                  ) : (
                    <li className="italic text-[#687168]">Everything prioritized</li>
                  )}
                </ul>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#DCE4D6] flex items-center gap-2 text-[#293A30]">
                <Coffee size={16} className="text-[#58715B] shrink-0" />
                <div>
                  <span className="font-bold text-[10px] uppercase block text-[#58715B]">Break / Boundary Commitment:</span>
                  <p className="font-medium">{reflectionBreak}</p>
                </div>
              </div>
            </div>
          </div>

          {planSavedNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold text-center border border-emerald-200">
              Plan saved successfully to your offline storage!
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#687168] hover:text-[#293A30] bg-[#F7F5EF] rounded-xl transition-colors"
            >
              <RotateCcw size={14} />
              <span>Start Over</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-3 py-2 text-xs text-[#687168] hover:text-[#293A30] font-medium"
              >
                Edit Categories
              </button>
              <button
                type="button"
                onClick={handleSavePlan}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Save size={14} />
                <span>Save Action Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
