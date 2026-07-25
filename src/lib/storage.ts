/**
 * localStorage access that never throws. Telegram's in-app webview can deny
 * storage (private mode / embedded contexts), and a throw here would take the
 * whole app down at boot.
 */

const PREFIX = 'tgw:';

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = globalThis.localStorage?.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    globalThis.localStorage?.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable — settings simply don't survive a reload */
  }
}

export function removeKey(key: string): void {
  try {
    globalThis.localStorage?.removeItem(PREFIX + key);
  } catch {
    /* no-op */
  }
}
