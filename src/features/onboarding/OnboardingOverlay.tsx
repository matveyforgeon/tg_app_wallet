import { useState } from 'react';
import { PasscodeSetup } from '@/components/PasscodeSetup';
import { AppMark } from '@/components/icons/AppMark';
import { TAB_ICON } from '@/components/icons/TabIcons';
import { useTranslation } from '@/i18n/useTranslation';
import { readJson, writeJson } from '@/lib/storage';
import { haptics } from '@/telegram/telegram';
import type { StringKey } from '@/i18n/types';
import type { TabId } from '@/store/uiStore';

const STORAGE_KEY = 'onboarded';

export function hasOnboarded(): boolean {
  return readJson<boolean>(STORAGE_KEY, false) === true;
}

function markOnboarded(): void {
  writeJson(STORAGE_KEY, true);
}

interface Step {
  titleKey: StringKey;
  bodyKey: StringKey;
  /** Which tab icon to show; the intro step uses the app mark instead. */
  tab?: TabId;
}

/** One step per block of the app, then the passcode offer (spec §10-safe). */
const STEPS: readonly Step[] = [
  { titleKey: 'onboardWelcomeTitle', bodyKey: 'onboardWelcomeBody' },
  { titleKey: 'onboardWalletTitle', bodyKey: 'onboardWalletBody', tab: 'wallet' },
  { titleKey: 'onboardBankTitle', bodyKey: 'onboardBankBody', tab: 'bank' },
  { titleKey: 'onboardSwapTitle', bodyKey: 'onboardSwapBody', tab: 'swap' },
  { titleKey: 'onboardSecurityTitle', bodyKey: 'onboardSecurityBody', tab: 'settings' },
];

interface OnboardingOverlayProps {
  onFinish: () => void;
}

/**
 * First-launch tour. Walks the four blocks, then offers a send passcode.
 *
 * The passcode is offered, never forced, and it is explicitly not an app-entry
 * lock — spec §10 forbids that. Declining leaves the wallet fully usable and
 * the offer available later in Settings.
 */
export function OnboardingOverlay({ onFinish }: OnboardingOverlayProps) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [settingPasscode, setSettingPasscode] = useState(false);

  const finish = () => {
    markOnboarded();
    onFinish();
  };

  if (settingPasscode) {
    return (
      <div className="onboard-overlay">
        <PasscodeSetup onDone={finish} onCancel={() => setSettingPasscode(false)} />
      </div>
    );
  }

  const step = STEPS[index];
  if (!step) return null;
  const isLast = index === STEPS.length - 1;
  const Icon = step.tab ? TAB_ICON[step.tab] : null;

  const next = () => {
    haptics.impact('light');
    setIndex((prev) => prev + 1);
  };

  return (
    <div className="onboard-overlay">
      <div className="onboard-card">
        <div className="onboard-icon">{Icon ? <Icon /> : <AppMark />}</div>

        <div className="onboard-title">{t(step.titleKey)}</div>
        <div className="onboard-body">{t(step.bodyKey)}</div>

        <div className="onboard-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={`onboard-dot${i === index ? ' active' : ''}`} />
          ))}
        </div>

        {isLast ? (
          <div className="onboard-actions">
            <button
              type="button"
              className="confirm-btn confirm-cancel"
              onClick={() => {
                haptics.impact('light');
                finish();
              }}
            >
              {t('onboardLater')}
            </button>
            <button
              type="button"
              className="confirm-btn confirm-ok"
              onClick={() => {
                haptics.impact('medium');
                setSettingPasscode(true);
              }}
            >
              {t('onboardSetPasscode')}
            </button>
          </div>
        ) : (
          <>
            <button type="button" className="primary-btn" onClick={next}>
              {index === 0 ? t('onboardStart') : t('onboardNext')}
            </button>
            <button type="button" className="onboard-skip" onClick={finish}>
              {t('onboardSkip')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
