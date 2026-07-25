import { useSettingsStore } from '@/store/settingsStore';
import { en } from './en';
import { ru } from './ru';
import type { Lang, StringKey, Strings } from './types';

const dictionaries: Record<Lang, Strings> = { en, ru };

export interface Translation {
  lang: Lang;
  /** Look up a copy string in the active language. */
  t: (key: StringKey) => string;
  strings: Strings;
}

export function useTranslation(): Translation {
  const lang = useSettingsStore((state) => state.lang);
  const strings = dictionaries[lang];
  return {
    lang,
    strings,
    t: (key) => strings[key],
  };
}

/** Non-hook lookup for services and event handlers outside the React tree. */
export function translate(key: StringKey): string {
  return dictionaries[useSettingsStore.getState().lang][key];
}
