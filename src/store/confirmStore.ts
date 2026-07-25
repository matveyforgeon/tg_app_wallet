import { create } from 'zustand';

export interface ConfirmRequest {
  title: string;
  /** One line of plain language describing the consequence or the summary. */
  message: string;
  /** Red gradient on the confirm button, for destructive actions. */
  danger?: boolean;
  onConfirm: () => void;
}

interface ConfirmState {
  request: ConfirmRequest | null;
  open: (request: ConfirmRequest) => void;
  close: () => void;
}

/**
 * Backing store for the single shared confirm dialog (spec §4). Every
 * consequential or destructive action routes through here: delete card, view
 * card details, delete a currency, swap, buy, sell, send.
 *
 * Deliberately lightweight — no PIN or password entry belongs in this dialog.
 */
export const useConfirmStore = create<ConfirmState>((set) => ({
  request: null,
  open: (request) => set({ request }),
  close: () => set({ request: null }),
}));

/** Non-hook entry point for event handlers. */
export function confirm(request: ConfirmRequest): void {
  useConfirmStore.getState().open(request);
}
