import { useEffect, useRef } from 'react';
import styles from './Backdrop.module.css';

// One fixed, living background shared by every section. Sections declare a
// mood with data-tone; whichever one crosses the viewport's centre line tints it.
export default function Backdrop() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // Panels stacked inside the pinned (immersive) stage all overlap the
          // centre line; the stage reports its active panel instead.
          const host = el.closest('[data-immersive]');
          if (host && host !== el) return;
          root.dataset.tone = el.dataset.tone;
        });
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    document.querySelectorAll('[data-tone]').forEach((el) => observer.observe(el));

    const onTone = (event) => { root.dataset.tone = event.detail; };
    window.addEventListener('backdrop:tone', onTone);
    return () => {
      observer.disconnect();
      window.removeEventListener('backdrop:tone', onTone);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.backdrop} data-tone="hero" aria-hidden="true">
      <span className={styles.glowA} />
      <span className={styles.glowB} />
    </div>
  );
}
