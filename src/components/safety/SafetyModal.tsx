import React from 'react';
import { X, ShieldAlert, Phone, HeartHandshake, Lock, Sparkles } from 'lucide-react';
import { CaraAvatar } from '../common/CaraAvatar';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSupport: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSupport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-xl border border-[#E9EEE5]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="safety-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E9EEE5]">
          <div className="flex items-center gap-2">
            <CaraAvatar size="xs" />
            <h2 id="safety-modal-title" className="text-base sm:text-lg font-bold text-[#293A30]">
              Safety, Privacy & AI Boundaries
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#687168] hover:text-[#293A30] hover:bg-[#F7F5EF] rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 my-4 text-xs sm:text-sm text-[#4F5B50] leading-relaxed">
          {/* Core Boundary Notice */}
          <div className="p-3.5 rounded-xl bg-[#F7F5EF] border border-[#E9EEE5]">
            <strong className="text-[#293A30] block text-xs uppercase tracking-wide mb-1">
              Cara.ai is an AI Support Guide, Not Therapy
            </strong>
            <p className="text-xs">
              Cara.ai is designed to provide immediate empathetic reflections, practical workload strategies (like the 80% rule), and grounding tools. It cannot diagnose mental health conditions, prescribe clinical treatments, or replace qualified psychological care.
            </p>
          </div>

          {/* Emergency Safety Protocol */}
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-950">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide text-red-900 mb-1">
              <ShieldAlert size={16} />
              <span>Immediate Distress or Emergency</span>
            </div>
            <p className="text-xs text-red-900/90 leading-relaxed">
              If you or someone you know is in immediate danger, having thoughts of self-harm, or experiencing a mental health emergency, please connect immediately with 24/7 human responders:
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <a
                href="tel:0376272929"
                className="px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-900 font-bold inline-flex items-center gap-1.5"
              >
                <Phone size={13} />
                <span>Befrienders: 03-7627 2929</span>
              </a>
              <a
                href="tel:15999"
                className="px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-900 font-bold inline-flex items-center gap-1.5"
              >
                <Phone size={13} />
                <span>Talian Kasih: 15999</span>
              </a>
            </div>
          </div>

          {/* Respect for Workload Reality */}
          <div className="p-3.5 rounded-xl bg-[#F4F7F2] border border-[#DCE4D6]">
            <strong className="text-[#293A30] block text-xs uppercase tracking-wide mb-1">
              No Toxic Positivity
            </strong>
            <p className="text-xs">
              Guru iCare acknowledges that many teacher stressors stem from systemic administrative and curriculum overload. We do not pretend that deep breathing alone cures unmanageable work conditions; our tools help you prioritize, set boundaries, and protect your energy.
            </p>
          </div>

          {/* Privacy & Data */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#E9EEE5] text-xs">
            <Lock size={16} className="text-[#58715B] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#293A30]">Your Data Remains Yours: </strong>
              Your mood entries and journal notes are stored strictly on your local browser. No personal health records are created or sold.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E9EEE5] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToSupport();
            }}
            className="text-xs font-semibold text-[#58715B] hover:underline"
          >
            Explore Professional Support Directory →
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl shadow-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
