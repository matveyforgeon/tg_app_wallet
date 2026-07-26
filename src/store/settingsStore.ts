import { create } from 'zustand';
import { readJson, removeKey, writeJson } from '@/lib/storage';
import { isLang, type Lang } from '@/i18n/types';
import { isBaseCurrency, type BaseCurrency } from '@/data/fiatCatalog';
import { detectInitialLang, getTelegramColorScheme, syncTelegramChrome } from '@/telegram/telegram';

export type Theme = 'dark' | 'light';

/**
 * Persisted settings.
 *
 * Per the spec's settings table (§3) only `theme` and `baseCurrency` are wired
 * to real behaviour. `notifications`, `biometric` and `twoFA` are cosmetic
 * toggles for now — they persist, but nothing subscribes to them yet.
 */
interface PersistedSettings {
  lang: Lang | null;
  theme: Theme | null;
  baseCurrency: BaseCurrency;
  notifications: boolean;
  biometric: boolean;
  twoFA: boolean;
}

const STORAGE_KEY = 'settings';

const DEFAULTS: PersistedSettings = {
  lang: null,
  theme: null,
  baseCurrency: 'USD',
  notifications: true,
  biometric: false,
  twoFA: false,
};

function loadPersisted(): PersistedSettings {
  const stored = readJson<Partial<PersistedSettings>>(STORAGE_KEY, {});
  return {
    lang: isLang(stored.lang) ? stored.lang : null,
    theme: stored.theme === 'light' || stored.theme === 'dark' ? stored.theme : null,
    baseCurrency: isBaseCurrency(stored.baseCurrency) ? stored.baseCurrency : DEFAULTS.baseCurrency,
    notifications: typeof stored.notifications === 'boolean' ? stored.notifications : DEFAULTS.notifications,
    biometric: typeof stored.biometric === 'boolean' ? stored.biometric : DEFAULTS.biometric,
    twoFA: typeof stored.twoFA === 'boolean' ? stored.twoFA : DEFAULTS.twoFA,
  };
}

const persisted = loadPersisted();

export interface SettingsState {
  lang: Lang;
  theme: Theme;
  baseCurrency: BaseCurrency;
  notifications: boolean;
  biometric: boolean;
  twoFA: boolean;
  /** True while the ~550ms spinner shown on a manual language switch is up. */
  langSwitching: boolean;

  setLang: (lang: Lang) => void;
  /** Manual toggle: shows the spinner first, then applies (spec §5). */
  switchLang: (lang: Lang) => void;
  toggleTheme: () => void;
  setBaseCurrency: (code: BaseCurrency) => void;
  setNotifications: (value: boolean) => void;
  setBiometric: (value: boolean) => void;
  setTwoFA: (value: boolean) => void;
  /** Clears every persisted preference back to defaults (log out). */
  resetAll: () => void;
}

/** Spec §5: brief loading state before a *manual* language switch applies. */
const LANG_SWITCH_DELAY_MS = 550;

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // Auto-detected on first launch, then remembered.
  lang: persisted.lang ?? detectInitialLang(),
  theme: persisted.theme ?? getTelegramColorScheme(),
  baseCurrency: persisted.baseCurrency,
  notifications: persisted.notifications,
  biometric: persisted.biometric,
  twoFA: persisted.twoFA,
  langSwitching: false,

  setLang: (lang) => {
    set({ lang });
    persist(get());
  },

  switchLang: (lang) => {
    if (lang === get().lang) return;
    set({ langSwitching: true });
    globalThis.setTimeout(() => {
      set({ lang, langSwitching: false });
      persist(get());
    }, LANG_SWITCH_DELAY_MS);
  },

  toggleTheme: () => {
    const theme: Theme = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme });
    syncTelegramChrome(theme);
    persist(get());
  },

  setBaseCurrency: (baseCurrency) => {
    set({ baseCurrency });
    persist(get());
  },

  setNotifications: (notifications) => {
    set({ notifications });
    persist(get());
  },

  setBiometric: (biometric) => {
    set({ biometric });
    persist(get());
  },

  setTwoFA: (twoFA) => {
    set({ twoFA });
    persist(get());
  },

  /**
   * Log out (spec §3): clears every persisted preference and returns the store
   * to defaults. Language is deliberately kept — re-detecting it would flip the
   * UI to another language mid-action, which reads as a bug rather than a
   * logout. Wallet disconnection, the card and holdings are cleared by their
   * own stores; see `useLogout`.
   */
  resetAll: () => {
    const lang = get().lang;
    set({
      lang,
      theme: DEFAULTS.theme ?? 'dark',
      baseCurrency: DEFAULTS.baseCurrency,
      notifications: DEFAULTS.notifications,
      biometric: DEFAULTS.biometric,
      twoFA: DEFAULTS.twoFA,
    });
    removeKey(STORAGE_KEY);
  },
}));

function persist(state: SettingsState): void {
  const snapshot: PersistedSettings = {
    lang: state.lang,
    theme: state.theme,
    baseCurrency: state.baseCurrency,
    notifications: state.notifications,
    biometric: state.biometric,
    twoFA: state.twoFA,
  };
  writeJson(STORAGE_KEY, snapshot);
}
