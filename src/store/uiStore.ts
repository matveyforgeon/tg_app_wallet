import { create } from 'zustand';

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
