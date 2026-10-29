import React, { useState } from 'react';
import { X, User, Bell, Shield, HeartHandshake, Eye, Sparkles, Check, Trash2, Download } from 'lucide-react';
import { UserSettings } from '../../types';
import { getStoredSettings, saveSettings, clearAllLocalData } from '../../utils/storage';
import { GuruICareLogo } from '../common/GuruICareLogo';
import { CaraAvatar } from '../common/CaraAvatar';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdated: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsUpdated,
}) => {
  const [settings, setSettingsState] = useState<UserSettings>(getStoredSettings());
  const [preferredName, setPreferredName] = useState(settings.preferredName);
  const [remindersEnabled, setRemindersEnabled] = useState(settings.remindersEnabled);
  const [reminderTime, setReminderTime] = useState(settings.reminderTime);
  const [reducedMotion, setReducedMotion] = useState(settings.reducedMotion);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'about'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: UserSettings = {
      ...settings,
      preferredName: preferredName.trim() || 'Cikgu',
      remindersEnabled,
      reminderTime,
      reducedMotion,
    };
    saveSettings(updated);
    setSettingsState(updated);
    setSavedSuccess(true);
    onSettingsUpdated();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-xl border border-[#E9EEE5]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E9EEE5]">
          <div className="flex items-center gap-2">
            <h2 id="settings-dialog-title" className="text-lg font-bold text-[#293A30]">
              Settings & Preferences
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#687168] hover:text-[#293A30] hover:bg-[#F7F5EF] rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="flex gap-1.5 my-4 p-1 bg-[#F7F5EF] rounded-xl overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'notifications', label: 'Reminders', icon: Bell },
            { id: 'privacy', label: 'Privacy', icon: Shield },
            { id: 'about', label: 'About', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-white text-[#58715B] shadow-2xs'
                    : 'text-[#687168] hover:text-[#293A30]'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#293A30] block mb-1">
                Preferred Name / Form of Address
              </label>
              <input
                type="text"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                placeholder="Cikgu, Sarah, etc."
                className="w-full text-xs p-2.5 rounded-xl bg-[#F7F5EF] border border-[#DCE4D6] focus:border-[#58715B] focus:bg-white focus:outline-none"
              />
              <p className="text-[11px] text-[#687168] mt-1">
                Defaults to &ldquo;Cikgu&rdquo;. Used throughout greetings and check-ins.
              </p>
            </div>

            <div className="pt-3 border-t border-[#E9EEE5]">
              <label className="text-xs font-bold text-[#293A30] block mb-2">
                Accessibility Preferences
              </label>
              <label className="flex items-center gap-2.5 text-xs text-[#4F5B50] cursor-pointer">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  className="rounded text-[#58715B] focus:ring-[#58715B]"
                />
                <span>Enable Reduced Motion (simplifies breathing circle animations)</span>
              </label>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F5EF] border border-[#E9EEE5]">
              <div>
                <span className="text-xs font-bold text-[#293A30] block">
                  Gentle Daily Check-in Reminder
                </span>
                <span className="text-[11px] text-[#687168]">
                  A quiet prompt to pause before heading home.
                </span>
              </div>
              <input
                type="checkbox"
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
                className="rounded text-[#58715B] focus:ring-[#58715B] scale-125"
              />
            </div>

            {remindersEnabled && (
              <div>
                <label className="text-xs font-bold text-[#293A30] block mb-1">
                  Preferred Reminder Time
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="text-xs p-2 rounded-xl bg-[#F7F5EF] border border-[#DCE4D6]"
                />
                <p className="text-[11px] text-[#687168] mt-1">
                  Typical school finish time: 4:30 PM.
                </p>
              </div>
            )}
          </div>
        )}

        {/* PRIVACY TAB */}
        {activeTab === 'privacy' && (
          <div className="space-y-3 text-xs text-[#4F5B50] leading-relaxed">
            <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#E9EEE5]">
              <strong className="text-[#293A30] block mb-1">Local Browser Data Storage</strong>
              <p>
                Guru iCare is built with privacy-first principles. Your mood check-ins and journal reflections are kept strictly inside your current browser session/localStorage. We do not transmit your personal notes to third-party advertising networks.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#E9EEE5]">
              <strong className="text-[#293A30] block mb-1">Responsible AI Transparency</strong>
              <p>
                Cara.ai operates with explicit safety guardrails. It never retains user identifiers and asks permission before suggesting actions.
              </p>
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E9EEE5]/70 border border-[#DCE4D6]">
              <CaraAvatar size="sm" />
              <div>
                <h4 className="text-xs font-bold text-[#293A30]">Guru iCare & Cara.ai</h4>
                <p className="text-[11px] text-[#687168]">
                  Teacher wellbeing, one step at a time.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#4F5B50] leading-relaxed">
              Designed specifically for elementary and secondary public school teachers experiencing assessment overwork, difficult parent interactions, and classroom fatigue.
            </p>

            <div className="text-[11px] text-[#687168] border-t border-[#E9EEE5] pt-2">
              Version 1.0 &bull; Built in alignment with the Teacher Wellbeing Framework.
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#E9EEE5] flex items-center justify-between">
          <span className="text-xs text-emerald-700 font-medium">
            {savedSuccess ? 'Settings saved ✓' : ''}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-[#687168] hover:text-[#293A30]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
