'use client';

import * as React from 'react';

export type VeyraLogoSize = 'sm' | 'md' | 'lg';

interface VeyraLogoProps {
  size?: VeyraLogoSize;
  className?: string;
}

const SIZE_MAP: Record<VeyraLogoSize, number> = {
  sm: 24,
  md: 32,
  lg: 48,
};

export function VeyraLogo({ size = 'md', className }: VeyraLogoProps) {
  const dimension = SIZE_MAP[size];
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-label="VEYRA"
    >
      <defs>
        <linearGradient id="veyra-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4338ca" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="16" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="7" y="12" width="4" height="40" rx="2" fill="#4338ca" />
      <path
        d="M 12 52 L 32 18 L 52 52"
        stroke="url(#veyra-logo-grad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="32" cy="18" r="2.5" fill="#4338ca" />
      <g stroke="#c7c7d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 44 30 Q 46 26 48 30" />
        <path d="M 44 34 Q 46 28 48 34" />
        <path d="M 44 38 Q 46 32 48 38" />
      </g>
    </svg>
  );
}
