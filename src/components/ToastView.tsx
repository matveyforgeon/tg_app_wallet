import { useUiStore } from '@/store/uiStore';
import type { ToastKind } from '@/store/uiStore';

const GLYPH: Record<ToastKind, string> = {
  success: '✓',
  error: '⚠',
  info: 'ℹ',
};

/**
 * Single global toast. Kept mounted so the show/hide opacity transition runs
 * both ways instead of snapping on unmount.
 */
export function ToastView() {
  const toast = useUiStore((state) => state.toast);

  const className = ['toast', toast ? 'show' : '', toast?.kind ?? ''].filter(Boolean).join(' ');

  return (
    <div className={className} role="status" aria-live="polite">
      {toast ? `${GLYPH[toast.kind]} ${toast.message}` : ''}
    </div>
  );
}
