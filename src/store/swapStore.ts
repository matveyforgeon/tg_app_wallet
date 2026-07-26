import { create } from 'zustand';
import type { AssetRef } from '@/types/assets';

export type SwapTarget = 'from' | 'to';

interface SwapState {
  from: AssetRef;
  to: AssetRef;
  amountText: string;
  /** Which pill opened the picker — decides where the next selection lands. */
  pickerTarget: SwapTarget;
  pickerOpen: boolean;

  setAmountText: (value: string) => void;
  flip: () => void;
  openPicker: (target: SwapTarget) => void;
  closePicker: () => void;
  /** Sets whichever side `pickerTarget` points at, then closes the sheet. */
  selectAsset: (asset: AssetRef) => void;
}

/**
 * Swap screen state.
 *
 * `pickerOpen`/`pickerTarget` live here (not local to `SwapScreen`) because the
 * picker itself renders at app-shell level, as a sibling of `.content` — same
 * reason the other bottom sheets do (see `sheetStore`): `.content` is a
 * stacking context under the tab bar, so a sheet mounted inside a screen would
 * have its taps swallowed by the bar.
 */
export const useSwapStore = create<SwapState>((set, get) => ({
  from: { type: 'crypto', code: 'GRAM' },
  to: { type: 'crypto', code: 'USDT' },
  amountText: '1.5',
  pickerTarget: 'from',
  pickerOpen: false,

  setAmountText: (amountText) => set({ amountText }),

  flip: () => set((state) => ({ from: state.to, to: state.from })),

  openPicker: (pickerTarget) => set({ pickerTarget, pickerOpen: true }),
  closePicker: () => set({ pickerOpen: false }),

  selectAsset: (asset) => {
    const { pickerTarget } = get();
    set(pickerTarget === 'from' ? { from: asset, pickerOpen: false } : { to: asset, pickerOpen: false });
  },
}));
