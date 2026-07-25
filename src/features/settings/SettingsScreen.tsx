import { PhaseNote } from '@/components/PhaseNote';
import { env } from '@/config/env';
import { useTranslation } from '@/i18n/useTranslation';
import { useSettingsStore } from '@/store/settingsStore';
import { haptics } from '@/telegram/telegram';

/**
 * Settings tab. Phase 6 builds the full screen against the spec's status table;
 * for now it carries the two settings that are already real — Dark mode and the
 * language readout — so navigation reviews against live state.
 */
export function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useSettingsStore((state) => state.theme);
  const toggleTheme = useSettingsStore((state) => state.toggleTheme);
  const baseCurrency = useSettingsStore((state) => state.baseCurrency);

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
