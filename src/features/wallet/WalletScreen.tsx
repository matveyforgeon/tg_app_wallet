import { PhaseNote } from '@/components/PhaseNote';
import { useTranslation } from '@/i18n/useTranslation';
import { toast } from '@/store/uiStore';
import { haptics } from '@/telegram/telegram';

/**
 * Wallet tab. Quick actions are Receive / Send / Buy only — Swap has its own
 * tab and deliberately has no entry point here (spec §10).
 *
 * Phase 3 wires the hero total to live holdings and opens the real sheets.
 */
export function WalletScreen() {
  const { t } = useTranslation();

  const notYet = () => {
    haptics.impact('light');
    toast.info(t('comingSoon'));
  };

  return (
    <>
      <div className="balance-hero">
        <div className="balance-label">{t('totalBalance')}</div>
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

      <div className="section-title">{t('yourAssets')}</div>
      <PhaseNote>Phase 3 — TON Connect, live CoinGecko prices, asset list</PhaseNote>
    </>
  );
}
