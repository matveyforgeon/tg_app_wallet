import { create } from 'zustand';

/** Every bottom sheet in the app. One is open at a time, like the mockup. */
export type SheetId = 'receive' | 'send' | 'buy' | 'createCard' | 'addCurrency' | 'baseCurrency';

interface SheetState {
  active: SheetId | null;
  open: (sheet: SheetId) => void;
  close: () => void;
}

/**
 * Sheets are hosted at the app-shell level rather than inside the screen that
 * triggers them — `.content` is a stacking context (`z-index: 2`), so a sheet
 * rendered inside it would sit *below* the tab bar (`z-index: 5`) and the tab
 * bar would swallow taps meant for the sheet. The mockup avoids this by making
 * every overlay a sibling of `.content`; `SheetHost` does the same.
 */
export const useSheetStore = create<SheetState>((set) => ({
  active: null,
  open: (sheet) => set({ active: sheet }),
  close: () => set({ active: null }),
}));
