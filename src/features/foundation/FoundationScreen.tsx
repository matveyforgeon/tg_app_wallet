import { env } from '@/config/env';
import { useTranslation } from '@/i18n/useTranslation';
import { useSettingsStore } from '@/store/settingsStore';
import { toast } from '@/store/uiStore';
import { getTelegramUser, haptics, isTelegramEnv } from '@/telegram/telegram';

/**
 * Temporary Phase 1 screen.
 *
 * It exists to make the foundation reviewable against the mockup: it renders
 * the balance hero (glass + sheen), the quick-action row (Receive / Send / Buy
 * — no Swap button, per spec §10) and a settings card wired to the real,
 * persisted settings store. Phase 2 replaces it with the four tab screens.
 */
export function FoundationScreen() {
  const { t, lang } = useTranslation();
  const theme = useSettingsStore((state) => state.theme);
  const toggleTheme = useSettingsStore((state) => state.toggleTheme);
  const baseCurrency = useSettingsStore((state) => state.baseCurrency);

  const telegramUser = getTelegramUser();
  const notYet = () => {
    haptics.impact('light');
    toast.info(t('comingSoon'));
  };

  return (
    <>
      <div className="balance-hero">
        <div className="balance-label">{t('totalBalance')}</div>
        {/* No holdings are wired until Phase 3 — this is a real zero, not a mock. */}
        <div className="balance-value">$0.00</div>
        <div className="balance-sub">▲ +0.0% {t('today')}</div>
        <div className="action-row">
          <button type="button" className="action-btn" onClick={notYet}>
            ↓<span>{t('receive')}</span>
          </button>
          <button type="button" className="action-btn" onClick={notYet}>
            ↑<span>{t('send')}</span>
          </button>
          <button type="button" className="action-btn" onClick={notYet}>
            ＋<span>{t('buy')}</span>
          </button>
        </div>
      </div>

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
          <span className="chev">{baseCurrency}</span>
        </div>
        <div className="settings-row">
          <span>{t('language')}</span>
          <span style={{ color: 'var(--text-dim)' }}>{t('langLabel')}</span>
        </div>
      </div>

      <div className="section-title">{t('account')}</div>
      <div className="card">
        <div className="settings-row">
          <span>Telegram</span>
          <span style={{ color: 'var(--text-dim)' }}>
            {isTelegramEnv() ? (telegramUser?.username ?? telegramUser?.firstName ?? 'ok') : 'browser'}
          </span>
        </div>
        <div className="settings-row">
          <span>{t('language')} (auto)</span>
          <span style={{ color: 'var(--text-dim)' }}>
            {telegramUser?.languageCode ?? globalThis.navigator?.language ?? '—'} → {lang}
          </span>
        </div>
        <div className="settings-row">
          <span>{t('appVersion')}</span>
          <span style={{ color: 'var(--text-dim)' }}>{env.appVersion}</span>
        </div>
      </div>

      <div className="hint">Phase 1 — foundation. Tab bar, splash and screens land in Phase 2.</div>
    </>
  );
}
