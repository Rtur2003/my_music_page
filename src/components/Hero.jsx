import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowDown, ArrowUpRight, Play } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { artistProfile, coverArt } from '../data/music-catalog';
import { useReleases } from '../data/ReleasesContext';
import { usePlayer } from '../player/PlayerContext';
import styles from './Hero.module.css';

export default function Hero() {
  const rootRef = useRef(null);
  const { lang } = useTranslation();
  const english = lang === 'en';
  // The sleeve and the main call to action always point at the newest release.
  const latest = useReleases().releases[0];
  const { play } = usePlayer();
  const latestKind = { album: english ? 'album' : 'albüm', ep: 'EP', single: 'single' }[latest.type];

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
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
    <section id="hero" ref={rootRef} className={styles.hero} data-tone="hero">
      <div className={styles.topline}>
        <span>{english ? 'Composer · Pianist · Producer' : 'Besteci · Piyanist · Prodüktör'}</span>
        <a href={artistProfile.spotifyUrl} target="_blank" rel="noopener">
          {english ? 'Hasan Arthur on Spotify' : 'Spotify’da Hasan Arthur'}
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
      <h1 className={styles.title}>
        <span>Hasan</span>{' '}
        <span>
          Arthur<span className={styles.period}>.</span>
        </span>
        <small className="sr-only">
          {english
            ? ' Altuntaş, composer of cinematic music for film and games'
            : ' Altuntaş, sinematik film ve oyun müziği bestecisi'}
        </small>
      </h1>
      <div className={styles.recordStage} aria-hidden="true">
        <div className={styles.sleeve}>
          <img src={coverArt(latest, true)} alt="" width="640" height="640" fetchPriority="high" decoding="async" />
        </div>
        <div className={styles.record}>
          <div className={styles.recordLabel}>
            <img src="/assets/images/logo-mark.webp" alt="" width="105" height="140" loading="lazy" />
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
        <button type="button" className={styles.listen} onClick={() => play(latest)}>
          <Play size={17} aria-hidden="true" />
          <span className={styles.listenKicker}>{english ? `New ${latestKind}` : `Yeni ${latestKind}`}</span>
          {latest.title}
        </button>
        <a className={styles.explore} href="#project-list">
          {english ? 'Explore the records' : 'Kayıtları keşfet'}
          <ArrowDown size={19} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
