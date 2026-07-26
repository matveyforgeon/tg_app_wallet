import { TAB_ICON } from '@/components/icons/TabIcons';
import { useTranslation } from '@/i18n/useTranslation';
import { TAB_LABEL_KEY } from '@/lib/tabs';
import { haptics } from '@/telegram/telegram';
import { TAB_ORDER, useUiStore } from '@/store/uiStore';

/**
 * Bottom tab bar. Order is fixed by spec §10 — Wallet, Bank, Swap, Settings —
 * and there is deliberately no Swap entry point in Wallet's quick actions.
 */
export function TabBar() {
  const { t } = useTranslation();
  const activeTab = useUiStore((state) => state.activeTab);
  const setTab = useUiStore((state) => state.setTab);

  return (
    <nav className="tabbar">
      {TAB_ORDER.map((tab) => {
        const Icon = TAB_ICON[tab];
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            className={`tab${isActive ? ' active' : ''}`}
            onClick={() => {
              if (isActive) return;
              haptics.select();
              setTab(tab);
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="tab-icon">
              <Icon />
            </span>
            <span>{t(TAB_LABEL_KEY[tab])}</span>
          </button>
        );
      })}
    </nav>
  );
}
