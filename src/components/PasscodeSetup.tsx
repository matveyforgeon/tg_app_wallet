import { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { PASSCODE_LENGTH, passcodeSupported } from '@/lib/passcode';
import { usePasscodeStore } from '@/store/passcodeStore';
import { toast } from '@/store/uiStore';
import { haptics } from '@/telegram/telegram';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'] as const;

interface PasscodeSetupProps {
  onDone: () => void;
  onCancel: () => void;
}

/** Two-step passcode creation: enter, then repeat to confirm. */
export function PasscodeSetup({ onDone, onCancel }: PasscodeSetupProps) {
  const { t } = useTranslation();
  const setPasscode = usePasscodeStore((state) => state.setPasscode);

  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [shake, setShake] = useState(false);

  const entered = confirming ? second : first;

  useEffect(() => {
    if (!confirming && first.length === PASSCODE_LENGTH) {
      setConfirming(true);
      return;
    }
    if (!confirming || second.length !== PASSCODE_LENGTH) return;

    if (first !== second) {
      haptics.notify('error');
      toast.error(t('passcodeMismatch'));
      setShake(true);
      globalThis.setTimeout(() => setShake(false), 400);
      setFirst('');
      setSecond('');
      setConfirming(false);
      return;
    }

    void (async () => {
      try {
        await setPasscode(first);
        haptics.notify('success');
        toast.success(t('passcodeSet'));
        onDone();
      } catch {
        toast.error(t('passcodeUnsupported'));
        onCancel();
      }
    })();
  }, [first, second, confirming, setPasscode, onDone, onCancel, t]);

  const press = (key: string) => {
    if (key === '') return;
    haptics.select();
    const update = confirming ? setSecond : setFirst;
    if (key === '⌫') {
      update((prev) => prev.slice(0, -1));
      return;
    }
    update((prev) => (prev.length >= PASSCODE_LENGTH ? prev : prev + key));
  };

  if (!passcodeSupported()) {
    return (
      <div className="passcode-box">
        <div className="confirm-message">{t('passcodeUnsupported')}</div>
        <button type="button" className="confirm-btn confirm-cancel" onClick={onCancel}>
          {t('cancel')}
        </button>
      </div>
    );
  }

  return (
    <div className="passcode-box">
      <div className="confirm-title">{confirming ? t('passcodeRepeat') : t('passcodeCreate')}</div>
      <div className="confirm-message">{t('passcodeHint')}</div>

      <div className={`passcode-dots${shake ? ' shake' : ''}`}>
        {Array.from({ length: PASSCODE_LENGTH }, (_, i) => (
          <span key={i} className={`passcode-dot${i < entered.length ? ' filled' : ''}`} />
        ))}
      </div>

      <div className="passcode-keys">
        {KEYS.map((key, i) => (
          <button
            key={i}
            type="button"
            className={`passcode-key${key === '' ? ' passcode-key-empty' : ''}`}
            onClick={() => press(key)}
            disabled={key === ''}
            aria-label={key || undefined}
          >
            {key}
          </button>
        ))}
      </div>

      <button type="button" className="confirm-btn confirm-cancel passcode-cancel" onClick={onCancel}>
        {t('cancel')}
      </button>
    </div>
  );
}
