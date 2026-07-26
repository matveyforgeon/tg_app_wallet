import type { TabId } from '@/store/uiStore';

/**
 * Tab bar glyphs (spec §2, signature element 4): custom inline SVG line icons,
 * never emoji. Paths are copied verbatim from the mockup. `stroke` comes from
 * `currentColor` via CSS so the active tab's accent colour and drop-shadow glow
 * apply without per-icon styling.
 */

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M16 6V4.8A1.8 1.8 0 0014.2 3H5.8A2.8 2.8 0 003 5.8V7" />
      <circle cx="17" cy="13" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 10l9-6 9 6" />
      <path d="M5 10v8M10 10v8M14 10v8M19 10v8" />
      <path d="M3 21h18" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 8h13M14.5 4.5L18 8l-3.5 3.5" />
      <path d="M20 16H7M9.5 12.5L6 16l3.5 3.5" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="2.8" />
      <path d="M19.4 13.6a1.6 1.6 0 00.32 1.77l.06.06a1.94 1.94 0 11-2.75 2.75l-.06-.06a1.6 1.6 0 00-1.77-.32 1.6 1.6 0 00-.97 1.46V19.5a1.94 1.94 0 11-3.88 0v-.09a1.6 1.6 0 00-.97-1.46 1.6 1.6 0 00-1.77.32l-.06.06a1.94 1.94 0 11-2.75-2.75l.06-.06a1.6 1.6 0 00.32-1.77 1.6 1.6 0 00-1.46-.97H3.5a1.94 1.94 0 110-3.88h.09a1.6 1.6 0 001.46-.97 1.6 1.6 0 00-.32-1.77l-.06-.06A1.94 1.94 0 117.42 4.4l.06.06a1.6 1.6 0 001.77.32H9.4a1.6 1.6 0 00.97-1.46V3.5a1.94 1.94 0 113.88 0v.09a1.6 1.6 0 00.97 1.46c.62.26 1.34.13 1.77-.32l.06-.06a1.94 1.94 0 112.75 2.75l-.06.06a1.6 1.6 0 00-.32 1.77v.15a1.6 1.6 0 001.46.97h.15a1.94 1.94 0 110 3.88h-.09a1.6 1.6 0 00-1.46.97z" />
    </svg>
  );
}

export const TAB_ICON: Record<TabId, () => React.JSX.Element> = {
  wallet: WalletIcon,
  bank: BankIcon,
  swap: SwapIcon,
  settings: SettingsIcon,
};
