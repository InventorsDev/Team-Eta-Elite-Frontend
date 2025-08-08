// InlineSpinner.jsx
// A tiny, accessible inline spinner component styled with Tailwind CSS.
// Usage:
// <InlineSpinner size="sm" />
// <InlineSpinner size={20} color="#06b6d4" className="ml-2" />

import React from 'react';

/**
 * InlineSpinner
 * Props:
 * - size: 'xs' | 'sm' | 'md' | 'lg' | number (px)
 * - color: CSS color string (default: currentColor)
 * - className: additional wrapper classes
 * - ariaLabel: accessible label (default: "Loading")
 */
export default function InlineSpinner({
  size = 'sm',
  color = 'currentColor',
  className = '',
  ariaLabel = 'Loading',
}) {
  const sizeMap = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
  };

  const px = typeof size === 'number' ? size : (sizeMap[size] || sizeMap.sm);
  const stroke = Math.max(1, Math.round(px / 8));
  const viewBox = 24; // keep a consistent SVG viewBox

  return (
    <span
      className={`inline-flex items-center ${className}`}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${viewBox} ${viewBox}`}
        className="block"
        aria-hidden="true"
      >
        {/* faint ring */}
        <circle
          cx={viewBox / 2}
          cy={viewBox / 2}
          r={(viewBox / 2) - stroke}
          stroke="currentColor"
          strokeWidth={stroke}
          opacity="0.12"
          fill="none"
        />

        {/* rotating arc */}
        <g style={{ transformOrigin: 'center' }} className="animate-spin">
          <path
            d={`M ${viewBox / 2} ${stroke} A ${viewBox / 2 - stroke} ${viewBox / 2 - stroke} 0 0 1 ${viewBox - stroke} ${viewBox / 2}`}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
          />

          {/* small dot at the end of the arc to give that Vercel-like feel */}
          <circle
            cx={viewBox - stroke}
            cy={viewBox / 2}
            r={Math.max(1, stroke)}
            fill={color}
          />
        </g>
      </svg>

      {/* visually hidden text for screen readers when desired */}
      <span className="sr-only">{ariaLabel}</span>
    </span>
  );
}
