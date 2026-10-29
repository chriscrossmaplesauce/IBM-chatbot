import React, { useState, useEffect } from 'react';
import { HomeCheckInCard } from './HomeCheckInCard';
import { MoodTrackerPreview } from './MoodTrackerPreview';
import { QuickSupportShortcuts } from './QuickSupportShortcuts';
import { MoodEntry, MoodType, NavigationTab } from '../../types';
import { getStoredMoods, saveMoodEntry } from '../../utils/storage';

interface HomeScreenProps {
  preferredName: string;
  onNavigate: (tab: NavigationTab, options?: { toolId?: string; selectedMood?: MoodType }) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  preferredName,
  onNavigate,
}) => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);

  useEffect(() => {
    setMoods(getStoredMoods());
  }, []);

  const handleStartCheckIn = (selectedMood?: MoodType) => {
    if (selectedMood) {
      // Save entry to local mood history
      const saved = saveMoodEntry({
        mood: selectedMood,
        note: `Check-in initiated from Home screen`,
        timestamp: Date.now(),
        dateStr: new Date().toISOString().split('T')[0],
      });
      setMoods(getStoredMoods());
    }

    // Navigate to Cara.ai with the selected mood passed in
    onNavigate('cara', { selectedMood });
  };

  const handleViewMoodHistory = () => {
    onNavigate('wellbeing');
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-12">
      {/* 1. Cara.ai Welcome and Check-in card */}
      <HomeCheckInCard
        preferredName={preferredName}
        onStartCheckIn={handleStartCheckIn}
      />

      {/* 2. My Mood Tracker card */}
      <MoodTrackerPreview
        entries={moods}
        onViewHistory={handleViewMoodHistory}
      />

      {/* 3. Quick Support shortcuts */}
      <QuickSupportShortcuts
        onNavigate={onNavigate}
      />
    </div>
  );
};
