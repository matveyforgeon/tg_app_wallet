import WebAppImport from '@twa-dev/sdk';
import type { Lang } from '@/i18n/types';

/**
 * Thin, defensive wrapper around the Telegram WebApp SDK.
 *
 * Everything here must keep working when the app is opened in a plain browser
 * (local dev, design review), so every call is guarded and every getter has a
 * sensible non-Telegram fallback.
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type NotificationType = 'error' | 'success' | 'warning';

/**
 * `@twa-dev/sdk`'s default export is `window.Telegram.WebApp` captured once,
 * at module-eval time. On at least one real device that captured reference
 * goes stale — `window.Telegram.WebApp` later points to a different, fully
 * populated object (confirmed live: the captured copy has none of version /
 * platform / BiometricManager, while the current `window.Telegram.WebApp`
 * carries dozens of real keys). Reading it fresh on every call, falling back
 * to the captured copy only if `window.Telegram.WebApp` is ever absent,
 * fixes that without guessing why the replacement happens.
 */
function tg(): typeof WebAppImport {
  try {
    const live = (globalThis as { Telegram?: { WebApp?: typeof WebAppImport } }).Telegram?.WebApp;
    return live ?? WebAppImport;
  } catch {
    return WebAppImport;
  }
}

/** True when the page is actually running inside a Telegram client. */
export function isTelegramEnv(): boolean {
  try {
    return typeof tg().initData === 'string' && tg().initData.length > 0;
  } catch {
    return false;
  }
}

export interface TelegramUserInfo {
  id: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  username: string | undefined;
  languageCode: string | undefined;
}

export function getTelegramUser(): TelegramUserInfo | null {
  try {
    const user = tg().initDataUnsafe?.user;
    if (!user) return null;
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      languageCode: user.language_code,
    };
  } catch {
    return null;
  }
}

/**
 * Language auto-detection (spec §5): Telegram `language_code` first, browser
 * locale as the fallback when we are not running inside Telegram.
 */
export function detectInitialLang(): Lang {
  const fromTelegram = getTelegramUser()?.languageCode;
  if (fromTelegram) {
    return fromTelegram.toLowerCase().startsWith('ru') ? 'ru' : 'en';
  }
  const nav = (globalThis.navigator?.language ?? 'en').toLowerCase();
  return nav.startsWith('ru') ? 'ru' : 'en';
}

/** Telegram's own light/dark preference, used only as the initial theme seed. */
export function getTelegramColorScheme(): 'dark' | 'light' {
  try {
    return tg().colorScheme === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

/**
 * Publishes Telegram's safe-area insets as CSS custom properties so the tab bar
 * clears the home indicator on devices that report one.
 */
function applySafeAreaVars(): void {
  try {
    const inset = (tg() as { contentSafeAreaInset?: { top?: number; bottom?: number } })
      .contentSafeAreaInset;
    const root = document.documentElement;
    if (typeof inset?.top === 'number') {
      root.style.setProperty('--tg-safe-top', `${inset.top}px`);
    }
    if (typeof inset?.bottom === 'number') {
      root.style.setProperty('--tg-safe-bottom', `${inset.bottom}px`);
    }
  } catch {
    /* not in Telegram — CSS fallbacks of 0px stay in place */
  }
}

let initialised = false;

/**
 * Idempotent Telegram bootstrap: signals readiness, takes the full viewport and
 * paints the client chrome to match `--bg-void`.
 */
export function initTelegram(): void {
  if (initialised) return;
  initialised = true;

  try {
    tg().ready();
    tg().expand();

    // Telegram's own chrome should blend into the app background.
    tg().setHeaderColor('#060608');
    tg().setBackgroundColor('#060608');

    // Swipe-to-close fights the swipe-to-delete gesture on the Bank tab.
    (tg() as { disableVerticalSwipes?: () => void }).disableVerticalSwipes?.();

    applySafeAreaVars();
    tg().onEvent('viewportChanged', applySafeAreaVars);
  } catch {
    /* running outside Telegram — nothing to initialise */
  }
}

/** Repaints Telegram's header/background when the in-app theme is toggled. */
export function syncTelegramChrome(theme: 'dark' | 'light'): void {
  const color = theme === 'dark' ? '#060608' : '#eef0f4';
  try {
    tg().setHeaderColor(color);
    tg().setBackgroundColor(color);
  } catch {
    /* no-op outside Telegram */
  }
}

/**
 * Telegram's BiometricManager (Face ID / Touch ID / Android biometrics).
 *
 * Not in the SDK's shipped typings yet, so it is reached through a narrow cast
 * — the same approach already used for `disableVerticalSwipes` above. Every
 * method degrades to "unavailable" outside Telegram or on a device without
 * biometrics, so callers can always fall through to the confirm dialog alone.
 */
interface BiometricManagerApi {
  isInited: boolean;
  isBiometricAvailable: boolean;
  isAccessGranted: boolean;
  init: (cb?: () => void) => void;
  requestAccess: (params: { reason?: string }, cb?: (granted: boolean) => void) => void;
  authenticate: (params: { reason?: string }, cb?: (ok: boolean) => void) => void;
}

function biometricManager(): BiometricManagerApi | null {
  try {
    const api = (tg() as { BiometricManager?: BiometricManagerApi }).BiometricManager;
    return api ?? null;
  } catch {
    return null;
  }
}

/**
 * WebAuthn platform-authenticator fallback, used whenever Telegram's own
 * BiometricManager is absent — chiefly when the Mini App is opened as a
 * plain HTTPS page rather than inside a Telegram client. It drives the same
 * Face ID / Touch ID / Windows Hello prompt the OS already owns; there is no
 * server, so the credential only ever proves "the same device unlocked this
 * again", matching the honest, client-only scope of the passcode.
 */
const WEBAUTHN_CRED_KEY = 'webauthnCredentialId';

function bufToBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToBuf(b64: string): ArrayBuffer {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer;
}

async function webAuthnPlatformAvailable(): Promise<boolean> {
  try {
    const cred = globalThis.PublicKeyCredential as
      | { isUserVerifyingPlatformAuthenticatorAvailable?: () => Promise<boolean> }
      | undefined;
    if (!cred?.isUserVerifyingPlatformAuthenticatorAvailable) return false;
    return await cred.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

async function webAuthnAuthenticate(): Promise<boolean> {
  const storedId = globalThis.localStorage?.getItem(WEBAUTHN_CRED_KEY);
  if (!storedId) return false;
  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials: [{ id: base64ToBuf(storedId), type: 'public-key' }],
        userVerification: 'required',
        timeout: 60_000,
      },
    });
    return assertion !== null;
  } catch {
    return false;
  }
}

