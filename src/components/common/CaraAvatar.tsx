import React from 'react';

interface CaraAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isSpeaking?: boolean;
}

export const CaraAvatar: React.FC<CaraAvatarProps> = ({
  size = 'md',
  className = '',
  isSpeaking = false,
}) => {
  const dimension = {
    xs: 28,
    sm: 36,
    md: 48,
    lg: 64,
    xl: 88,
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${
        isSpeaking ? 'animate-pulse' : ''
      } ${className}`}
      style={{ width: dimension, height: dimension }}
      aria-label="Cara.ai avatar"
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        {/* Organic soft pebble body shape matching screenshot */}
        <path
          d="M20 54C16 35 30 18 50 18C70 18 84 34 81 54C78 72 68 83 50 83C32 83 23 71 20 54Z"
          fill="#899F8E"
        />

        {/* Subtle highlight sheen */}
        <path
          d="M32 26C42 21 58 21 68 26"
          stroke="#9FBAA4"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Friendly eyes */}
        <circle cx="39" cy="48" r="3.2" fill="#243329" />
        <circle cx="61" cy="48" r="3.2" fill="#243329" />

        {/* Gentle curved smile */}
        <path
          d="M44 58C47 62 53 62 56 58"
          stroke="#243329"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Little coral/terracotta heart badge on cheek as seen in the prompt screenshot */}
        <path
          d="M68 64C68 61.8 65.8 60 63.8 61.2C62.8 61.8 62.4 62.8 62.4 62.8C62.4 62.8 62 61.8 61 61.2C59 60 56.8 61.8 56.8 64C56.8 66.8 62.4 71 62.4 71C62.4 71 68 66.8 68 64Z"
          fill="#DF7458"
        />
      </svg>
    </div>
  );
};
