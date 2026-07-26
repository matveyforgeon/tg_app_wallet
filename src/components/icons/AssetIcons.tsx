import type { ReactNode } from 'react';

/**
 * Asset marks — one vector icon per catalog entry, no text glyphs and no
 * monograms.
 *
 * Every mark is drawn on the same 24x24 grid with the same 1.7 stroke weight,
 * round caps and joins, and renders at a fixed 20x20 box, so icons are
 * optically consistent wherever they appear (list rows, chips, pickers). Chips
 * scale the same SVG down via CSS.
 *
 * The marks are deliberately abstract geometry, not brand logos — the same
 * decision the mockup made ("abstract/generic, not brand logos"). Colour comes
 * from each catalog entry's gradient behind the icon, never from the icon.
 */

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function Mark({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...STROKE} aria-hidden="true">
      {children}
    </svg>
  );
}

const ASSET_ICONS: Record<string, () => React.JSX.Element> = {
  // --- native + wrapped majors ----------------------------------------------
  GRAM: () => (
    <Mark>
      <path d="M12 3.5 19 8v8l-7 4.5L5 16V8z" />
      <path d="M8.6 9.6 12 16.2l3.4-6.6" />
    </Mark>
  ),
  USDT: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.4 8.8h7.2M12 8.8v7" />
    </Mark>
  ),
  'jUSDC': () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M14.9 9.3a3.7 3.7 0 100 5.4" />
    </Mark>
  ),
  // --- liquid staking -------------------------------------------------------
  'tsTON': () => (
    <Mark>
      <path d="M12 3.6 19 8.1v7.8L12 20.4 5 15.9V8.1z" />
      <path d="M8.4 10.2h7.2M12 10.2v6" />
    </Mark>
  ),
  'stTON': () => (
    <Mark>
      <path d="M12 3.6 19 8.1v7.8L12 20.4 5 15.9V8.1z" />
      <path d="M14.6 9.8a3 3 0 10-2.6 4.4 3 3 0 11-2.6 4.4" />
    </Mark>
  ),
  'hTON': () => (
    <Mark>
      <path d="M12 3.6 19 8.1v7.8L12 20.4 5 15.9V8.1z" />
      <path d="M9.4 8.8v6.4M14.6 8.8v6.4M9.4 12h5.2" />
    </Mark>
  ),
  // --- DeFi & infrastructure ------------------------------------------------
  STON: () => (
    <Mark>
      <path d="M4.4 15.6 9 6.2l3 6 3-4 4.6 7.4z" />
      <circle cx="12" cy="19" r="1.4" />
    </Mark>
  ),
  DUST: () => (
    <Mark>
      <circle cx="8.4" cy="10" r="2.4" />
      <circle cx="15.2" cy="8.6" r="1.7" />
      <circle cx="12.6" cy="15.4" r="3.1" />
    </Mark>
  ),
  STORM: () => (
    <Mark>
      <path d="M13.2 3.6 6.6 13.4h4.6l-1.2 7 7.4-10.4h-4.4z" />
    </Mark>
  ),
  EVAA: () => (
    <Mark>
      <path d="M17 5.2H8.8L5.4 12l3.4 6.8H17" />
      <path d="M9.4 12h5.6" />
      <circle cx="18.2" cy="12" r="1.4" />
    </Mark>
  ),
  GRM: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M15.6 9.4a4.2 4.2 0 10.4 4.6H12" />
    </Mark>
  ),
  GOMINING: () => (
    <Mark>
      <path d="M5 18.4 11 6.6l2 4 2.4-3 3.6 10.8z" />
      <path d="M9.2 12.4h3.6" />
    </Mark>
  ),
  DUCK: () => (
    <Mark>
      <path d="M14.6 6.6a2.6 2.6 0 11-3.6 2.4c0 3.6-2.6 5.4-5.6 5.4 1.4 3 4.4 4.4 7.6 4.4 3.8 0 6.4-2.6 6.4-6.2V8.2z" />
      <path d="M15.6 7.4h.01" />
    </Mark>
  ),
  // --- games & community -----------------------------------------------------
  NOT: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M9.2 16V8l5.6 8V8" />
    </Mark>
  ),
  DOGS: () => (
    <Mark>
      <ellipse cx="12" cy="15.6" rx="4.4" ry="3.6" />
      <circle cx="6.8" cy="10.8" r="1.9" />
      <circle cx="10.4" cy="8" r="1.9" />
      <circle cx="14.6" cy="8.3" r="1.9" />
      <circle cx="17.5" cy="11.6" r="1.9" />
    </Mark>
  ),
  HMSTR: () => (
    <Mark>
      <circle cx="12" cy="13.4" r="5.8" />
      <circle cx="6.9" cy="7.9" r="2.4" />
      <circle cx="17.1" cy="7.9" r="2.4" />
      <path d="M10.2 13h.01M13.8 13h.01" />
    </Mark>
  ),
  CATI: () => (
    <Mark>
      <path d="M6.4 9.2 5.9 5l3.9 2.5M17.6 9.2l.5-4.2-3.9 2.5" />
      <ellipse cx="12" cy="13.6" rx="5.8" ry="5.2" />
      <path d="M9.7 16.2h4.6" />
    </Mark>
  ),
  MAJOR: () => (
    <Mark>
      <circle cx="12" cy="9.4" r="5.4" />
      <path d="M8.5 13.8 6.9 20.4 12 17.8l5.1 2.6-1.6-6.6" />
    </Mark>
  ),
  BLUM: () => (
    <Mark>
      <path d="M12 3.8c3.8 4.6 6 7.4 6 10.1a6 6 0 11-12 0c0-2.7 2.2-5.5 6-10.1z" />
      <path d="M9.6 14.6a2.6 2.6 0 002.6 2.6" />
    </Mark>
  ),
  CATS: () => (
    <Mark>
      <path d="M6.4 9.4 5.9 5.2l3.9 2.5M17.6 9.4l.5-4.2-3.9 2.5" />
      <ellipse cx="12" cy="13.8" rx="5.8" ry="5.2" />
      <path d="M9.7 13h.01M14.3 13h.01M12 15.4v1.6" />
    </Mark>
  ),
  GOATS: () => (
    <Mark>
      <path d="M6.6 8.8 5.4 4.8l4 2.4M17.4 8.8l1.2-4-4 2.4" />
      <ellipse cx="12" cy="14" rx="5.4" ry="5" />
      <path d="M9.8 12.8h.01M14.2 12.8h.01" />
    </Mark>
  ),
  REDO: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M9.4 16.2V7.8h3.2a2.6 2.6 0 010 5.2H9.4l4.2 3.2" />
    </Mark>
  ),
  WIF: () => (
    <Mark>
      <circle cx="12" cy="14.4" r="5.2" />
      <path d="M6.2 9.4c2.2-3.6 9.4-3.6 11.6 0" />
      <path d="M4.6 9.4h14.8" />
    </Mark>
  ),
  JETTON: () => (
    <Mark>
      <rect x="4.4" y="4.4" width="15.2" height="15.2" rx="4" />
      <path d="M14.6 8.2v5.6a2.8 2.8 0 11-2.8-2.8" />
    </Mark>
  ),
  PUNK: () => (
    <Mark>
      <path d="M6.4 19v-7a5.6 5.6 0 0111.2 0v7" />
      <path d="M6.4 9.6 12 4l5.6 5.6" />
      <path d="M9.8 12.6h.01M14.2 12.6h.01" />
    </Mark>
  ),
  ANON: () => (
    <Mark>
      <path d="M6 10.4c1.6-1.4 4-1.4 5.4 0M12.6 10.4c1.4-1.4 3.8-1.4 5.4 0" />
      <path d="M4.6 8.6C6.6 5 9 4 12 4s5.4 1 7.4 4.6" />
      <path d="M7.4 14c1.2 3.4 3 5.4 4.6 5.4s3.4-2 4.6-5.4" />
    </Mark>
  ),
  ARBUZ: () => (
    <Mark>
      <path d="M4.4 6.6A10.6 10.6 0 0017.4 19.6z" />
      <path d="M6.2 8.4a8 8 0 009.4 9.4" />
      <path d="M8.8 11.4h.01M11.4 14h.01M8 14.8h.01" />
    </Mark>
  ),
  BOLT: () => (
    <Mark>
      <path d="M13.2 3.6 6.6 13.4h4.6l-1.2 7 7.4-10.4h-4.4z" />
    </Mark>
  ),
  GEMSTON: () => (
    <Mark>
      <path d="M8 4.4h8l3.4 4.6L12 19.6 4.6 9z" />
      <path d="M4.6 9h14.8M8 4.4 12 19.6 16 4.4" />
    </Mark>
  ),
  WEB3: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M5.6 9.4 8.4 15l3.6-5.6L15.6 15l2.8-5.6" />
    </Mark>
  ),
  ART: () => (
    <Mark>
      <path d="M12 3.6l2 5.6 5.6 2-5.6 2-2 5.6-2-5.6-5.6-2 5.6-2z" />
    </Mark>
  ),
};

/**
 * Last-resort mark for a catalog entry that has no icon yet. Every shipped
 * asset has one, so this only guards against a future addition slipping
 * through — it keeps the same 24x24 grid and 20x20 box as the rest.
 */
function FallbackMark() {
  return (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </Mark>
  );
}

export function AssetIcon({ code }: { code: string }) {
  const Icon = ASSET_ICONS[code] ?? FallbackMark;
  return <Icon />;
}
