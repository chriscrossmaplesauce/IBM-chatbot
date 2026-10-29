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
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 40 : 32;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Handcrafted SVG matching the Guru iCare heart-sprout motif */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* Heart base with gentle sprout/flame contour */}
        <path
          d="M24 41C24 41 9 30.5 9 19.5C9 14.2533 13.2533 10 18.5 10C21.2 10 23.6 11.2 24 13C24.4 11.2 26.8 10 29.5 10C34.7467 10 39 14.2533 39 19.5C39 30.5 24 41 24 41Z"
          stroke="#58715B"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Inner gentle flame/sprout motif at top */}
        <path
          d="M24 7C22.8 10 21.5 13 24 16C26.5 13 25.2 10 24 7Z"
          fill="#58715B"
        />
      </svg>

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
