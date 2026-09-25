import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './Intro.module.css';

const SEEN_KEY = 'hasan-arthur-intro-seen';
const RUN_MS = 3400;

// Cold open: a film-leader timecode, one line of title card, then the
// letterbox opens onto the hero. Pure CSS drives it, so it also finishes
// without JavaScript; JS only skips it on return visits or user input.
export default function Intro() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef(null);
  const { lang } = useTranslation();
  const en = lang === 'en';

  useLayoutEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === '1';
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // storage blocked: play the intro every time
    }
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(false);
      return undefined;
    }

    const root = rootRef.current;
    let timer = window.setTimeout(() => setVisible(false), RUN_MS);
    const skip = () => {
      root.classList.add(styles.skip);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setVisible(false), 400);
      events.forEach((type) => window.removeEventListener(type, skip));
    };
    const events = ['keydown', 'wheel', 'touchstart', 'pointerdown'];
    events.forEach((type) => window.addEventListener(type, skip, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((type) => window.removeEventListener(type, skip));
    };
  }, []);

  if (!visible) return null;

  return (
    <div ref={rootRef} className={styles.intro} data-intro aria-hidden="true">
      <div className={`${styles.curtain} ${styles.top}`} />
      <div className={`${styles.curtain} ${styles.bottom}`} />
      <div className={styles.card}>
        <p className={styles.timecode}>
          <span className={styles.counter} />
        </p>
        <p className={styles.title}>
          <span>{en ? 'House lights down.' : 'Işıklar kararıyor.'}</span>
        </p>
        <i className={styles.line} />
        <p className={styles.presents}>
          {en ? 'Hasan Arthur Altuntaş presents' : 'Hasan Arthur Altuntaş sunar'}
        </p>
      </div>
    </div>
  );
}
