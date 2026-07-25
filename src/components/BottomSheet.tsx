import type { ReactNode } from 'react';

interface BottomSheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Shared bottom sheet (spec §2, signature element 5): slides up from the
 * bottom, glass background, rounded top corners, dimmed + blurred backdrop.
 * Used for every picker and form; consequential actions inside a sheet still
 * go through the centred confirm dialog.
 *
 * Mounted only while open — see `SheetHost`.
 */
export function BottomSheet({ title, onClose, children }: BottomSheetProps) {
  return (
    <div
      className="picker-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="picker-sheet">
        <div className="picker-header">
          <span className="picker-title">{title}</span>
          <button type="button" className="picker-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
