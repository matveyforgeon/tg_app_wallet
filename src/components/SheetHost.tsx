import { AddCurrencySheet } from '@/features/bank/AddCurrencySheet';
import { CreateCardSheet } from '@/features/bank/CreateCardSheet';
import { BaseCurrencySheet } from '@/features/settings/BaseCurrencySheet';
import { BuySheet } from '@/features/wallet/BuySheet';
import { ReceiveSheet } from '@/features/wallet/ReceiveSheet';
import { SendSheet } from '@/features/wallet/SendSheet';
import { useSheetStore } from '@/store/sheetStore';

/**
 * Renders the active bottom sheet as a sibling of `.content`, so its overlay
 * stacks above the tab bar. See the note in `sheetStore`.
 *
 * Sheets are mounted only while open. Keeping them mounted-but-hidden would run
 * their effects continuously — the Buy sheet would fetch its price history at
 * app start and never use it, wasting a CoinGecko request against a tight rate
 * limit.
 */
export function SheetHost() {
  const active = useSheetStore((state) => state.active);
  const close = useSheetStore((state) => state.close);

  switch (active) {
    case 'receive':
      return <ReceiveSheet onClose={close} />;
    case 'send':
      return <SendSheet onClose={close} />;
    case 'buy':
      return <BuySheet onClose={close} />;
    case 'createCard':
      return <CreateCardSheet onClose={close} />;
    case 'addCurrency':
      return <AddCurrencySheet onClose={close} />;
    case 'baseCurrency':
      return <BaseCurrencySheet onClose={close} />;
    default:
      return null;
  }
}
