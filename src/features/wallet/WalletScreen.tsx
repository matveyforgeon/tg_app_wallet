import { AssetIcon } from '@/components/icons/AssetIcons';
import { findCrypto } from '@/data/cryptoCatalog';
import { usePortfolioTotals } from '@/hooks/usePortfolioTotals';
import { useTranslation } from '@/i18n/useTranslation';
import { fmtAmount, fmtChange, fmtMoney } from '@/lib/format';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useCryptoChange, useCryptoRate, useRatesStore } from '@/store/ratesStore';
import { useSheetStore, type SheetId } from '@/store/sheetStore';
import { haptics } from '@/telegram/telegram';

/**
 * Wallet tab. Quick actions are Receive / Send / Buy only — Swap has its own
 * tab and deliberately has no entry point here (spec §10).
 *
 * The sheets themselves are rendered by `SheetHost` at shell level, not here.
 */
export function WalletScreen() {
  const { t } = useTranslation();
  const openSheet = useSheetStore((state) => state.open);

  const holdings = usePortfolioStore((state) => state.crypto);
  const { totalInBase, baseSymbol, change24h } = usePortfolioTotals();
  const cryptoRate = useCryptoRate();
  const cryptoChange = useCryptoChange();
  const usingFallback = useRatesStore((state) => state.usingFallback);

  const open = (sheet: SheetId) => {
    haptics.impact('light');
    openSheet(sheet);
  };

  return (
    <>
      <div className="balance-hero">
        <div className="balance-label">{t('totalBalance')}</div>
        <div className="balance-value">
          {baseSymbol}
          {fmtMoney(totalInBase)}
        </div>
        <div className={`balance-sub${change24h < 0 ? ' down' : ''}`}>
          {change24h < 0 ? '▼' : '▲'} {fmtChange(change24h)} {t('today')}
        </div>
        <div className="action-row">
          <button type="button" className="action-btn" onClick={() => open('receive')}>
            ↓<span>{t('receive')}</span>
          </button>
          <button type="button" className="action-btn" onClick={() => open('send')}>
            ↑<span>{t('send')}</span>
          </button>
          <button type="button" className="action-btn" onClick={() => open('buy')}>
            ＋<span>{t('buy')}</span>
          </button>
        </div>
      </div>

      <div className="section-title">{t('yourAssets')}</div>
      {holdings.length === 0 ? (
        <div className="hint">{t('noAssetsHint')}</div>
      ) : (
        <div className="card">
          {holdings.map((holding) => {
            const asset = findCrypto(holding.code);
            if (!asset) return null;
            const change = cryptoChange(holding.code);
            return (
              <div className="list-item" key={holding.code}>
                <div className="token-left">
                  <div className="token-icon" style={{ background: asset.bg }}>
                    <AssetIcon code={asset.code} />
                  </div>
                  <div>
                    <div className="token-name">{asset.name}</div>
                    <div className="token-sub">
                      {fmtAmount(holding.amount)} {asset.code}
                    </div>
                  </div>
                </div>
                <div className="token-right">
                  <div className="token-value">${fmtMoney(holding.amount * cryptoRate(holding.code))}</div>
                  <div className={change >= 0 ? 'token-change-up' : 'token-change-down'}>
                    {fmtChange(change)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {usingFallback ? <div className="hint error">{t('ratesOffline')}</div> : null}
    </>
  );
}
