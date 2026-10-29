import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Flame, Sliders, Trash2, Edit3, Plus, Save, X, Sparkles, HeartHandshake, CheckCircle2, Download, AlertCircle } from 'lucide-react';
import { MoodEntry, JournalEntry, UserSettings, MoodType } from '../../types';
import {
  getStoredMoods,
  getStoredJournals,
  saveJournalEntry,
  deleteJournalEntry,
  getStoredSettings,
  saveSettings,
  getCompletedModules,
  getCompletedToolsCount,
  clearAllLocalData,
} from '../../utils/storage';
import { MOOD_OPTIONS } from '../home/HomeCheckInCard';

const PROMPTS = [
  'What felt most demanding today?',
  'What went better than expected?',
  'What is one thing you handled well?',
  'What is outside my control right now?',
  'What can reasonably wait until tomorrow?',
  'What would I say to a colleague facing the same situation?',
];

export const MyWellbeingScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'moods' | 'journal' | 'progress' | 'preferences'>('moods');
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [settings, setSettingsState] = useState<UserSettings>(getStoredSettings());
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');

  // Journal Editor state
  const [isComposing, setIsComposing] = useState(false);
  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
  const [journalPrompt, setJournalPrompt] = useState(PROMPTS[0]);
  const [journalContent, setJournalContent] = useState('');

  // Preference input
  const [preferredNameInput, setPreferredNameInput] = useState(settings.preferredName);
  const [savedStrategies, setSavedStrategies] = useState<string[]>(settings.savedStrategies);
  const [newStrategyInput, setNewStrategyInput] = useState('');
  const [settingsSavedAlert, setSettingsSavedAlert] = useState(false);

  useEffect(() => {
    setMoods(getStoredMoods());
    setJournals(getStoredJournals());
    setSettingsState(getStoredSettings());
  }, [activeTab]);

  const filteredMoods = selectedMoodFilter === 'all'
    ? moods
    : moods.filter((m) => m.mood === selectedMoodFilter);

  const getMoodEmoji = (type: string) => {
    const found = MOOD_OPTIONS.find((m) => m.type === type);
    return found ? found.emoji : '😐';
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim()) return;

    saveJournalEntry(
      {
        promptText: journalPrompt,
        content: journalContent.trim(),
      },
      editingJournalId || undefined
    );

    setJournals(getStoredJournals());
    setIsComposing(false);
    setEditingJournalId(null);
    setJournalContent('');
  };

  const handleEditJournal = (j: JournalEntry) => {
    setEditingJournalId(j.id);
    setJournalPrompt(j.promptText);
    setJournalContent(j.content);
    setIsComposing(true);
  };

  const handleDeleteJournal = (id: string) => {
    if (confirm('Are you sure you wish to delete this private reflection?')) {
      deleteJournalEntry(id);
      setJournals(getStoredJournals());
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserSettings = {
      ...settings,
      preferredName: preferredNameInput.trim() || 'Cikgu',
      savedStrategies,
    };
    saveSettings(updated);
    setSettingsState(updated);
    setSettingsSavedAlert(true);
    setTimeout(() => setSettingsSavedAlert(false), 3000);
  };

  const handleAddStrategy = () => {
    if (!newStrategyInput.trim()) return;
    const next = [...savedStrategies, newStrategyInput.trim()];
    setSavedStrategies(next);
    setNewStrategyInput('');
  };

  const handleRemoveStrategy = (index: number) => {
    setSavedStrategies(savedStrategies.filter((_, i) => i !== index));
  };

  const handleExportData = () => {
    const allData = {
      guruICareExportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      moods,
      journals,
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guru-icare-wellbeing-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetAllData = () => {
    if (confirm('This will reset your local check-ins and journal entries to default. Proceed?')) {
      clearAllLocalData();
      setMoods(getStoredMoods());
      setJournals(getStoredJournals());
      setSettingsState(getStoredSettings());
    }
  };

  // Streak calculation (gentle, based on unique dates)
  const uniqueDatesCount = new Set(moods.map((m) => m.dateStr)).size;
  const completedModulesCount = getCompletedModules().length;
  const completedToolsCount = getCompletedToolsCount();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#293A30]">
          My Wellbeing
        </h1>
        <p className="text-sm text-[#687168] mt-1 leading-relaxed">
          A calm space to check in, reflect and notice what helps you at your own pace.
        </p>

        {/* 4 Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E9EEE5]">
          {[
            { id: 'moods', label: 'Mood History', icon: Calendar },
            { id: 'journal', label: 'Reflect & Journal', icon: BookOpen },
            { id: 'progress', label: 'Gentle Progress', icon: Flame },
            { id: 'preferences', label: 'Preferences & Data', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#58715B] text-white shadow-xs'
                    : 'bg-[#F7F5EF] text-[#687168] hover:text-[#293A30]'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB A: MOOD HISTORY */}
      {activeTab === 'moods' && (
        <section aria-labelledby="mood-history-heading" className="space-y-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 id="mood-history-heading" className="text-lg font-bold text-[#293A30]">
                  Mood History
                </h2>
                <p className="text-xs text-[#687168]">
                  Descriptive check-in entries across days. Not a diagnostic score.
                </p>
              </div>

              {/* Mood Filter */}
              <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
                {['all', 'low', 'stressed', 'okay', 'good', 'great'].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedMoodFilter(filter)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold capitalize transition-colors ${
                      selectedMoodFilter === filter
                        ? 'bg-[#58715B] text-white'
                        : 'bg-[#F7F5EF] text-[#687168] hover:text-[#293A30]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {filteredMoods.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#F7F5EF] border border-[#E9EEE5]">
                <HeartHandshake size={32} className="mx-auto text-[#58715B] mb-2 opacity-80" />
                <h3 className="text-sm font-bold text-[#293A30]">No check-ins recorded yet</h3>
                <p className="text-xs text-[#687168] max-w-sm mx-auto mt-1 leading-relaxed">
                  Your mood history will appear here when you choose to check in. You can start whenever you're ready.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredMoods.map((entry) => {
                  const date = new Date(entry.timestamp);
                  return (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#FDFCF9] border border-[#E9EEE5] hover:border-[#DCE4D6] transition-colors"
                    >
                      <span className="text-2xl select-none shrink-0" role="img" aria-label={entry.mood}>
                        {getMoodEmoji(entry.mood)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold capitalize text-[#293A30]">
                            {entry.mood}
                          </span>
                          <span className="text-[11px] text-[#687168]">
                            {date.toLocaleDateString('en-GB', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-xs text-[#4F5B50] mt-1 leading-relaxed">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB B: REFLECT & JOURNAL */}
      {activeTab === 'journal' && (
        <section aria-labelledby="journal-heading" className="space-y-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 id="journal-heading" className="text-lg font-bold text-[#293A30]">
                  Reflect & Journal
                </h2>
                <p className="text-xs text-[#687168]">
                  Private reflections saved only on your device. Separate from Cara.ai chats.
                </p>
              </div>

              {!isComposing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingJournalId(null);
                    setJournalPrompt(PROMPTS[0]);
                    setJournalContent('');
                    setIsComposing(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
                >
                  <Plus size={15} />
                  <span>New Reflection</span>
                </button>
              )}
            </div>

            {/* Reflection Composer Form */}
            {isComposing && (
              <form onSubmit={handleSaveJournal} className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#DCE4D6] mb-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#58715B] uppercase tracking-wider">
                    {editingJournalId ? 'Edit Reflection' : 'New Journal Prompt'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="p-1 text-[#687168] hover:text-[#293A30]"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#293A30] block mb-1">
                    Select a Prompt:
                  </label>
                  <select
                    value={journalPrompt}
                    onChange={(e) => setJournalPrompt(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-white border border-[#DCE4D6] focus:border-[#58715B] focus:outline-none"
                  >
                    {PROMPTS.map((p, idx) => (
                      <option key={idx} value={p}>{p}</option>
                    ))}
                    <option value="Freeform Entry">Freeform Thought / Free Writing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#293A30] block mb-1">
                    Your Words (Private):
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    placeholder="Write without editing yourself. This is your safe holding space..."
                    className="w-full text-xs sm:text-sm p-3 rounded-xl bg-white border border-[#DCE4D6] focus:border-[#58715B] focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="px-3 py-1.5 text-xs text-[#687168] hover:text-[#293A30]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl shadow-xs"
                  >
                    <Save size={14} />
                    <span>Save Reflection</span>
                  </button>
                </div>
              </form>
            )}

            {/* List of Journals */}
            {journals.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#F7F5EF] border border-[#E9EEE5]">
                <BookOpen size={28} className="mx-auto text-[#58715B] mb-2 opacity-80" />
                <h3 className="text-sm font-bold text-[#293A30]">Your journal is clear</h3>
                <p className="text-xs text-[#687168] max-w-sm mx-auto mt-1">
                  Writing down thoughts helps get them out of your head so you can rest. Click &ldquo;New Reflection&rdquo; to start.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {journals.map((journal) => (
                  <div
                    key={journal.id}
                    className="p-4 rounded-xl bg-[#FDFCF9] border border-[#E9EEE5] hover:border-[#DCE4D6] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-[#58715B]">
                        {journal.promptText}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditJournal(journal)}
                          className="p-1 text-[#687168] hover:text-[#293A30]"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteJournal(journal.id)}
                          className="p-1 text-[#687168] hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#293A30] whitespace-pre-wrap leading-relaxed">
                      {journal.content}
                    </p>
                    <div className="mt-2 text-[10px] text-[#687168]">
                      {new Date(journal.createdAt).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB C: GENTLE PROGRESS & STREAKS */}
      {activeTab === 'progress' && (
        <section aria-labelledby="progress-heading" className="space-y-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs">
            <h2 id="progress-heading" className="text-lg font-bold text-[#293A30]">
              Gentle Progress
            </h2>
            <p className="text-xs text-[#687168] mt-0.5">
              Notice small habits of care. No guilt if you skip days—rest is part of sustainability.
            </p>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#DCE4D6] text-center">
                <span className="text-2xl sm:text-3xl font-bold text-[#58715B]">{uniqueDatesCount}</span>
                <span className="text-xs text-[#4F5B50] block mt-1 font-medium">Check-in Days</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#DCE4D6] text-center">
                <span className="text-2xl sm:text-3xl font-bold text-[#58715B]">{moods.length}</span>
                <span className="text-xs text-[#4F5B50] block mt-1 font-medium">Total Check-ins</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#DCE4D6] text-center">
                <span className="text-2xl sm:text-3xl font-bold text-[#58715B]">{completedToolsCount}</span>
                <span className="text-xs text-[#4F5B50] block mt-1 font-medium">Exercises Completed</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F4F7F2] border border-[#DCE4D6] text-center">
                <span className="text-2xl sm:text-3xl font-bold text-[#58715B]">{completedModulesCount}</span>
                <span className="text-xs text-[#4F5B50] block mt-1 font-medium">Modules Read</span>
              </div>
            </div>

            {/* Saved Coping Strategies */}
            <div className="mt-6 pt-5 border-t border-[#E9EEE5]">
              <h3 className="text-sm font-bold text-[#293A30] mb-2 flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#58715B]" />
                <span>My Saved Coping Strategies:</span>
              </h3>
              <div className="space-y-2">
                {savedStrategies.map((strat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FDFCF9] border border-[#E9EEE5] text-xs text-[#4F5B50]"
                  >
                    <CheckCircle2 size={15} className="text-[#58715B] shrink-0" />
                    <span>{strat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB D: PREFERENCES & DATA */}
      {activeTab === 'preferences' && (
        <section aria-labelledby="preferences-heading" className="space-y-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs">
            <h2 id="preferences-heading" className="text-lg font-bold text-[#293A30]">
              My Preferences & Data Controls
            </h2>
            <p className="text-xs text-[#687168] mt-0.5">
              Customize how Guru iCare addresses you and manage your local data.
            </p>

            <form onSubmit={handleSavePreferences} className="space-y-4 mt-5">
              <div>
                <label className="text-xs font-bold text-[#293A30] block mb-1">
                  Preferred Form of Address:
                </label>
                <input
                  type="text"
                  value={preferredNameInput}
                  onChange={(e) => setPreferredNameInput(e.target.value)}
                  placeholder="e.g. Cikgu Sarah, Mr. Tan, or Cikgu"
                  className="w-full text-xs p-2.5 rounded-xl bg-[#F7F5EF] border border-[#DCE4D6] focus:border-[#58715B] focus:bg-white focus:outline-none"
                />
                <span className="text-[11px] text-[#687168] mt-1 block">
                  Cara.ai will greet you with this name on the Home card and during check-ins.
                </span>
              </div>

              {/* Manage Strategies */}
              <div className="pt-3 border-t border-[#E9EEE5]">
                <label className="text-xs font-bold text-[#293A30] block mb-1">
                  Personal Coping Strategies:
                </label>
                <div className="space-y-2 mb-2">
                  {savedStrategies.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#F7F5EF] text-xs text-[#293A30]">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStrategy(idx)}
                        className="text-[#687168] hover:text-red-600 p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newStrategyInput}
                    onChange={(e) => setNewStrategyInput(e.target.value)}
                    placeholder="Add a coping strategy..."
                    className="flex-1 text-xs p-2 rounded-xl bg-[#F7F5EF] border border-[#DCE4D6] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddStrategy}
                    className="px-3 py-2 bg-[#58715B] text-white text-xs font-semibold rounded-xl"
                  >
                    Add
                  </button>
                </div>
              </div>

              {settingsSavedAlert && (
                <div className="p-2 text-xs rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Preferences updated successfully!
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#58715B] hover:bg-[#485e4b] text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  Save Preferences
                </button>
              </div>
            </form>

            {/* Data Export and Reset */}
            <div className="mt-8 pt-6 border-t border-[#E9EEE5] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#687168]">
                Data Privacy & Local Storage
              </h3>
              <p className="text-xs text-[#687168] leading-relaxed">
                All demo data is stored locally in your browser’s storage. No personal notes are shared or transmitted to external advertisers.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#58715B] bg-[#E9EEE5] hover:bg-[#DCE4D6] rounded-xl transition-colors"
                >
                  <Download size={14} />
                  <span>Export My Data (JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetAllData}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
