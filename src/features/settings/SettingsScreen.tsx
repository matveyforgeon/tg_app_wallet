import { useEffect, useState } from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { env } from '@/config/env';
import { useLogout } from '@/hooks/useLogout';
import { useTranslation } from '@/i18n/useTranslation';
import { shortenAddress } from '@/lib/format';
import { confirm } from '@/store/confirmStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useSheetStore } from '@/store/sheetStore';
import { toast } from '@/store/uiStore';
import { biometrics, haptics } from '@/telegram/telegram';
import type { Lang } from '@/i18n/types';

/** A settings toggle that reads and writes real state. */
function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      className={`switch${on ? ' on' : ''}`}
      onClick={() => {
        haptics.select();
        onChange();
      }}
      aria-pressed={on}
      aria-label={label}
    >
      <span className="switch-dot" />
    </button>
  );
}

/**
 * Settings (spec §3).
 *
 * Everything here does something real. Two items from the mockup's table are
 * deliberately absent rather than shipped as dead controls:
 *
 * - "Change PIN" — spec §10 forbids rebuilding an app-wide passcode; it was
 *   built once and removed on purpose. Its role is covered by the confirm
 *   dialog plus the biometric gate below, which is exactly the replacement the
 *   spec names.
 * - "Two-factor authentication" — real 2FA needs server-side enrollment and
 *   verification. A browser-only imitation would look like protection while
 *   providing none, so it waits for a backend.
 */
export function SettingsScreen() {
  const { t, lang } = useTranslation();
  const theme = useSettingsStore((state) => state.theme);
  const toggleTheme = useSettingsStore((state) => state.toggleTheme);
  const baseCurrency = useSettingsStore((state) => state.baseCurrency);
  const notifications = useSettingsStore((state) => state.notifications);
  const setNotifications = useSettingsStore((state) => state.setNotifications);
  const biometric = useSettingsStore((state) => state.biometric);
  const setBiometric = useSettingsStore((state) => state.setBiometric);
  const switchLang = useSettingsStore((state) => state.switchLang);

  const openSheet = useSheetStore((state) => state.open);
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  const logout = useLogout();

  // The Biometric row is only offered when the device can actually prompt.
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void biometrics.isAvailable().then((available) => {
      if (!cancelled) setBiometricAvailable(available);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const onWalletRow = () => {
    haptics.impact('light');
    if (!address) {
      void tonConnectUI.openModal();
      return;
    }
    confirm({
      title: t('disconnectWallet'),
      message: shortenAddress(address, 8, 6),
      danger: true,
      onConfirm: () => {
        void tonConnectUI.disconnect();
        toast.info(t('walletDisconnected'));
      },
    });
  };

  const onToggleNotifications = () => {
    const next = !notifications;
    setNotifications(next);
    // Announce only when turning on — a toast confirming silence is absurd.
    if (next) toast.info(t('notificationsOn'));
  };

  const onToggleBiometric = () => {
    if (biometric) {
      setBiometric(false);
      toast.info(t('biometricDisabled'));
      return;
    }
    void (async () => {
      const granted = await biometrics.requestAccess(t('biometricHint'));
      if (!granted) {
        haptics.notify('error');
        toast.error(t('biometricDenied'));
        return;
      }
      setBiometric(true);
      haptics.notify('success');
      toast.success(t('biometricEnabled'));
    })();
  };

  const onLanguageRow = () => {
    haptics.impact('light');
    const next: Lang = lang === 'en' ? 'ru' : 'en';
    switchLang(next);
  };

  return (
    <>
      <div className="section-title">{t('preferences')}</div>
      <div className="card">
        <div className="settings-row">
          <span>{t('darkMode')}</span>
          <Toggle on={theme === 'dark'} onChange={toggleTheme} label={t('darkMode')} />
        </div>

        <div className="settings-row settings-row-stack">
          <div className="settings-row-main">
            <span>{t('notifications')}</span>
            <Toggle on={notifications} onChange={onToggleNotifications} label={t('notifications')} />
          </div>
          <div className="settings-row-hint">{t('notificationsHint')}</div>
        </div>

        <div
          className="settings-row"
          role="button"
          tabIndex={0}
          onClick={() => {
            haptics.impact('light');
            openSheet('baseCurrency');
          }}
        >
          <span>{t('baseCurrency')}</span>
          <span className="chev">{baseCurrency} ›</span>
        </div>
      </div>

      {biometricAvailable ? (
        <>
          <div className="section-title">{t('security')}</div>
          <div className="card">
            <div className="settings-row settings-row-stack">
              <div className="settings-row-main">
                <span>{t('biometric')}</span>
                <Toggle on={biometric} onChange={onToggleBiometric} label={t('biometric')} />
              </div>
              <div className="settings-row-hint">{t('biometricHint')}</div>
            </div>
          </div>
        </>
      ) : null}

      <div className="section-title">{t('account')}</div>
      <div className="card">
        <div className="settings-row" role="button" tabIndex={0} onClick={onWalletRow}>
          <span>{t('connectedWallet')}</span>
          <span style={{ color: address ? 'var(--text-dim)' : 'var(--holo-2)' }}>
            {address ? shortenAddress(address) : t('connectWallet')} ›
          </span>
        </div>
        <div className="settings-row" role="button" tabIndex={0} onClick={onLanguageRow}>
          <span>{t('language')}</span>
          <span className="chev">{t('langLabel')} ›</span>
        </div>
        <div className="settings-row">
          <span>{t('appVersion')}</span>
          <span style={{ color: 'var(--text-dim)' }}>{env.appVersion}</span>
        </div>
      </div>

      <div className="card">
        <div className="settings-row danger" role="button" tabIndex={0} onClick={logout}>
          <span>{t('logOut')}</span>
        </div>
      </div>
    </>
  );
}
