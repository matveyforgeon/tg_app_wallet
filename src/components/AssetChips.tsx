import { AssetIcon } from '@/components/icons/AssetIcons';
import { quickAssetCodes } from '@/data/cryptoCatalog';
import { haptics } from '@/telegram/telegram';

interface AssetChipsProps {
  selected: string;
  onSelect: (code: string) => void;
}

/** Quick-select chip row shared by the Receive, Send and Buy/Sell sheets. */
export function AssetChips({ selected, onSelect }: AssetChipsProps) {
  return (
    <div className="chip-row">
      {quickAssetCodes.map((code) => (
        <button
          key={code}
          type="button"
          className={`chip${code === selected ? ' active' : ''}`}
          onClick={() => {
            if (code === selected) return;
            haptics.select();
            onSelect(code);
          }}
          aria-pressed={code === selected}
        >
          <AssetIcon code={code} />
          <span>{code}</span>
        </button>
      ))}
    </div>
  );
}
