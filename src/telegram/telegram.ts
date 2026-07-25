import WebApp from '@twa-dev/sdk';
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

/** True when the page is actually running inside a Telegram client. */
export function isTelegramEnv(): boolean {
  try {
    return typeof WebApp.initData === 'string' && WebApp.initData.length > 0;
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
    const user = WebApp.initDataUnsafe?.user;
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
    return WebApp.colorScheme === 'light' ? 'light' : 'dark';
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
    const inset = (WebApp as { contentSafeAreaInset?: { top?: number; bottom?: number } })
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
    WebApp.ready();
    WebApp.expand();

    // Telegram's own chrome should blend into the app background.
    WebApp.setHeaderColor('#060608');
    WebApp.setBackgroundColor('#060608');

    // Swipe-to-close fights the swipe-to-delete gesture on the Bank tab.
    (WebApp as { disableVerticalSwipes?: () => void }).disableVerticalSwipes?.();

    applySafeAreaVars();
    WebApp.onEvent('viewportChanged', applySafeAreaVars);
  } catch {
    /* running outside Telegram — nothing to initialise */
  }
}

/** Repaints Telegram's header/background when the in-app theme is toggled. */
export function syncTelegramChrome(theme: 'dark' | 'light'): void {
  const color = theme === 'dark' ? '#060608' : '#eef0f4';
  try {
    WebApp.setHeaderColor(color);
    WebApp.setBackgroundColor(color);
  } catch {
    /* no-op outside Telegram */
  }
}

export const haptics = {
  impact(style: HapticStyle = 'light'): void {
    try {
      WebApp.HapticFeedback.impactOccurred(style);
    } catch {
      /* no-op */
    }
  },
  notify(type: NotificationType): void {
    try {
      WebApp.HapticFeedback.notificationOccurred(type);
    } catch {
      /* no-op */
    }
  },
  select(): void {
    try {
      WebApp.HapticFeedback.selectionChanged();
    } catch {
      /* no-op */
    }
  },
};
