import { BottomSheet } from '@/components/BottomSheet';
import { baseCurrencyCodes, findFiat } from '@/data/fiatCatalog';
import { useTranslation } from '@/i18n/useTranslation';
import { useSettingsStore } from '@/store/settingsStore';
import { haptics } from '@/telegram/telegram';

interface BaseCurrencySheetProps {
  onClose: () => void;
}

/**
 * Base-currency picker (spec §3, Settings). Changing it re-denominates the
 * Wallet hero total immediately — `usePortfolioTotals` divides by this
 * currency's live FX rate.
 */
export function BaseCurrencySheet({ onClose }: BaseCurrencySheetProps) {
  const { t } = useTranslation();
  const baseCurrency = useSettingsStore((state) => state.baseCurrency);
  const setBaseCurrency = useSettingsStore((state) => state.setBaseCurrency);

  return (
    <BottomSheet title={t('baseCurrency')} onClose={onClose}>
      <div className="picker-list">
        {baseCurrencyCodes.map((code) => {
          const currency = findFiat(code);
          if (!currency) return null;
          return (
            <button
              key={code}
              type="button"
              className={`picker-item${code === baseCurrency ? ' active' : ''}`}
              onClick={() => {
                haptics.select();
                setBaseCurrency(code);
                onClose();
              }}
              aria-pressed={code === baseCurrency}
            >
              <span className="flag">{currency.flag}</span>
              <div>
                <div className="picker-item-name">{currency.code}</div>
                <div className="picker-item-sub">{currency.name}</div>
              </div>
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
