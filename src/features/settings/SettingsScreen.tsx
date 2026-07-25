import { useEffect, useState } from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { PasscodeSetup } from '@/components/PasscodeSetup';
import { env } from '@/config/env';
import { useLogout } from '@/hooks/useLogout';
import { useTranslation } from '@/i18n/useTranslation';
import { shortenAddress } from '@/lib/format';
import { confirm } from '@/store/confirmStore';
import { usePasscodeStore } from '@/store/passcodeStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useSheetStore } from '@/store/sheetStore';
import { toast } from '@/store/uiStore';
import { biometrics, haptics, openLink, openTelegramLink } from '@/telegram/telegram';
import type { Lang } from '@/i18n/types';

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
 * Settings. Section order is Account → Security → Preferences → Support →
 * Log out, as requested.
 *
 * Every control does something real. "Two-factor authentication" is absent:
 * real 2FA needs server-side enrollment and verification, and a browser-only
 * imitation would look like protection while providing none. Its role is
 * covered by the send passcode and the biometric gate below — which is the
 * per-action security spec §10 asks for instead of an app-entry lock.
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

  const passcodeSet = usePasscodeStore((state) => state.isSet);
  const clearPasscode = usePasscodeStore((state) => state.clear);
  const [settingPasscode, setSettingPasscode] = useState(false);

  const openSheet = useSheetStore((state) => state.open);
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  const logout = useLogout();

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

  const onPasscodeRow = () => {
    haptics.impact('light');
    if (!passcodeSet) {
      setSettingPasscode(true);
      return;
    }
    confirm({
      title: t('passcodeRemoveTitle'),
      message: t('passcodeRemoveMsg'),
      danger: true,
      onConfirm: () => {
        clearPasscode();
        toast.info(t('passcodeRemoved'));
      },
    });
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
      toast.success(t('biometricEnabled'));
    })();
  };

  if (settingPasscode) {
    return (
      <div className="passcode-inline">
        <PasscodeSetup onDone={() => setSettingPasscode(false)} onCancel={() => setSettingPasscode(false)} />
      </div>
    );
  }

  return (
    <>
      {/* 1 — Account */}
      <div className="section-title">{t('account')}</div>
      <div className="card">
        <div className="settings-row" role="button" tabIndex={0} onClick={onWalletRow}>
          <span>{t('connectedWallet')}</span>
          <span style={{ color: address ? 'var(--text-dim)' : 'var(--holo-2)' }}>
            {address ? shortenAddress(address) : t('connectWallet')} ›
          </span>
        </div>
        <div
          className="settings-row"
          role="button"
          tabIndex={0}
          onClick={() => {
            haptics.impact('light');
            const next: Lang = lang === 'en' ? 'ru' : 'en';
            switchLang(next);
          }}
        >
          <span>{t('language')}</span>
          <span className="chev">{t('langLabel')} ›</span>
        </div>
        <div className="settings-row">
          <span>{t('appVersion')}</span>
          <span style={{ color: 'var(--text-dim)' }}>{env.appVersion}</span>
        </div>
      </div>

      {/* 2 — Security */}
      <div className="section-title">{t('security')}</div>
      <div className="card">
        <div className="settings-row settings-row-stack">
          <div className="settings-row-main" role="button" tabIndex={0} onClick={onPasscodeRow}>
            <span>{t('passcodeLabel')}</span>
            <span className="chev">{passcodeSet ? '••••' : t('onboardSetPasscode')} ›</span>
          </div>
          <div className="settings-row-hint">{t('passcodeHint')}</div>
        </div>

        {biometricAvailable ? (
          <div className="settings-row settings-row-stack">
            <div className="settings-row-main">
              <span>{t('biometric')}</span>
              <Toggle on={biometric} onChange={onToggleBiometric} label={t('biometric')} />
            </div>
            <div className="settings-row-hint">{t('biometricHint')}</div>
          </div>
        ) : null}
      </div>

      {/* 3 — Preferences */}
      <div className="section-title">{t('preferences')}</div>
      <div className="card">
        <div className="settings-row">
          <span>{t('darkMode')}</span>
          <Toggle on={theme === 'dark'} onChange={toggleTheme} label={t('darkMode')} />
        </div>
        <div className="settings-row settings-row-stack">
          <div className="settings-row-main">
            <span>{t('notifications')}</span>
            <Toggle
              on={notifications}
              onChange={() => {
                const next = !notifications;
                setNotifications(next);
                if (next) toast.info(t('notificationsOn'));
              }}
              label={t('notifications')}
            />
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

      {/* 4 — Support */}
      <div className="section-title">{t('support')}</div>
      <div className="card">
        <div
          className="settings-row"
          role="button"
          tabIndex={0}
          onClick={() => {
            haptics.impact('light');
            // t.me links open inside Telegram rather than a browser tab.
            openTelegramLink(env.links.support);
          }}
        >
          <span>{t('contactSupport')}</span>
          <span className="chev">›</span>
        </div>
        <div
          className="settings-row"
          role="button"
          tabIndex={0}
          onClick={() => {
            haptics.impact('light');
            openLink(env.links.terms);
          }}
        >
          <span>{t('terms')}</span>
          <span className="chev">›</span>
        </div>
      </div>

      {/* 5 — Log out */}
      <div className="card">
        <div className="settings-row danger" role="button" tabIndex={0} onClick={logout}>
          <span>{t('logOut')}</span>
        </div>
      </div>
    </>
  );
}
