import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { artistProfile, coverArt, yearRange } from '../data/music-catalog';
import { useReleases } from '../data/ReleasesContext';
import { usePlayer } from '../player/PlayerContext';
import Turntable from './Turntable';
import styles from './Hero.module.css';

// Turkish ablative after a year, by how the number is read aloud: 2023’ten, 2026’dan, 2030’dan.
const LAST_DIGIT = ['', 'den', 'den', 'ten', 'ten', 'ten', 'dan', 'den', 'den', 'dan'];
const TENS = ['den', 'dan', 'den', 'dan', 'tan', 'den', 'tan', 'ten', 'den', 'dan'];
const since = (year) => LAST_DIGIT[year % 10] || TENS[Math.floor(year / 10) % 10];

// Rendered width of the sleeve (Hero.module.css); seo.js preloads the same candidate.
const SLEEVE_SIZES = '(max-width: 800px) 50vw, 29vw';

export default function Hero() {
  const rootRef = useRef(null);
  const { lang } = useTranslation();
  const english = lang === 'en';
  // The sleeve and the main call to action always point at the newest release.
  const { releases } = useReleases();
  const latest = releases[0];
  const first = yearRange(releases)?.[0];
  const { release, playing, play } = usePlayer();
  // The turntable holds whatever is playing; at rest, the newest release.
  const onDeck = release ?? latest;
  const latestPlaying = playing && release?.id === latest.id;
  const latestKind = { album: english ? 'album' : 'albüm', ep: 'EP', single: 'single' }[latest.type]
    ?? (english ? 'release' : 'yayın');

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
    <section id="hero" ref={rootRef} className={styles.hero}>
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
      {/* Pointer-only extra: the play button below is the accessible control. */}
      <div className={styles.recordStage} aria-hidden="true" data-playing={playing ? '' : undefined}>
        <div className={styles.sleeve}>
          <img
            key={onDeck.id}
            src={coverArt(onDeck, true)}
            srcSet={`${coverArt(onDeck)} 300w, ${coverArt(onDeck, true)} 640w`}
            sizes={SLEEVE_SIZES}
            alt=""
            width="640"
            height="640"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className={styles.record}>
          <Turntable onTap={() => play(onDeck)} beatTarget={rootRef}>
            <div className={styles.recordLabel}>
              <img src="/assets/images/logo-mark-224.webp" srcSet="/assets/images/logo-mark-112.webp 84w, /assets/images/logo-mark-224.webp 168w" sizes="(max-width: 800px) 11vw, 7vw" alt="" width="105" height="140" loading="lazy" />
              <span>Hasan Arthur Altuntaş</span>
              <i />
            </div>
          </Turntable>
        </div>
      </div>
      <div className={styles.bottomline}>
        <p>
          {first && (
            <strong>
              {english ? `${releases.length} recordings since ${first}.` : `${first}’${since(first)} bu yana ${releases.length} kayıt.`}
            </strong>
          )}{' '}
          {english
            ? 'Film and game music reworked for piano and orchestra, and pieces of my own.'
            : 'Piyano ve orkestra için yeniden düzenlenmiş film ve oyun müzikleri, bir de kendi parçalarım.'}
        </p>
        <button
          type="button"
          className={styles.listen}
          onClick={() => play(latest)}
          title={latest.title}
          aria-pressed={latestPlaying}
        >
          {latestPlaying ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
          <span className={styles.listenKicker}>{english ? `New ${latestKind}` : `Yeni ${latestKind}`}</span>
          <span className={styles.listenTitle}>{latest.title}</span>
        </button>
        <a className={styles.explore} href="#project-list">
          {english ? 'Selected recordings' : 'Seçili kayıtlar'}
          <ArrowDown size={19} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
