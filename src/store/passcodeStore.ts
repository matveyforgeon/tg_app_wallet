import { create } from 'zustand';
import { readJson, removeKey, writeJson } from '@/lib/storage';
import { digestsMatch, hashPasscode, randomSalt } from '@/lib/passcode';

interface StoredPasscode {
  salt: string;
  digest: string;
}

const STORAGE_KEY = 'passcode';

function load(): StoredPasscode | null {
  const stored = readJson<Partial<StoredPasscode> | null>(STORAGE_KEY, null);
  if (!stored || typeof stored.salt !== 'string' || typeof stored.digest !== 'string') return null;
  return { salt: stored.salt, digest: stored.digest };
}

interface PasscodeState {
  /** True once a passcode has been set on this device. */
  isSet: boolean;
  setPasscode: (code: string) => Promise<void>;
  verify: (code: string) => Promise<boolean>;
  clear: () => void;
}

/**
 * Passcode used to authorise sending crypto (spec §10 permits gating specific
 * sensitive actions; it forbids an app-entry lock, which this is not).
 *
 * Only the salt and digest are held — the code itself is never stored, and
 * never kept in memory after verification.
 */
export const usePasscodeStore = create<PasscodeState>((set) => ({
  isSet: load() !== null,

  setPasscode: async (code) => {
    const salt = randomSalt();
    const digest = await hashPasscode(code, salt);
    writeJson(STORAGE_KEY, { salt, digest } satisfies StoredPasscode);
    set({ isSet: true });
  },

  verify: async (code) => {
    const stored = load();
    if (!stored) return false;
    const digest = await hashPasscode(code, stored.salt);
    return digestsMatch(digest, stored.digest);
  },

  clear: () => {
    removeKey(STORAGE_KEY);
    set({ isSet: false });
  },
}));
