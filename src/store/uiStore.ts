import { create } from 'zustand';
import { useSettingsStore } from './settingsStore';

/**
 * Read lazily via `getState` rather than subscribing: this runs inside an
 * action, not a render. `settingsStore` does not import this module, so the
 * dependency stays one-directional.
 */
function notificationsEnabled(): boolean {
  return useSettingsStore.getState().notifications;
}

export type TabId = 'wallet' | 'bank' | 'swap' | 'settings';

/** Tab order is fixed by spec §10 — Wallet, Bank, Swap, Settings. */
export const TAB_ORDER: readonly TabId[] = ['wallet', 'bank', 'swap', 'settings'];

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
}

const TOAST_DURATION_MS = 2400;

interface UiState {
  activeTab: TabId;
  toast: Toast | null;
  setTab: (tab: TabId) => void;
  showToast: (message: string, kind: ToastKind) => void;
  dismissToast: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;
let toastSeq = 0;

export const useUiStore = create<UiState>((set) => ({
  activeTab: 'wallet',
  toast: null,

  setTab: (activeTab) => set({ activeTab }),

  showToast: (message, kind) => {
    // The Notifications setting genuinely gates these. Errors always get
    // through — silencing a failed action would leave the user guessing why
    // nothing happened, which is worse than an unwanted notification.
    if (kind !== 'error' && !notificationsEnabled()) return;
    if (toastTimer !== null) clearTimeout(toastTimer);
    toastSeq += 1;
    set({ toast: { id: toastSeq, message, kind } });
    toastTimer = globalThis.setTimeout(() => {
      toastTimer = null;
      set({ toast: null });
    }, TOAST_DURATION_MS);
  },

  dismissToast: () => {
    if (toastTimer !== null) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    set({ toast: null });
  },
}));

/** Non-hook access for call sites outside React (event handlers, services). */
export const toast = {
  success: (message: string) => useUiStore.getState().showToast(message, 'success'),
  error: (message: string) => useUiStore.getState().showToast(message, 'error'),
  info: (message: string) => useUiStore.getState().showToast(message, 'info'),
};