async function webAuthnEnroll(): Promise<boolean> {
  const storedId = globalThis.localStorage?.getItem(WEBAUTHN_CRED_KEY);
  // Already enrolled on this device — a fresh scan confirms it's really them.
  if (storedId) return webAuthnAuthenticate();
  try {
    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: { name: 'Vortex' },
        user: {
          id: crypto.getRandomValues(new Uint8Array(16)),
          name: 'wallet',
          displayName: 'Vortex Wallet',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
        timeout: 60_000,
      },
    })) as PublicKeyCredential | null;
    if (!credential) return false;
    globalThis.localStorage?.setItem(WEBAUTHN_CRED_KEY, bufToBase64(credential.rawId));
    return true;
  } catch {
    return false;
  }
}

export const biometrics = {
  /** True when the device can actually prompt — checked before offering the toggle. */
  async isAvailable(): Promise<boolean> {
    const api = biometricManager();
    if (api) {
      if (api.isInited) return api.isBiometricAvailable;
      return new Promise((resolve) => {
        // init() is async; without waiting, isBiometricAvailable reads false.
        const timeout = globalThis.setTimeout(() => resolve(false), 3000);
        api.init(() => {
          clearTimeout(timeout);
          resolve(api.isBiometricAvailable);
        });
      });
    }
    return webAuthnPlatformAvailable();
  },

  /**
   * TEMPORARY — raw state behind `isAvailable()`, for tracking down why the
   * Security toggle is hidden on a specific device. Settings renders this
   * only while the toggle is hidden; delete both once biometrics are
   * confirmed working across the target devices.
   */
  async debugInfo(): Promise<string> {
    const tgVersion = (() => {
      try {
        return tg().version;
      } catch {
        return 'n/a';
      }
    })();
    const platform = (() => {
      try {
        return tg().platform;
      } catch {
        return 'n/a';
      }
    })();
    const api = biometricManager();
    if (!api) {
      const webauthn = await webAuthnPlatformAvailable();
      const pkc = typeof globalThis.PublicKeyCredential !== 'undefined';
      return (
        `tg=${tgVersion} platform=${platform} manager=none webauthn=${webauthn} pkc=${pkc} ` +
        `secure=${globalThis.isSecureContext}`
      );
    }
    if (!api.isInited) {
      await new Promise<void>((resolve) => {
        const timeout = globalThis.setTimeout(resolve, 3000);
        api.init(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
    return `tg=${tgVersion} platform=${platform} inited=${api.isInited} available=${api.isBiometricAvailable} granted=${api.isAccessGranted}`;
  },

  /** Asks the user to grant the Mini App biometric access. */
  async requestAccess(reason: string): Promise<boolean> {
    const api = biometricManager();
    if (api) {
      if (api.isAccessGranted) return true;
      return new Promise((resolve) => {
        const timeout = globalThis.setTimeout(() => resolve(false), 60_000);
        api.requestAccess({ reason }, (granted) => {
          clearTimeout(timeout);
          resolve(granted);
        });
      });
    }
    return webAuthnEnroll();
  },

  /**
   * Prompts for a biometric scan. Resolves false on cancel/failure so the
   * caller can abort the action rather than proceeding.
   */
  async authenticate(reason: string): Promise<boolean> {
    const api = biometricManager();
    if (api) {
      return new Promise((resolve) => {
        const timeout = globalThis.setTimeout(() => resolve(false), 60_000);
        api.authenticate({ reason }, (ok) => {
          clearTimeout(timeout);
          resolve(ok);
        });
      });
    }
    return webAuthnAuthenticate();
  },
};

/** Opens a URL in Telegram's in-app browser, falling back to a normal tab. */
export function openLink(url: string): void {
  try {
    tg().openLink(url);
  } catch {
    globalThis.open?.(url, '_blank', 'noopener');
  }
}

/** Opens a t.me link inside Telegram itself rather than a browser. */
export function openTelegramLink(url: string): void {
  try {
    tg().openTelegramLink(url);
  } catch {
    openLink(url);
  }
}

export const haptics = {
  impact(style: HapticStyle = 'light'): void {
    try {
      tg().HapticFeedback.impactOccurred(style);
    } catch {
      /* no-op */
    }
  },
  notify(type: NotificationType): void {
    try {
      tg().HapticFeedback.notificationOccurred(type);
    } catch {
      /* no-op */
    }
  },
  select(): void {
    try {
      tg().HapticFeedback.selectionChanged();
    } catch {
      /* no-op */
    }
  },
};
