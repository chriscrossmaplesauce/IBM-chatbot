import React, { useState, useEffect } from 'react';
import { Wind, Hand, Brain, Sparkles, SlidersHorizontal, BookOpen } from 'lucide-react';
import { GuidedBreathing } from './GuidedBreathing';
import { SensoryReset } from './SensoryReset';
import { ThoughtReframe } from './ThoughtReframe';
import { ProgressiveMuscleRelaxation } from './ProgressiveMuscleRelaxation';
import { WorkloadTriage } from './WorkloadTriage';
import { WellbeingModules } from './WellbeingModules';

interface ToolsScreenProps {
  initialToolId?: string;
}

export const ToolsScreen: React.FC<ToolsScreenProps> = ({ initialToolId }) => {
  const [selectedTool, setSelectedTool] = useState<'breathing' | 'sensory' | 'reframe' | 'muscle'>('breathing');
  const [activeTab, setActiveTab] = useState<'exercises' | 'triage' | 'modules'>('exercises');

  useEffect(() => {
    if (initialToolId) {
      if (initialToolId === 'triage') {
        setActiveTab('triage');
      } else if (initialToolId.startsWith('module')) {
        setActiveTab('modules');
      } else if (initialToolId === 'reframe') {
        setActiveTab('exercises');
        setSelectedTool('reframe');
      } else if (initialToolId === 'sensory') {
        setActiveTab('exercises');
        setSelectedTool('sensory');
      } else if (initialToolId === 'muscle') {
        setActiveTab('exercises');
        setSelectedTool('muscle');
      } else {
        setActiveTab('exercises');
        setSelectedTool('breathing');
      }
    }
  }, [initialToolId]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#293A30]">
          Tools for Your Wellbeing
        </h1>
        <p className="text-sm text-[#687168] mt-1 leading-relaxed">
          Small, practical steps to help you manage stress, restore focus and build skills over time.
        </p>

        {/* 3 Main Sections Navigation */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E9EEE5]">
          <button
            type="button"
            onClick={() => setActiveTab('exercises')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'exercises'
                ? 'bg-[#58715B] text-white shadow-xs'
                : 'bg-[#F7F5EF] text-[#687168] hover:text-[#293A30]'
            }`}
          >
            <Wind size={15} />
            <span>1. Wellbeing Tools</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('triage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'triage'
                ? 'bg-[#58715B] text-white shadow-xs'
                : 'bg-[#F7F5EF] text-[#687168] hover:text-[#293A30]'
            }`}
          >
            <SlidersHorizontal size={15} />
            <span>2. Workload Triage</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'modules'
                ? 'bg-[#58715B] text-white shadow-xs'
                : 'bg-[#F7F5EF] text-[#687168] hover:text-[#293A30]'
            }`}
          >
            <BookOpen size={15} />
            <span>3. Learning Modules</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: WELLBEING TOOLS */}
      {activeTab === 'exercises' && (
        <section aria-labelledby="section-wellbeing-tools" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="section-wellbeing-tools" className="text-lg font-bold text-[#293A30]">
                Section 1: Wellbeing Tools
              </h2>
              <p className="text-xs text-[#687168]">
                Evidence-informed strategies for the moment you're in.
              </p>
            </div>
          </div>

          {/* 4 Tool Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'breathing', label: 'Guided Breathing', icon: Wind, desc: 'Box & 4-7-8 pacing' },
              { id: 'sensory', label: 'Sensory Reset', icon: Hand, desc: '5-4-3-2-1 Grounding' },
              { id: 'reframe', label: 'Thought Reframe', icon: Brain, desc: 'CBT reflection wizard' },
              { id: 'muscle', label: 'Muscle Release', icon: Sparkles, desc: 'Progressive relaxation' },
            ].map((tool) => {
              const Icon = tool.icon;
              const isSelected = selectedTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setSelectedTool(tool.id as any)}
                  className={`p-3.5 rounded-2xl text-left border transition-all duration-150 ${
                    isSelected
                      ? 'bg-white border-[#58715B] shadow-sm ring-2 ring-[#58715B]'
                      : 'bg-white/90 border-[#E9EEE5] hover:bg-white hover:border-[#DCE4D6]'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                      isSelected ? 'bg-[#E9EEE5] text-[#58715B]' : 'bg-[#F7F5EF] text-[#687168]'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#293A30] line-clamp-1">
                    {tool.label}
                  </h3>
                  <p className="text-[11px] text-[#687168] mt-0.5 line-clamp-1">
                    {tool.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Tool Renderer */}
          <div className="mt-4">
            {selectedTool === 'breathing' && <GuidedBreathing />}
            {selectedTool === 'sensory' && <SensoryReset />}
            {selectedTool === 'reframe' && <ThoughtReframe />}
            {selectedTool === 'muscle' && <ProgressiveMuscleRelaxation />}
          </div>
        </section>
      )}

      {/* SECTION 2: WORKLOAD TRIAGE */}
      {activeTab === 'triage' && (
        <section aria-labelledby="section-workload-triage">
          <WorkloadTriage />
        </section>
      )}

      {/* SECTION 3: WELLBEING MODULES */}
      {activeTab === 'modules' && (
        <section aria-labelledby="section-wellbeing-modules">
          <WellbeingModules />
        </section>
      )}
    </div>
  );
};
