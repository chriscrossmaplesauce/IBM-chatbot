export type NavigationTab = 'home' | 'cara' | 'tools' | 'support' | 'wellbeing';

export type MoodType = 'low' | 'stressed' | 'okay' | 'good' | 'great';

export interface MoodOption {
  type: MoodType;
  label: string;
  emoji: string;
  description: string;
}

export interface MoodEntry {
  id: string;
  mood: MoodType;
  note?: string;
  timestamp: number;
  dateStr: string; // YYYY-MM-DD
}

export interface JournalEntry {
  id: string;
  promptText: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface GuidedToolRecommendation {
  category?: string; // e.g. "Guided Interactive Tool"
  title: string; // e.g. "5-4-3-2-1 Sensory Grounding"
  description?: string;
  toolId: string;
  targetTab?: NavigationTab;
  buttonLabel?: string;
}

export interface RelatedGuideRecommendation {
  title: string; // e.g. "Explore wellbeing strategies for this"
  subtitle?: string;
  moduleId?: string;
  targetTab?: NavigationTab;
}

export interface ChatMessage {
  id: string;
  sender: 'cara' | 'user';
  text: string;
  timestamp: number;
  timeFormatted?: string;
  senderLabel?: string; // e.g. "Haven • 23:05" or "Cara.ai • Guide & Coach"
  guidedTool?: GuidedToolRecommendation;
  relatedGuide?: RelatedGuideRecommendation;
  actionButton?: {
    label: string;
    action: string;
    targetTab?: NavigationTab;
    toolId?: string;
  };
  suggestedResponses?: string[];
}

export type TriageCategory = 'must-today' | 'can-wait' | 'simplify' | 'delegate';

export interface TriageTask {
  id: string;
  title: string;
  category: TriageCategory;
  deadline?: string;
  simplificationNote?: string;
}

export interface TriagePlan {
  firstTask: string;
  nextAction: string;
  whatCanWait: string[];
  simplifiedTasks: string[];
  breakPlan: string;
  createdAt: number;
}

export interface ModuleSection {
  title: string;
  content: string;
  keyTakeaway: string;
}

export interface WellbeingModule {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  completed: boolean;
  learningObjectives: string[];
  sections: ModuleSection[];
}

export interface UserSettings {
  preferredName: string;
  remindersEnabled: boolean;
  reminderTime: string;
  reducedMotion: boolean;
  savedStrategies: string[];
}

export interface ThoughtReframeData {
  situation: string;
  thought: string;
  emotions: string;
  evidence: string;
  balancedThought: string;
  nextStep: string;
  timestamp: number;
}
