import type { StringKey } from '@/i18n/types';
import type { TabId } from '@/store/uiStore';

/** Copy keys for each tab's bar label and top-bar screen title. */
export const TAB_LABEL_KEY: Record<TabId, StringKey> = {
  wallet: 'tabWallet',
  bank: 'tabBank',
  swap: 'tabSwap',
  settings: 'tabSettings',
};

export const TAB_TITLE_KEY: Record<TabId, StringKey> = {
  wallet: 'titleWallet',
  bank: 'titleBank',
  swap: 'titleSwap',
  settings: 'titleSettings',
};
