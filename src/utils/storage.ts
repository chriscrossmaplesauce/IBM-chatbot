import { MoodEntry, MoodType, JournalEntry, UserSettings, TriagePlan, WellbeingModule } from '../types';

const STORAGE_KEYS = {
  MOODS: 'guru_icare_moods',
  JOURNALS: 'guru_icare_journals',
  SETTINGS: 'guru_icare_settings',
  TRIAGE_PLAN: 'guru_icare_triage_plan',
  COMPLETED_MODULES: 'guru_icare_completed_modules',
  COMPLETED_TOOLS: 'guru_icare_completed_tools',
};

export const DEFAULT_SETTINGS: UserSettings = {
  preferredName: 'Cikgu',
  remindersEnabled: true,
  reminderTime: '16:30',
  reducedMotion: false,
  savedStrategies: [
    '80% Rule for marking routine exercises',
    '4-7-8 Breathing before parent conferences',
    '3-minute grounding after noisy afternoon lessons',
  ],
};

// Friendly initial sample data spanning the past 30 days so the 30-day trend chart is rich
const teacherNotes = [
  { dayOffset: 29, mood: 'okay', note: 'Start of term staff briefing and curriculum setup.' },
  { dayOffset: 27, mood: 'good', note: 'Welcomed students back; classroom icebreakers went well.' },
  { dayOffset: 25, mood: 'good', note: 'Interactive science lesson on plant biology.' },
  { dayOffset: 23, mood: 'stressed', note: 'Double period with energetic Year 7 class, feeling tired.' },
  { dayOffset: 21, mood: 'okay', note: 'Steady Thursday, completed lesson slides early.' },
  { dayOffset: 19, mood: 'great', note: 'Friday assembly was inspiring. Ready for weekend.' },
  { dayOffset: 16, mood: 'okay', note: 'Caught up on lesson plans over Sunday evening.' },
  { dayOffset: 14, mood: 'stressed', note: 'Parent inquiry regarding math midterm assessment.' },
  { dayOffset: 12, mood: 'low', note: 'Very heavy administrative paperwork deadline.' },
  { dayOffset: 10, mood: 'okay', note: 'Used 4-7-8 breathing before difficult parent call.' },
  { dayOffset: 8, mood: 'good', note: 'Students had a breakthrough on algebra problem.' },
  { dayOffset: 6, mood: 'okay', note: 'Standard staff meeting, managed to finish on time.' },
  { dayOffset: 4, mood: 'stressed', note: 'Marking 40 Year 8 essays before mid-term cutoff.' },
  { dayOffset: 3, mood: 'stressed', note: 'Late afternoon grading marathon at school.' },
  { dayOffset: 2, mood: 'good', note: 'Classroom science experiment went smoothly! Kids were engaged.' },
  { dayOffset: 1, mood: 'okay', note: 'Applied 80% rule to homework review. Left on time.' },
  { dayOffset: 0, mood: 'good', note: 'Morning check-in with Cara; feeling grounded.' },
];

export const INITIAL_MOOD_ENTRIES: MoodEntry[] = teacherNotes.map((item, idx) => {
  const ts = Date.now() - item.dayOffset * 24 * 60 * 60 * 1000;
  return {
    id: `m-init-${idx + 1}`,
    mood: item.mood as MoodType,
    note: item.note,
    timestamp: ts,
    dateStr: new Date(ts).toISOString().split('T')[0],
  };
});

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j-1',
    promptText: 'What is outside my control right now?',
    content:
      'The administrative syllabus change from the district is out of my hands. I can only control how gently I introduce it to my students tomorrow.',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'j-2',
    promptText: 'What would I say to a colleague facing the same situation?',
    content:
      'I would tell them: "You are one teacher doing your very best. It is okay if not every display board is perfect. Your students care most about your presence."',
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 24 * 60 * 60 * 1000,
  },
];

export function getStoredMoods(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MOODS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(INITIAL_MOOD_ENTRIES));
      return INITIAL_MOOD_ENTRIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOOD_ENTRIES;
  }
}

export function saveMoodEntry(entry: Omit<MoodEntry, 'id'>): MoodEntry {
  const existing = getStoredMoods();
  const newEntry: MoodEntry = {
    ...entry,
    id: 'm-' + Date.now(),
  };
  const updated = [newEntry, ...existing];
  localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(updated));
  return newEntry;
}

export function getStoredJournals(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(INITIAL_JOURNAL_ENTRIES));
      return INITIAL_JOURNAL_ENTRIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_JOURNAL_ENTRIES;
  }
}

export function saveJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string): JournalEntry {
  const existing = getStoredJournals();
  const now = Date.now();
  if (existingId) {
    const updated = existing.map((j) => (j.id === existingId ? { ...j, ...entry, updatedAt: now } : j));
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(updated));
    return updated.find((j) => j.id === existingId)!;
  } else {
    const newEntry: JournalEntry = {
      ...entry,
      id: 'j-' + now,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newEntry, ...existing];
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(updated));
    return newEntry;
  }
}

export function deleteJournalEntry(id: string): void {
  const existing = getStoredJournals();
  const updated = existing.filter((j) => j.id !== id);
  localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(updated));
}

export function getStoredSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getStoredTriagePlan(): TriagePlan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRIAGE_PLAN);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveTriagePlan(plan: TriagePlan): void {
  localStorage.setItem(STORAGE_KEYS.TRIAGE_PLAN, JSON.stringify(plan));
}

export function getCompletedModules(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_MODULES);
    return raw ? JSON.parse(raw) : ['mod-1'];
  } catch {
    return ['mod-1'];
  }
}

export function toggleModuleCompleted(moduleId: string): string[] {
  const completed = getCompletedModules();
  const next = completed.includes(moduleId)
    ? completed.filter((id) => id !== moduleId)
    : [...completed, moduleId];
  localStorage.setItem(STORAGE_KEYS.COMPLETED_MODULES, JSON.stringify(next));
  return next;
}

export function getCompletedToolsCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_TOOLS);
    return raw ? parseInt(raw, 10) : 3;
  } catch {
    return 3;
  }
}

export function incrementCompletedTools(): number {
  const current = getCompletedToolsCount() + 1;
  localStorage.setItem(STORAGE_KEYS.COMPLETED_TOOLS, current.toString());
  return current;
}

export function clearAllLocalData(): void {
  localStorage.clear();
}
