import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { artistProfile, musicCatalog } from '../data/music-catalog';
import artwork from '../data/artwork.json';
import styles from './Hero.module.css';

export default function Hero() {
  const rootRef = useRef(null);
  const { lang } = useTranslation();
  const english = lang === 'en';

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(`.${styles.title} > span`, {
          yPercent: 105,
          stagger: 0.12,
          duration: 1.25,
          ease: 'power4.out',
        });
        gsap.from(`.${styles.record}`, {
          rotation: -35,
          scale: 0.85,
          opacity: 0,
          duration: 1.5,
          ease: 'power3.out',
        });
        gsap.to(`.${styles.record}`, {
          rotation: 95,
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
        gsap.fromTo(`.${styles.sleeve}`, { yPercent: 15, rotation: -12 }, {
          yPercent: -15, rotation: -4, ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 0.7 },
        });
        gsap.to(`.${styles.title}`, {
          yPercent: -18,
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="hero" ref={rootRef} className={styles.hero}>
      <div className={styles.topline}>
        <span>
          {english
            ? 'Music by Hasan Arthur Altuntaş'
            : 'Hasan Arthur Altuntaş’ın müziği'}
        </span>
        <span>
          {english ? 'Independent, by nature.' : 'Doğası gereği bağımsız.'}
        </span>
      </div>
      <h1 className={styles.title}>
        <span>Hasan</span>
        <span>
          Arthur<span className={styles.period}>.</span>
        </span>
      </h1>
      <div className={styles.recordStage} aria-hidden="true">
        <div className={styles.sleeve}>
          <img src={artwork[musicCatalog[0].spotifyUrl]} alt="" width="600" height="600" fetchPriority="high" />
        </div>
        <div className={styles.record}>
          <div className={styles.recordLabel}>
            <img src="/assets/images/logo-transparent.png" alt="" width="140" height="140" />
            <span>Hasan Arthur Altuntaş</span>
            <i />
          </div>
        </div>
      </div>
      <div className={styles.bottomline}>
        <p>
          {english
            ? 'Music for the worlds you haven’t seen yet.'
            : 'Henüz görmediğin dünyaların müziği.'}
        </p>
        <a
          className={styles.listen}
          href={artistProfile.spotifyUrl}
          target="_blank"
          rel="noreferrer"
        >
          {english ? 'Listen on Spotify' : 'Spotify’da dinle'}
          <ArrowUpRight size={19} />
        </a>
        <a className={styles.explore} href="#project-list">
          {english ? 'Explore the records' : 'Kayıtları keşfet'}
          <ArrowDown size={19} />
        </a>
      </div>
    </section>
  );
}
