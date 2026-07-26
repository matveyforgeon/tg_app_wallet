/**
 * Card action glyphs and the EMV chip.
 *
 * Line icons matching the tab bar's style — no emoji anywhere (spec §3).
 */

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function FreezeIcon() {
  return (
    <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
      <path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12M2 12h20" />
    </svg>
  );
}

export function UnfreezeIcon() {
  return (
    <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 018 0" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13" />
    </svg>
  );
}

export function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
      <path d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 4.24A10.94 10.94 0 0112 4c6.5 0 10 7 10 7a13.16 13.16 0 01-3.22 4.06M6.1 6.1A13.16 13.16 0 002 11s3.5 7 10 7a10.94 10.94 0 004.9-1.14" />
    </svg>
  );
}

/**
 * EMV chip: a gold gradient plate with the contact divider lines, not a flat
 * yellow rectangle (spec §3).
 */
export function CardChip() {
  return (
    <svg viewBox="0 0 34 24" aria-hidden="true">
      <defs>
        <linearGradient id="chipGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4e8c4" />
          <stop offset="50%" stopColor="#d8bb6e" />
          <stop offset="100%" stopColor="#a9853c" />
        </linearGradient>
      </defs>
      <rect
        x="0.5"
        y="0.5"
        width="33"
        height="23"
        rx="4"
        fill="url(#chipGrad)"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="0.6"
      />
      <path
        d="M11 0.5V23.5M23 0.5V23.5M0.5 8H11M23 8H33.5M0.5 16H11M23 16H33.5M11 8H23V16H11Z"
        stroke="rgba(80,60,10,0.45)"
        strokeWidth="0.7"
        fill="none"
      />
    </svg>
  );
}
