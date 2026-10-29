import React from 'react';
import { Wind, MessageCircleHeart, ArrowRight, Sparkles } from 'lucide-react';
import { NavigationTab } from '../../types';

interface QuickSupportShortcutsProps {
  onNavigate: (tab: NavigationTab, options?: { toolId?: string }) => void;
}

export const QuickSupportShortcuts: React.FC<QuickSupportShortcutsProps> = ({
  onNavigate,
}) => {
  return (
    <section className="mt-4" aria-labelledby="quick-help-heading">
      <h2 id="quick-help-heading" className="text-sm font-semibold text-[#687168] uppercase tracking-wider mb-2.5">
        What would help right now?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Quick Reset Card */}
        <button
          type="button"
          onClick={() => onNavigate('tools', { toolId: 'breathing' })}
          className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-[#E9EEE5] shadow-xs hover:border-[#58715B] hover:shadow-sm text-left transition-all duration-150 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58715B]"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E9EEE5] text-[#58715B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Wind size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#293A30] group-hover:text-[#58715B] transition-colors">
              Quick reset
            </h3>
            <p className="text-xs text-[#687168] mt-0.5">
              Try a short calming exercise.
            </p>
          </div>
          <ArrowRight size={18} className="text-[#687168] group-hover:text-[#58715B] group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>

        {/* Talk to Cara.ai Card */}
        <button
          type="button"
          onClick={() => onNavigate('cara')}
          className="flex items-center gap-3.5 p-4 bg-white rounded-2xl border border-[#E9EEE5] shadow-xs hover:border-[#58715B] hover:shadow-sm text-left transition-all duration-150 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58715B]"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E9EEE5] text-[#58715B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MessageCircleHeart size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#293A30] group-hover:text-[#58715B] transition-colors">
              Talk to Cara.ai
            </h3>
            <p className="text-xs text-[#687168] mt-0.5">
              Work through what's happening.
            </p>
          </div>
          <ArrowRight size={18} className="text-[#687168] group-hover:text-[#58715B] group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>
      </div>

      {/* Professional support link */}
      <div className="mt-3 text-center sm:text-left">
        <button
          type="button"
          onClick={() => onNavigate('support')}
          className="inline-flex items-center gap-1.5 text-xs text-[#58715B] hover:text-[#293A30] font-medium py-1 px-2 rounded-lg hover:bg-white transition-colors"
        >
          <span>Need to talk to someone? Explore support</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </section>
  );
};
