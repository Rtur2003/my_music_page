import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './Preloader.module.css';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const rootRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 1,
          ease: 'power4.inOut',
          onComplete,
        });
      },
    });

    const dummy = { p: 0 };
    tl.to(dummy, {
      p: 100,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => setProgress(Math.round(dummy.p)),
    });
  }, [onComplete]);

  return (
    <div ref={rootRef} className={styles.preloader}>
      <div className={styles.mark}>
        <span className={`${styles.progress} font-display`}>{progress}</span>
        <span className={styles.percent}>%</span>
      </div>
      <div className={`${styles.label} font-mono`}>loading_experience()</div>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
    </div>
  );
}
