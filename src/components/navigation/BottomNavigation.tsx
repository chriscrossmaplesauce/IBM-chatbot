import React from 'react';
import { Home, MessageCircleHeart, Compass, HandHeart, HeartPulse } from 'lucide-react';
import { NavigationTab } from '../../types';

interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
    { id: 'cara' as NavigationTab, label: 'Cara.ai', icon: MessageCircleHeart },
    { id: 'tools' as NavigationTab, label: 'Tools', icon: Compass },
    { id: 'support' as NavigationTab, label: 'Get Support', icon: HandHeart },
    { id: 'wellbeing' as NavigationTab, label: 'My Wellbeing', icon: HeartPulse },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E9EEE5] shadow-sm safe-bottom pb-1"
      aria-label="Main Navigation"
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5 sm:max-w-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58715B] ${
                isActive
                  ? 'text-[#58715B] font-semibold'
                  : 'text-[#687168] hover:text-[#293A30]'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.label}
            >
              <div
                className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-[#E9EEE5] text-[#58715B]' : 'text-[#687168]'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.3 : 1.9} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
