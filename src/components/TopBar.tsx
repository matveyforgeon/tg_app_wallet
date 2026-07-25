import { useTranslation } from '@/i18n/useTranslation';
import { useSettingsStore } from '@/store/settingsStore';
import { haptics } from '@/telegram/telegram';
import type { Lang } from '@/i18n/types';

interface TopBarProps {
  title: string;
}

/** Screen title plus the always-available manual EN/RU toggle (spec §5). */
export function TopBar({ title }: TopBarProps) {
  const { lang } = useTranslation();
  const switchLang = useSettingsStore((state) => state.switchLang);

  const pick = (next: Lang) => {
    if (next === lang) return;
    haptics.select();
    switchLang(next);
  };

  return (
    <div className="topbar">
      <h1>{title}</h1>
      <div className="lang-toggle">
        <button
          type="button"
          className={lang === 'en' ? 'active' : ''}
          onClick={() => pick('en')}
          aria-pressed={lang === 'en'}
        >
          EN
        </button>
        <button
          type="button"
          className={lang === 'ru' ? 'active' : ''}
          onClick={() => pick('ru')}
          aria-pressed={lang === 'ru'}
        >
          RU
        </button>
      </div>
    </div>
  );
}
