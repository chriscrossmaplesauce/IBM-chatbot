/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationTab, MoodType } from './types';
import { getStoredSettings } from './utils/storage';
import { AppHeader } from './components/navigation/AppHeader';
import { BottomNavigation } from './components/navigation/BottomNavigation';
import { HomeScreen } from './components/home/HomeScreen';
import { CaraChat } from './components/cara/CaraChat';
import { ToolsScreen } from './components/tools/ToolsScreen';
import { GetSupportScreen } from './components/support/GetSupportScreen';
import { MyWellbeingScreen } from './components/wellbeing/MyWellbeingScreen';
import { SettingsModal } from './components/settings/SettingsModal';
import { SafetyModal } from './components/safety/SafetyModal';
import { Home, MessageCircleHeart, Compass, HandHeart, HeartPulse } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [activeToolId, setActiveToolId] = useState<string | undefined>(undefined);
  const [selectedMoodForCara, setSelectedMoodForCara] = useState<MoodType | null>(null);

  const [settings, setSettings] = useState(getStoredSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);

  const handleSettingsUpdated = () => {
    setSettings(getStoredSettings());
  };

  const handleNavigate = (
    tab: NavigationTab,
    options?: { toolId?: string; selectedMood?: MoodType }
  ) => {
    setActiveTab(tab);
    if (options?.toolId) {
      setActiveToolId(options.toolId);
    }
    if (options?.selectedMood !== undefined) {
      setSelectedMoodForCara(options.selectedMood || null);
    }
    // Scroll to top on page switch
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const desktopNavItems = [
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
    { id: 'cara' as NavigationTab, label: 'Cara.ai', icon: MessageCircleHeart },
    { id: 'tools' as NavigationTab, label: 'Tools', icon: Compass },
    { id: 'support' as NavigationTab, label: 'Get Support', icon: HandHeart },
    { id: 'wellbeing' as NavigationTab, label: 'My Wellbeing', icon: HeartPulse },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#293A30] flex flex-col font-sans selection:bg-[#E9EEE5] selection:text-[#58715B]">
      {/* Top Header */}
      <AppHeader
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCrisis={() => handleNavigate('support')}
      />

      {/* Desktop Secondary Navigation Bar */}
      <div className="hidden md:block bg-white/80 border-b border-[#E9EEE5] sticky top-[57px] z-20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-1 py-1.5 px-4">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#E9EEE5] text-[#58715B]'
                    : 'text-[#687168] hover:text-[#293A30] hover:bg-[#F7F5EF]'
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.3 : 1.9} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-4 sm:py-6 max-w-4xl w-full mx-auto pb-24 md:pb-12">
        {activeTab === 'home' && (
          <HomeScreen
            preferredName={settings.preferredName || 'Cikgu'}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'cara' && (
          <CaraChat
            initialMood={selectedMoodForCara}
            preferredName={settings.preferredName || 'Cikgu'}
            onNavigate={handleNavigate}
            onOpenSafety={() => setIsSafetyOpen(true)}
          />
        )}

        {activeTab === 'tools' && (
          <ToolsScreen
            initialToolId={activeToolId}
          />
        )}

        {activeTab === 'support' && (
          <GetSupportScreen />
        )}

        {activeTab === 'wellbeing' && (
          <MyWellbeingScreen />
        )}
      </main>

      {/* Mobile Persistent Bottom Navigation */}
      <div className="md:hidden">
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={(tab) => handleNavigate(tab)}
        />
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsUpdated={handleSettingsUpdated}
      />

      <SafetyModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
        onNavigateToSupport={() => {
          setIsSafetyOpen(false);
          handleNavigate('support');
        }}
      />
    </div>
  );
}
