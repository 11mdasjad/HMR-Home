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
      viewBox="0 0 120 120"
      className={className}
      style={{ width: size, height: size }}
      fill="none"
    >
      {/* House Roof - Dark Navy Blue */}
      <path
        d="M60 8 L16 52 L26 52 L26 52 L60 18 L94 52 L104 52 Z"
        fill="#1B3A5C"
      />
      
      {/* House Body / Walls - Dark Navy */}
      <path
        d="M26 52 L26 90 L94 90 L94 52 L60 18 Z"
        fill="#1B3A5C"
      />

      {/* Inner house background - slightly lighter */}
      <path
        d="M32 56 L32 84 L88 84 L88 56 L60 28 Z"
        fill="#224B72"
      />

      {/* Wave 1 - Top wave (lighter blue) */}
      <path
        d="M36 50 Q44 42, 52 50 Q60 58, 68 50 Q76 42, 84 50"
        stroke="#5B9BD5"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Wave 2 - Middle wave */}
      <path
        d="M36 62 Q44 54, 52 62 Q60 70, 68 62 Q76 54, 84 62"
        stroke="#7AB8E0"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Wave 3 - Bottom wave (lightest blue) */}
      <path
        d="M36 73 Q44 65, 52 73 Q60 81, 68 73 Q76 65, 84 73"
        stroke="#A8D4F0"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* HMR Text */}
      <text
        x="60"
        y="108"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="24"
        fontWeight="900"
        fill="#1B3A5C"
        letterSpacing="3"
      >
        HMR
      </text>
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
