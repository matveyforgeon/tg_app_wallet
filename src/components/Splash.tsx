import { useEffect, useState } from 'react';
import { AppMark } from '@/components/icons/AppMark';
import { useTranslation } from '@/i18n/useTranslation';

/**
 * Welcome splash (spec §6). The two animations live in CSS so they are
 * GPU-composited and share one easing curve; this component only drives the
 * timeline:
 *
 *   0.0s  logo fades + scales in over 0.9s
 *   0.6s  text reveals over 1.4s via opacity + clip-path (never width — that
 *         caused a layout-thrash hitch at the end of the reveal)
 *   2.5s  whole splash fades out over 0.5s
 *   3.0s  unmounted
 *
 * The copy is read from the already-detected language, so there is no flash of
 * English before switching.
 */

const FADE_START_MS = 2500;
const FADE_DURATION_MS = 500;

export function Splash() {
  const { t } = useTranslation();
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fadeTimer = globalThis.setTimeout(() => setFading(true), FADE_START_MS);
    const doneTimer = globalThis.setTimeout(() => setDone(true), FADE_START_MS + FADE_DURATION_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (done) return null;

  return (
    <div className={`splash${fading ? ' hide' : ''}`} aria-hidden={fading}>
      <div className="splash-row">
        <div className="splash-logo">
          <AppMark />
        </div>
        <div className="splash-text">{t('welcome')}</div>
      </div>
    </div>
  );
}
