import { useEffect, useRef } from 'react';
import { ArrowUpRight, Play, X } from 'lucide-react';
import { usePlayer } from '../player/PlayerContext';
import { useReleases } from '../data/ReleasesContext';
import { albumUrl, coverArt } from '../data/music-catalog';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './Player.module.css';

// The page's single player: a card with the Spotify embed, plus a small record
// that follows you down the page. It turns with the scroll and spins while it is on the turntable
// (player open); the embed doesn't report play/pause without a script the CSP won't allow.
export default function Player() {
  const { release, play, close } = usePlayer();
  const latest = useReleases().releases[0];
  const discRef = useRef(null);
  const cardRef = useRef(null);
  const { lang } = useTranslation();
  const en = lang === 'en';
  const shown = release ?? latest;

  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const disc = discRef.current;
      if (!disc) return;
      disc.style.setProperty('--scroll-turn', `${window.scrollY * 0.18}deg`);
      disc.toggleAttribute('data-away', window.scrollY > window.innerHeight * 0.6);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!release) return undefined;
    cardRef.current?.focus({ preventScroll: true });
    const onKey = (event) => { if (event.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [release, close]);

  const onDisc = () => (release ? close() : play(shown));
  const discLabel = release
    ? (en ? 'Close the player' : 'Oynatıcıyı kapat')
    : (en ? `Listen to ${shown.title}` : `${shown.title} dinle`);

  return (
    <>
      <button
        ref={discRef}
        type="button"
        className={styles.disc}
        data-open={release ? '' : undefined}
        onClick={onDisc}
        aria-label={discLabel}
      >
        <span className={styles.turn}>
          <span className={styles.vinyl}>
            <img src={coverArt(shown)} alt="" width="300" height="300" loading="lazy" decoding="async" />
          </span>
        </span>
        <span className={styles.caption} aria-hidden="true">
          {release ? <X size={13} /> : <Play size={13} />}
          <span>{shown.title}</span>
        </span>
      </button>

      {release && (
        <div
          ref={cardRef}
          tabIndex={-1}
          className={styles.card}
          role="region"
          aria-label={en ? 'Spotify player' : 'Spotify oynatıcı'}
        >
          <div className={styles.heading}>
            <span>{release.title}</span>
            <button type="button" onClick={close} aria-label={en ? 'Close player' : 'Oynatıcıyı kapat'}>
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <iframe
            key={release.id}
            className={styles.embed}
            title={`${release.title}, Spotify`}
            src={`https://open.spotify.com/embed/album/${release.id}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
          <a href={albumUrl(release.id)} target="_blank" rel="noopener">
            {en ? 'Open in Spotify' : 'Spotify’da aç'}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      )}
    </>
  );
}
