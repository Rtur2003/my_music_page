import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowDown } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './Hero.module.css';

const WAVE_HEIGHTS = [22, 40, 30, 58, 38, 48, 28, 44, 24, 36, 20];

export default function Hero() {
  const rootRef = useRef(null);
  const { t } = useTranslation();

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });

    tl.from(`.${styles.eyebrow}`, { y: 20, opacity: 0, duration: 0.7 })
      .from(`.${styles.titleLine}`, {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
      }, '-=0.35')
      .from(`.${styles.role}`, { y: 24, opacity: 0, duration: 0.8 }, '-=0.6')
      .from(`.${styles.lede}`, { y: 20, opacity: 0, duration: 0.8 }, '-=0.55')
      .from(`.${styles.statCard}`, { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.5')
      .from(`.${styles.actions} > *`, { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.45')
      .from(`.${styles.seal}`, { scale: 0.85, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.9')
      .from(`.${styles.waveBar}`, { scaleY: 0, opacity: 0, duration: 0.6, stagger: 0.03, ease: 'power2.out' }, '-=0.5');

    gsap.to(`.${styles.waveBar}`, {
      scaleY: 0.5,
      duration: 1,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.09, from: 'center' },
      delay: 2,
    });
  }, { scope: rootRef });

  return (
    <section id="hero" ref={rootRef} className={styles.hero}>
      <div className={`${styles.grid} container`}>
        <div className={styles.copy}>
          <span className={`${styles.eyebrow} eyebrow`}>Hasan Arthur Altuntaş</span>

          <h1 className={`${styles.title} font-display`}>
            <span className={styles.titleLineWrap}><span className={styles.titleLine}>{t('hero.titleLine1')}</span></span>
            <span className={styles.titleLineWrap}><span className={styles.titleLine}>{t('hero.titleLine2')}</span></span>
            <span className={styles.titleLineWrap}><span className={styles.titleLine}>{t('hero.titleLine3')}</span></span>
          </h1>

          <p className={`${styles.role} font-mono`}>{t('hero.role')}</p>

          <p className={`${styles.lede} font-editorial`}>
            {t('hero.lede')}
          </p>

          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span className={`${styles.statValue} font-display`}>12</span>
              <span className={styles.statLabel}>{t('hero.statPublications')}</span>
            </div>
            <div className={styles.statCard}>
              <span className={`${styles.statValue} font-display`}>952</span>
              <span className={styles.statLabel}>{t('hero.statFollowers')}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <a href="#project-list" className={styles.primaryCta}>
              <span>{t('hero.ctaListen')}</span>
              <span className={styles.ctaIcon}><ArrowDown size={16} /></span>
            </a>
            <a href="#about" className={styles.secondaryCta}>
              {t('hero.ctaAbout')}
            </a>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.sealRing} aria-hidden="true" />
          <div className={styles.seal}>
            <img
              src="/assets/images/logo-transparent.png"
              alt="Hasan Arthur Altuntaş — CrownCode emblem"
              className={styles.sealMark}
            />
            <span className={`${styles.sealCaption} font-mono`}>{t('hero.sealCaption')}</span>
          </div>

          <div className={styles.waveform} role="img" aria-label="Audio waveform visual">
            {WAVE_HEIGHTS.map((h, i) => (
              <span
                key={i}
                className={styles.waveBar}
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.grain} aria-hidden="true" />
    </section>
  );
}
