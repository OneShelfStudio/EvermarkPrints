import React from 'react'

interface EvermarkCrestProps {
  className?: string
  size?: number
}

export default function EvermarkCrest({ className = '', size = 42 }: EvermarkCrestProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Archival Heritage Shield / Medallion */}
      <circle cx="60" cy="60" r="56" fill="#FBF8F3" stroke="#1B3027" strokeWidth="2.5" />
      <circle
        cx="60"
        cy="60"
        r="51.5"
        fill="none"
        stroke="#D8AE64"
        strokeWidth="1"
        strokeDasharray="1.5, 2.5"
      />
      <circle cx="60" cy="60" r="47" fill="none" stroke="#1B3027" strokeWidth="0.75" opacity="0.6" />

      {/* Celestial Crown Star (Navigation & Memory) */}
      <path
        d="M60 16 L61.8 21.2 L67 23 L61.8 24.8 L60 30 L58.2 24.8 L53 23 L58.2 21.2 Z"
        fill="#D8AE64"
      />

      {/* Micro Hallmark Flanking Stars */}
      <circle cx="34" cy="27" r="1.2" fill="#D8AE64" />
      <circle cx="86" cy="27" r="1.2" fill="#D8AE64" />

      {/* Intertwined Monogram: Classical Roman E & P */}
      <g id="monogram">
        {/* Letter E */}
        <path d="M42 41 H66 V46 H49.5 V57 H62 V62 H49.5 V75 H68 V80 H42 Z" fill="#1B3027" />
        {/* Letter P Interlocking */}
        <path
          d="M57 41 H74 C82 41 87 46 87 53 C87 60 81 65 73 65 H64.5 V80 H57 Z M64.5 46 V60 H73 C78 60 80.5 57 80.5 53 C80.5 49 78 46 73 46 Z"
          fill="#9E472A"
          fillOpacity="0.95"
        />
      </g>

      {/* Base Hallmark Accent: Archival Ribbon / Diamond */}
      <path d="M60 97 L63.5 101 L60 105 L56.5 101 Z" fill="#D8AE64" />
      <text
        x="60"
        y="91"
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace, sans-serif"
        fontSize="6.5"
        fontWeight="600"
        letterSpacing="1.8"
        fill="#1B3027"
      >
        EST. 2026
      </text>
    </svg>
  )
}
