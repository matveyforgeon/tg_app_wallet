import type { en } from './en';

export const LANGS = ['en', 'ru'] as const;
export type Lang = (typeof LANGS)[number];

/** Every locale must implement exactly the keys declared in `en`. */
export type StringKey = keyof typeof en;
export type Strings = Record<StringKey, string>;

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value);
}
