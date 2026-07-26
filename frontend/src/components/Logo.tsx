'use client';

import React from 'react';

interface LogoProps {
  showText?: boolean;
  textColor?: string;
  subColor?: string;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
}

export function LogoIcon({ className = 'w-10 h-10', size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 85"
      className={className}
      style={{ width: size, height: (size * 85) / 100 }}
      fill="none"
    >
      {/* Chimney */}
      <rect
        x="68"
        y="21"
        width="6"
        height="14"
        fill="currentColor"
        className="text-neutral-800"
      />
      
      {/* Roof */}
      <path
        d="M20 45 L50 18 L80 45"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-neutral-800"
      />
      
      {/* Amber Arch */}
      <path
        d="M38 33 A 12 12 0 0 1 62 33"
        stroke="#f59e0b" // Accent amber hex color
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* HMR Lettering - Geometric Overlay */}
      {/* H Left Column */}
      <path
        d="M31 38 L31 65"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        className="text-neutral-800"
      />
      {/* H Crossbar */}
      <path
        d="M31 51 L44 51"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        className="text-neutral-800"
      />
      
      {/* H Right Column / M Left Column */}
      <path
        d="M44 38 L44 65"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        className="text-neutral-800"
      />
      
      {/* M Center V */}
      <path
        d="M44 38 L50 49 L56 38"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-neutral-800"
      />
      
      {/* M Right Column / R Left Column */}
      <path
        d="M56 38 L56 65"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        className="text-neutral-800"
      />
      
      {/* R Loop */}
      <path
        d="M56 43 C64 43, 64 52, 56 52"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-neutral-800"
        fill="none"
      />
      
      {/* R Leg */}
      <path
        d="M56 52 L64 65"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        className="text-neutral-800"
      />
    </svg>
  );
}

export default function Logo({
  showText = true,
  textColor = 'text-neutral-800',
  subColor = 'text-neutral-400',
  size = 'md',
  layout = 'horizontal'
}: LogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  const iconPixelSizes = {
    sm: 32,
    md: 48,
    lg: 80
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const subSizes = {
    sm: 'text-[8px] tracking-wider',
    md: 'text-[10px] tracking-widest',
    lg: 'text-xs tracking-widest'
  };

  if (layout === 'vertical') {
    return (
      <div className="flex flex-col items-center text-center">
        <LogoIcon className={`${iconSizes[size]}`} size={iconPixelSizes[size]} />
        {showText && (
          <div className="mt-3">
            <h1 className={`${textSizes[size]} font-extrabold tracking-tight leading-none uppercase ${textColor}`}>
              HMR Hostel
            </h1>
            <p className={`${subSizes[size]} font-bold mt-1.5 uppercase ${subColor}`}>
              Your Home Away From Home
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <LogoIcon className={`${iconSizes[size]} flex-shrink-0`} size={iconPixelSizes[size]} />
      {showText && (
        <div className="flex flex-col justify-center">
          <h1 className={`${textSizes[size]} font-extrabold tracking-tight leading-none uppercase ${textColor}`}>
            HMR Hostel
          </h1>
          <p className={`${subSizes[size]} font-bold mt-1 uppercase ${subColor}`}>
            Your Home Away From Home
          </p>
        </div>
      )}
    </div>
  );
}
