import React from 'react';

interface GuruICareLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const GuruICareLogo: React.FC<GuruICareLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  const iconSize = size === 'sm' ? 26 : size === 'lg' ? 44 : 34;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* User provided logo emblem */}
      <img
        src="/assets/aistudio/Screenshot_2026-10-29_at_11.25.50_PM_9346c3e9.png"
        alt="Guru iCare Logo"
        className="shrink-0 object-contain mix-blend-multiply"
        style={{ width: iconSize, height: iconSize }}
      />

      <div className="flex flex-col">
        <span className={`font-semibold tracking-tight text-dark-forest ${textSize} leading-none`}>
          Guru <span className="text-sage font-medium">iCare</span>
        </span>
        {showTagline && (
          <span className="text-[11px] text-muted-grey font-normal tracking-wide mt-0.5">
            Teacher wellbeing, one step at a time
          </span>
        )}
      </div>
    </div>
  );
};
