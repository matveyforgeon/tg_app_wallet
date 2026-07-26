import { create } from 'zustand';

interface PasscodePromptState {
  open: boolean;
  /** Shown as the prompt's subtitle — what the code is authorising. */
  reason: string;
  onSuccess: (() => void) | null;
  request: (reason: string, onSuccess: () => void) => void;
  close: () => void;
}

/**
 * Drives the passcode prompt. Lives in a store (not local state) because the
 * prompt renders at app-shell level, as a sibling of `.content` — the same
 * stacking reason every other overlay does.
 */
export const usePasscodePrompt = create<PasscodePromptState>((set) => ({
  open: false,
  reason: '',
  onSuccess: null,
  request: (reason, onSuccess) => set({ open: true, reason, onSuccess }),
  close: () => set({ open: false, onSuccess: null }),
}));
