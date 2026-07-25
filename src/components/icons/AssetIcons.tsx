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
  // --- majors ---------------------------------------------------------------
  TON: () => (
    <Mark>
      <path d="M12 3.5 19 8v8l-7 4.5L5 16V8z" />
      <path d="M8.6 9.6 12 16.2l3.4-6.6" />
    </Mark>
  ),
  BTC: () => (
    <Mark>
      <path d="M8 6.6h5.4a2.7 2.7 0 010 5.4H8zM8 12h5.8a2.7 2.7 0 010 5.4H8zM8 6.6v10.8" />
      <path d="M10.4 4.4v2.2M13.6 4.4v2.2M10.4 17.4v2.2M13.6 17.4v2.2" />
    </Mark>
  ),
  ETH: () => (
    <Mark>
      <path d="M12 3.4 17.4 12 12 15.2 6.6 12z" />
      <path d="M6.8 13.7 12 20.6l5.2-6.9L12 16.9z" />
    </Mark>
  ),
  XRP: () => (
    <Mark>
      <path d="M5.8 5.4 12 11.2l6.2-5.8M5.8 18.6 12 12.8l6.2 5.8" />
    </Mark>
  ),
  ADA: () => (
    <Mark>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="4.9" r="1.3" />
      <circle cx="12" cy="19.1" r="1.3" />
      <circle cx="5.9" cy="8.5" r="1.3" />
      <circle cx="18.1" cy="8.5" r="1.3" />
      <circle cx="5.9" cy="15.5" r="1.3" />
      <circle cx="18.1" cy="15.5" r="1.3" />
    </Mark>
  ),
  SOL: () => (
    <Mark>
      <path d="M5.6 8.4 8.2 5.9h10.2l-2.6 2.5z" />
      <path d="M18.4 12.2 15.8 14.7H5.6l2.6-2.5z" />
      <path d="M5.6 18.1 8.2 15.6h10.2l-2.6 2.5z" />
    </Mark>
  ),
  LTC: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M13.4 6.6 11.1 15.4h5.4" />
      <path d="M8 12.6l4.2-1.5" />
    </Mark>
  ),
  BCH: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M9.6 8.2h3.2a2 2 0 010 4H9.6zM9.6 12.2h3.6a2 2 0 010 4H9.6z" />
      <path d="M11.4 6.2v2M11.4 16.2v2" />
    </Mark>
  ),
  XMR: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M7 15.4V9l5 5.2L17 9v6.4" />
    </Mark>
  ),
  ETC: () => (
    <Mark>
      <path d="M12 3.6 17 12l-5 3-5-3z" />
      <path d="M7.2 13.8 12 20.4l4.8-6.6" />
      <path d="M4.6 12h2M17.4 12h2" />
    </Mark>
  ),
  DOT: () => (
    <Mark>
      <ellipse cx="12" cy="5.6" rx="3" ry="1.9" />
      <ellipse cx="12" cy="18.4" rx="3" ry="1.9" />
      <ellipse cx="6.4" cy="8.8" rx="1.9" ry="3" />
      <ellipse cx="17.6" cy="15.2" rx="1.9" ry="3" />
      <ellipse cx="6.4" cy="15.2" rx="1.9" ry="3" />
      <ellipse cx="17.6" cy="8.8" rx="1.9" ry="3" />
    </Mark>
  ),
  AVAX: () => (
    <Mark>
      <path d="M12 4.4 20.6 19H3.4z" />
      <path d="M9.4 19 12 14.4 14.6 19z" />
    </Mark>
  ),
  ATOM: () => (
    <Mark>
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="8.6" ry="3.5" />
      <ellipse cx="12" cy="12" rx="8.6" ry="3.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="8.6" ry="3.5" transform="rotate(120 12 12)" />
    </Mark>
  ),
  NEAR: () => (
    <Mark>
      <rect x="4.4" y="4.4" width="15.2" height="15.2" rx="3.4" />
      <path d="M8.6 16.2V8.4l6.8 7.2V7.8" />
    </Mark>
  ),
  APT: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M4.4 9.6h6.2l1.6-1.9 1.6 1.9h5.8" />
      <path d="M4.4 14.4h6.2l1.6 1.9 1.6-1.9h5.8" />
    </Mark>
  ),
  SUI: () => (
    <Mark>
      <path d="M12 3.6c3.8 4.7 6 7.5 6 10.2a6 6 0 11-12 0c0-2.7 2.2-5.5 6-10.2z" />
    </Mark>
  ),
  XLM: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M4.8 14.8 19.2 8" />
      <path d="M9.4 5.6 4.8 7.8v3.6M14.6 18.4l4.6-2.2v-3.6" />
    </Mark>
  ),
  ALGO: () => (
    <Mark>
      <path d="M5 19 12.2 5.2l1.6 3.2M8.4 19l4.4-8.8L18.4 19" />
    </Mark>
  ),
  HBAR: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M9 7.8v8.4M15 7.8v8.4M9 10.8h6M9 13.2h6" />
    </Mark>
  ),
  VET: () => (
    <Mark>
      <path d="M4.4 6.4 12 18.6l7.6-12.2" />
      <path d="M9 6.4 12 11.6l3-5.2" />
    </Mark>
  ),
  KAS: () => (
    <Mark>
      <path d="M7 5.4v13.2M7 12l6.4-6.6M7 12l6.4 6.6" />
      <circle cx="17.4" cy="12" r="1.7" />
    </Mark>
  ),
  ICP: () => (
    <Mark>
      <path d="M8.2 9.2c-1.9 0-3.4 1.3-3.4 2.8s1.5 2.8 3.4 2.8c2.8 0 4.2-5.6 7.6-5.6 1.9 0 3.4 1.3 3.4 2.8s-1.5 2.8-3.4 2.8c-2.8 0-4.2-5.6-7.6-5.6z" />
    </Mark>
  ),
  FIL: () => (
    <Mark>
      <path d="M12 3.6 19.4 12 12 20.4 4.6 12z" />
      <path d="M9.6 15.6V8.8h4.8M9.6 12.3h3.8" />
    </Mark>
  ),
  TIA: () => (
    <Mark>
      <path d="M12 3.8 20 8l-8 4.2L4 8z" />
      <path d="M4 12.2 12 16.4l8-4.2" />
      <path d="M4 16.2 12 20.4l8-4.2" />
    </Mark>
  ),
  SEI: () => (
    <Mark>
      <path d="M17.4 7.4c-2.4-2-6.4-1.7-8.3.7-1.6 2-1 4.6 1.2 5.6 2.6 1.2 5.6-.4 5.6 2 0 2-2.6 3.2-5.1 2.4" />
    </Mark>
  ),
  INJ: () => (
    <Mark>
      <path d="M6 17V9.4a3 3 0 016 0v5.2a3 3 0 006 0V7" />
    </Mark>
  ),
  // --- L2 & DeFi ------------------------------------------------------------
  ARB: () => (
    <Mark>
      <path d="M12 3.6 19.8 8v8L12 20.4 4.2 16V8z" />
      <path d="M9.6 15.6 12.4 8.8l2.8 6.8M10.8 13.6h3.2" />
    </Mark>
  ),
  OP: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <circle cx="9.6" cy="12" r="2.2" />
      <path d="M13.8 15.4V9h2.2a1.9 1.9 0 010 3.8h-2.2" />
    </Mark>
  ),
  POL: () => (
    <Mark>
      <path d="M9.6 5.6 12 4.2l2.4 1.4v2.8L12 9.8 9.6 8.4z" />
      <path d="M4.4 13 6.8 11.6 9.2 13v2.8l-2.4 1.4-2.4-1.4z" />
      <path d="M14.8 13l2.4-1.4L19.6 13v2.8l-2.4 1.4-2.4-1.4z" />
    </Mark>
  ),
  IMX: () => (
    <Mark>
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.4" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </Mark>
  ),
  UNI: () => (
    <Mark>
      <path d="M9.4 19.8C6.6 18.3 5 15.6 5 12.8 5 8 9.2 4.2 12.8 4.2c1.6 0 2.6.9 2.6 2.1 0 1.4-1.3 1.9-2.4 2.3" />
      <circle cx="13.4" cy="7.2" r="1" fill="currentColor" stroke="none" />
      <path d="M9.4 19.8c3.6 1 7.6-.7 9-4" />
    </Mark>
  ),
  AAVE: () => (
    <Mark>
      <path d="M5.2 19.4v-7.2a6.8 6.8 0 0113.6 0v7.2l-2.3-1.8-2.3 1.8L12 17.6l-2.2 1.8-2.3-1.8z" />
      <path d="M10 11.4h.01M14 11.4h.01" />
    </Mark>
  ),
  MKR: () => (
    <Mark>
      <path d="M4.6 19V6.6l5.6 4.6V19M19.4 19V6.6l-5.6 4.6V19" />
    </Mark>
  ),
  DAI: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M9 8.2h3a3.9 3.9 0 010 7.6H9z" />
      <path d="M5.6 10.6h9.6M5.6 13.4h9.6" />
    </Mark>
  ),
  GRT: () => (
    <Mark>
      <circle cx="10.6" cy="10.6" r="5.6" />
      <circle cx="10.6" cy="10.6" r="2" />
      <path d="M14.8 14.8 19 19" />
    </Mark>
  ),
  CAKE: () => (
    <Mark>
      <ellipse cx="12" cy="7.8" rx="6" ry="2.6" />
      <path d="M6 7.8v4c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-4" />
      <path d="M6 11.8v4c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-4" />
    </Mark>
  ),
  JUP: () => (
    <Mark>
      <circle cx="12" cy="12" r="5.8" />
      <ellipse cx="12" cy="12" rx="9.6" ry="3.4" transform="rotate(-22 12 12)" />
    </Mark>
  ),
  ONDO: () => (
    <Mark>
      <circle cx="12" cy="12" r="2.8" />
      <path d="M7.4 7.4a6.5 6.5 0 000 9.2M16.6 7.4a6.5 6.5 0 010 9.2" />
      <path d="M4.6 4.6a10.4 10.4 0 000 14.8M19.4 4.6a10.4 10.4 0 010 14.8" />
    </Mark>
  ),
  ENA: () => (
    <Mark>
      <path d="M16.8 4.8H8.6L5.2 12l3.4 7.2h8.2" />
      <path d="M9.2 12h6" />
    </Mark>
  ),
  RNDR: () => (
    <Mark>
      <path d="M12 3.6 19.6 8v8L12 20.4 4.4 16V8z" />
      <path d="M12 12v8.4M12 12l7.6-4M12 12 4.4 8" />
    </Mark>
  ),
  WLD: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <ellipse cx="12" cy="12" rx="3.6" ry="8" />
      <path d="M4.4 9.4h15.2M4.4 14.6h15.2" />
    </Mark>
  ),
  USDT: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.4 8.8h7.2M12 8.8v7" />
    </Mark>
  ),
  USDC: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M14.9 9.3a3.7 3.7 0 100 5.4" />
    </Mark>
  ),
  BNB: () => (
    <Mark>
      <path d="M12 4.4 14 6.4 12 8.4 10 6.4zM12 15.6l2 2-2 2-2-2zM6.4 10l2 2-2 2-2-2zM17.6 10l2 2-2 2-2-2zM12 9.2 14.8 12 12 14.8 9.2 12z" />
    </Mark>
  ),
  TRX: () => (
    <Mark>
      <path d="M4.6 6.4 19.4 8.6 12 19.4z" />
      <path d="M4.6 6.4 12 12.2l7.4-3.6M12 12.2v7.2" />
    </Mark>
  ),
  // --- memes & TON ecosystem ------------------------------------------------
  DOGE: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M9.6 7.6h2.6a4.4 4.4 0 010 8.8H9.6z" />
      <path d="M7.2 12h4" />
    </Mark>
  ),
  PEPE: () => (
    <Mark>
      <circle cx="12" cy="14.2" r="5.6" />
      <circle cx="9" cy="8.4" r="2.3" />
      <circle cx="15" cy="8.4" r="2.3" />
      <path d="M9 8.4h.01M15 8.4h.01" />
    </Mark>
  ),
  SHIB: () => (
    <Mark>
      <path d="M6.4 9.2 5.8 4.8l4 2.6M17.6 9.2l.6-4.4-4 2.6" />
      <circle cx="12" cy="13.4" r="5.6" />
      <path d="M10 12.6h.01M14 12.6h.01" />
    </Mark>
  ),
  WIF: () => (
    <Mark>
      <circle cx="12" cy="14.4" r="5.2" />
      <path d="M6.2 9.4c2.2-3.6 9.4-3.6 11.6 0" />
      <path d="M4.6 9.4h14.8" />
    </Mark>
  ),
  BONK: () => (
    <Mark>
      <path d="M8.2 12h7.6" />
      <circle cx="6.3" cy="10.2" r="2" />
      <circle cx="6.3" cy="13.8" r="2" />
      <circle cx="17.7" cy="10.2" r="2" />
      <circle cx="17.7" cy="13.8" r="2" />
    </Mark>
  ),
  FLOKI: () => (
    <Mark>
      <path d="M6 9.4 12 4l6 5.4v4.2c0 3-2.6 5.4-6 6.4-3.4-1-6-3.4-6-6.4z" />
      <path d="M9.4 11.6h5.2" />
    </Mark>
  ),
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
  STON: () => (
    <Mark>
      <path d="M4.4 15.6 9 6.2l3 6 3-4 4.6 7.4z" />
      <circle cx="12" cy="19" r="1.4" />
    </Mark>
  ),
  STORM: () => (
    <Mark>
      <path d="M13.2 3.6 6.6 13.4h4.6l-1.2 7 7.4-10.4h-4.4z" />
    </Mark>
  ),
  GRAM: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M15.6 9.4a4.2 4.2 0 10.4 4.6H12" />
    </Mark>
  ),
  REDO: () => (
    <Mark>
      <circle cx="12" cy="12" r="8" />
      <path d="M9.4 16.2V7.8h3.2a2.6 2.6 0 010 5.2H9.4l4.2 3.2" />
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
