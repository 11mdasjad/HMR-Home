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
      viewBox="0 0 200 220"
      className={className}
      style={{ width: size, height: (size * 220) / 200 }}
      fill="none"
    >
      {/* Chimney */}
      <rect
        x="138"
        y="28"
        width="14"
        height="32"
        rx="2"
        fill="#1B3A5C"
      />
      
      {/* Roof - outer triangle with overhang */}
      <path
        d="M100 12 L18 90 L36 90 L36 160 L164 160 L164 90 L182 90 Z"
        fill="#1B3A5C"
      />
      
      {/* Inner cutout - house interior (white background) */}
      <path
        d="M100 38 L48 90 L48 148 L152 148 L152 90 Z"
        fill="white"
      />

      {/* Wave 1 - upper wave (medium blue) */}
      <path
        d="M56 100 C72 84, 88 84, 100 100 C112 116, 128 116, 144 100"
        stroke="#3B7DC0"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Wave 2 - lower wave (lighter blue) */}
      <path
        d="M56 122 C72 106, 88 106, 100 122 C112 138, 128 138, 144 122"
        stroke="#6AAAD4"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* HMR Text */}
      <text
        x="100"
        y="205"
        textAnchor="middle"
        fontFamily="Arial Black, Arial, Helvetica, sans-serif"
        fontSize="48"
        fontWeight="900"
        fill="#1B3A5C"
        letterSpacing="6"
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
