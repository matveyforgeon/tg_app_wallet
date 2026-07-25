import { useMemo, useState } from 'react';
import { BottomSheet } from '@/components/BottomSheet';
import { fiatCatalog } from '@/data/fiatCatalog';
import { useTranslation } from '@/i18n/useTranslation';
import { usePortfolioStore } from '@/store/portfolioStore';
import { haptics } from '@/telegram/telegram';

interface AddCurrencySheetProps {
  onClose: () => void;
}

/** Searchable picker for the currencies not already on the Bank tab (spec §3). */
export function AddCurrencySheet({ onClose }: AddCurrencySheetProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const owned = usePortfolioStore((state) => state.fiat);
  const addFiat = usePortfolioStore((state) => state.addFiat);

  const results = useMemo(() => {
    const ownedCodes = new Set(owned.map((balance) => balance.code));
    const q = query.trim().toLowerCase();
    return fiatCatalog
      .filter((currency) => !ownedCodes.has(currency.code))
      .filter(
        (currency) =>
          !q || currency.code.toLowerCase().includes(q) || currency.name.toLowerCase().includes(q),
      );
  }, [owned, query]);

  return (
    <BottomSheet title={t('addCurrencyTitle')} onClose={onClose}>
      <input
        className="picker-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('searchPlaceholder')}
        autoComplete="off"
      />
      <div className="picker-list">
        {results.length === 0 ? (
          <div className="picker-empty">{t('nothingFound')}</div>
        ) : (
          results.map((currency) => (
            <button
              key={currency.code}
              type="button"
              className="picker-item"
              onClick={() => {
                haptics.select();
                // New balances start at 0 (spec §3).
                addFiat(currency.code);
                onClose();
              }}
            >
              <span className="flag">{currency.flag}</span>
              <div>
                <div className="picker-item-name">{currency.code}</div>
                <div className="picker-item-sub">{currency.name}</div>
              </div>
            </button>
          ))
        )}
      </div>
    </BottomSheet>
  );
}
