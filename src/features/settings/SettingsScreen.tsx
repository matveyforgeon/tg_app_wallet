import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { PhaseNote } from '@/components/PhaseNote';
import { env } from '@/config/env';
import { useTranslation } from '@/i18n/useTranslation';
import { shortenAddress } from '@/lib/format';
import { confirm } from '@/store/confirmStore';
import { useSettingsStore } from '@/store/settingsStore';
import { toast } from '@/store/uiStore';
import { haptics } from '@/telegram/telegram';

/**
 * Settings tab. Phase 6 builds the full screen against the spec's status table;
 * for now it carries what is already real — Dark mode, the language readout,
 * and the TON Connect wallet connection.
 */
export function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useSettingsStore((state) => state.theme);
  const toggleTheme = useSettingsStore((state) => state.toggleTheme);
  const baseCurrency = useSettingsStore((state) => state.baseCurrency);

  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();

  const onWalletRow = () => {
    haptics.impact('light');
    if (!address) {
      void tonConnectUI.openModal();
      return;
    }
    // Disconnecting drops the only real balance in the app, so it is confirmed.
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

  return (
    <>
      <div className="section-title">{t('preferences')}</div>
      <div className="card">
        <div className="settings-row">
          <span>{t('darkMode')}</span>
          <button
            type="button"
            className={`switch${theme === 'dark' ? ' on' : ''}`}
            onClick={() => {
              haptics.select();
              toggleTheme();
            }}
            aria-pressed={theme === 'dark'}
            aria-label={t('darkMode')}
          >
            <span className="switch-dot" />
          </button>
        </div>
        <div className="settings-row">
          <span>{t('baseCurrency')}</span>
          <span className="chev">{baseCurrency} ›</span>
        </div>
      </div>

      <div className="section-title">{t('account')}</div>
      <div className="card">
        <div className="settings-row" onClick={onWalletRow} role="button" tabIndex={0}>
          <span>{t('connectedWallet')}</span>
          <span style={{ color: address ? 'var(--text-dim)' : 'var(--holo-2)' }}>
            {address ? shortenAddress(address) : t('connectWallet')} ›
          </span>
        </div>
        <div className="settings-row">
          <span>{t('language')}</span>
          <span style={{ color: 'var(--text-dim)' }}>{t('langLabel')}</span>
        </div>
        <div className="settings-row">
          <span>{t('appVersion')}</span>
          <span style={{ color: 'var(--text-dim)' }}>{env.appVersion}</span>
        </div>
      </div>

      <div className="section-title">{t('security')}</div>
      <PhaseNote>Phase 6 — full settings screen per the spec's status table</PhaseNote>
    </>
  );
}
