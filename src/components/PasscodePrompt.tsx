import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { PASSCODE_LENGTH } from '@/lib/passcode';
import { usePasscodePrompt } from '@/store/passcodePromptStore';
import { usePasscodeStore } from '@/store/passcodeStore';
import { useSettingsStore } from '@/store/settingsStore';
import { toast } from '@/store/uiStore';
import { biometrics, haptics } from '@/telegram/telegram';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'] as const;

/**
 * Passcode entry for authorising a send.
 *
 * When Biometric lock is on, the prompt still appears but immediately attempts
 * Face ID / Touch ID in the background — a successful scan dismisses it without
 * any typing, and a cancelled or failed scan simply leaves the keypad ready.
 * That is the behaviour asked for: biometrics as the fast path, the code as the
 * always-available fallback.
 */
export function PasscodePrompt() {
  const { t } = useTranslation();
  const open = usePasscodePrompt((state) => state.open);
  const reason = usePasscodePrompt((state) => state.reason);
  const onSuccess = usePasscodePrompt((state) => state.onSuccess);
  const close = usePasscodePrompt((state) => state.close);
  const verify = usePasscodeStore((state) => state.verify);
  const biometricEnabled = useSettingsStore((state) => state.biometric);

  const [entered, setEntered] = useState('');
  const [shake, setShake] = useState(false);
  const [checking, setChecking] = useState(false);
  // Guards against the biometric prompt firing twice under StrictMode.
  const biometricTried = useRef(false);

  const succeed = useCallback(() => {
    const callback = onSuccess;
    close();
    setEntered('');
    haptics.notify('success');
    callback?.();
  }, [onSuccess, close]);

  useEffect(() => {
    if (!open) {
      setEntered('');
      biometricTried.current = false;
      return;
    }
    if (!biometricEnabled || biometricTried.current) return;
    biometricTried.current = true;
    void (async () => {
      const ok = await biometrics.authenticate(reason);
      // A refusal is not an error — the keypad is still there.
      if (ok) succeed();
    })();
  }, [open, biometricEnabled, reason, succeed]);

  useEffect(() => {
    if (entered.length !== PASSCODE_LENGTH || checking) return;
    setChecking(true);
    void (async () => {
      const ok = await verify(entered);
      setChecking(false);
      if (ok) {
        succeed();
        return;
      }
      haptics.notify('error');
      setShake(true);
      setEntered('');
      globalThis.setTimeout(() => setShake(false), 400);
      toast.error(t('passcodeWrong'));
    })();
  }, [entered, checking, verify, succeed, t]);

  if (!open) return null;

  const press = (key: string) => {
    if (key === '') return;
    haptics.select();
    if (key === '⌫') {
      setEntered((prev) => prev.slice(0, -1));
      return;
    }
    setEntered((prev) => (prev.length >= PASSCODE_LENGTH ? prev : prev + key));
  };

  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true" aria-label={t('passcodeTitle')}>
      <div className="confirm-box passcode-box">
        <div className="confirm-title">{t('passcodeTitle')}</div>
        <div className="confirm-message">{reason}</div>

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

        <button
          type="button"
          className="confirm-btn confirm-cancel passcode-cancel"
          onClick={() => {
            close();
            setEntered('');
          }}
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
}
