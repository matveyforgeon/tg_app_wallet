import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { syncTelegramChrome } from '@/telegram/telegram';

/**
 * Mirrors the active theme onto `<body data-theme>` — the same hook the
 * mockup's light-theme variable overrides key off — and repaints Telegram's
 * header/background to match.
 */
export function useThemeEffect(): void {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    syncTelegramChrome(theme);
  }, [theme]);
}
