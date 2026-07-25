import { useRef, useState } from 'react';
import type { FiatAsset } from '@/types/assets';

const REVEAL_WIDTH = 76;
const OPEN_THRESHOLD = 38;

interface FiatRowProps {
  currency: FiatAsset;
  amount: number;
  /** True while another row is open, so this one closes on touch. */
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

/**
 * A fiat balance row with swipe-left-to-delete (spec §3, Bank).
 *
 * Pointer events cover mouse and touch in one path. `touch-action: pan-y` on
 * the face lets vertical scrolling through while the horizontal drag is ours.
 *
 * The face is opaque (`--card-solid`), not glass: a `backdrop-filter` sitting
 * over the red delete background pulls that colour through and tints the whole
 * row — the lesson called out in spec §2.
 */
export function FiatRow({ currency, amount, isOpen, onOpenChange, onDelete }: FiatRowProps) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const offset = dragging ? dx : isOpen ? -REVEAL_WIDTH : 0;

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX;
    setDx(isOpen ? -REVEAL_WIDTH : 0);
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const base = isOpen ? -REVEAL_WIDTH : 0;
    setDx(Math.min(0, Math.max(-REVEAL_WIDTH, base + (event.clientX - startX.current))));
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
    onOpenChange(dx < -OPEN_THRESHOLD);
  };

  return (
    <div className="fiat-swipe">
      {/* Mounted only while the row is moving. `--card-solid` is 94% opaque, so
          a permanently-rendered red background bleeds a visible tint through
          the face at rest — the exact artefact spec §2 warns about. */}
      {dragging || isOpen ? (
        <button type="button" className="fiat-delete-bg" onClick={onDelete} aria-label="Delete">
          <svg
            viewBox="0 0 24 24"
            width="19"
            height="19"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13" />
          </svg>
        </button>
      ) : null}
      <div
        className="fiat-front"
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragging ? 'none' : 'transform 0.2s ease',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="flag">{currency.flag}</span>
          <div className="token-name">{currency.code}</div>
        </div>
        <div className="token-value">
          {currency.symbol}
          {amount.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
