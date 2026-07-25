/**
 * Asset glyphs, ported from the mockup's `ICONS` map.
 *
 * These are deliberately abstract marks drawn in `currentColor`, not brand
 * logos — the coloured circle behind them comes from each catalog entry's `bg`.
 */

const TEXT_PROPS = {
  x: 12,
  y: 17,
  textAnchor: 'middle' as const,
  fontFamily: 'Space Grotesk, sans-serif',
  fontWeight: 700,
  fill: 'currentColor',
};

function Glyph({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      {children}
    </svg>
  );
}

const ASSET_ICONS: Record<string, () => React.JSX.Element> = {
  TON: () => (
    <Glyph>
      <path
        d="M12 3.5 19 8v8l-7 4.5L5 16V8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Glyph>
  ),
  BTC: () => (
    <Glyph>
      <text {...TEXT_PROPS} fontSize="15">
        ₿
      </text>
    </Glyph>
  ),
  ETH: () => (
    <Glyph>
      <text {...TEXT_PROPS} fontSize="15">
        Ξ
      </text>
    </Glyph>
  ),
  DOGE: () => (
    <Glyph>
      <text {...TEXT_PROPS} fontSize="15">
        Ð
      </text>
    </Glyph>
  ),
  PEPE: () => (
    <Glyph>
      <ellipse cx="12" cy="14" rx="7" ry="6" fill="currentColor" opacity="0.9" />
      <circle cx="8.5" cy="8.5" r="2.2" fill="currentColor" />
      <circle cx="15.5" cy="8.5" r="2.2" fill="currentColor" />
    </Glyph>
  ),
  SHIB: () => (
    <Glyph>
      <path
        d="M6 9l3-3 1 3M18 9l-3-3-1 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="6" fill="currentColor" opacity="0.9" />
    </Glyph>
  ),
  SOL: () => (
    <Glyph>
      <text {...TEXT_PROPS} fontSize="14">
        S
      </text>
    </Glyph>
  ),
  USDT: () => (
    <Glyph>
      <text {...TEXT_PROPS} fontSize="14">
        $
      </text>
    </Glyph>
  ),
  USDC: () => (
    <Glyph>
      <text {...TEXT_PROPS} fontSize="14">
        $
      </text>
    </Glyph>
  ),
  BNB: () => (
    <Glyph>
      <rect
        x="7"
        y="7"
        width="10"
        height="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        transform="rotate(45 12 12)"
      />
    </Glyph>
  ),
  XRP: () => (
    <Glyph>
      <text {...TEXT_PROPS} fontSize="14">
        X
      </text>
    </Glyph>
  ),
  ADA: () => (
    <Glyph>
      <text {...TEXT_PROPS} fontSize="14">
        A
      </text>
    </Glyph>
  ),
  LTC: () => (
    <Glyph>
      <text {...TEXT_PROPS} fontSize="15">
        Ł
      </text>
    </Glyph>
  ),
  TRX: () => (
    <Glyph>
      <path d="M13 3L6 14h5l-1 7 8-11h-5z" fill="currentColor" />
    </Glyph>
  ),
};

export function AssetIcon({ code }: { code: string }) {
  const Icon = ASSET_ICONS[code];
  return Icon ? <Icon /> : null;
}
