import React from 'react';
import { Settings, ShieldAlert } from 'lucide-react';
import { GuruICareLogo } from '../common/GuruICareLogo';

interface AppHeaderProps {
  onOpenSettings: () => void;
  onOpenCrisis: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenSettings,
  onOpenCrisis,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F7F5EF]/95 backdrop-blur-sm border-b border-[#E9EEE5] px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <GuruICareLogo size="md" />

        <div className="flex items-center gap-2">
          {/* Quick crisis reassurance button */}
          <button
            onClick={onOpenCrisis}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#687168] bg-[#E9EEE5]/70 hover:bg-[#E9EEE5] rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58715B]"
            aria-label="Open 24/7 crisis support"
            title="Crisis helpline info"
          >
            <ShieldAlert size={14} className="text-[#DF7458]" />
            <span className="hidden sm:inline">24/7 Helpline</span>
            <span className="sm:hidden">Help</span>
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-[#687168] hover:text-[#293A30] hover:bg-white/80 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58715B]"
            aria-label="Open Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
