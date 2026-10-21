import { useEffect, useRef } from 'react';
import { ArrowUpRight, Pause, Play, X } from 'lucide-react';
import { usePlayer, usePlayerStatus } from '../player/PlayerContext';
import * as engine from '../player/engine';
import { useReleases } from '../data/ReleasesContext';
import { albumService, albumUrl, coverArt, embedFor } from '../data/music-catalog';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './Player.module.css';

// The page's single player. A small record follows you down the page; while a
// preview plays it opens into a transport with the live spectrum of the track.
// "Full track" (or a release without a preview) swaps in the plain Spotify /
// Apple Music embed, which needs no script and keeps the CSP strict.
// Turkish case suffixes follow the service name's last vowel.
const OPEN_IN_TR = { Spotify: 'Spotify’da aç', 'Apple Music': 'Apple Music’te aç' };
const BARS = 18;

const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

function Meter({ playing }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!playing || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const bands = new Float32Array(BARS);
    const shown = new Float32Array(BARS);
    let frame = 0;
    const draw = () => {
      engine.readBands(bands);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#ff4b2b';
      const step = w / BARS;
      for (let i = 0; i < BARS; i++) {
        shown[i] = Math.max(bands[i], shown[i] * 0.85);
        const bar = Math.max(2, shown[i] * h);
        ctx.fillRect(i * step + 1, (h - bar) / 2, step - 2, bar);
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  return <canvas ref={canvasRef} className={styles.meter} aria-hidden="true" />;
}

export default function Player() {
  const { release, mode, playing, play, toggle, fullTrack, close } = usePlayer();
  const { time, duration, buffering } = usePlayerStatus();
  const latest = useReleases().releases[0];
  const deckRef = useRef(null);
  const cardRef = useRef(null);
  const { lang } = useTranslation();
  const en = lang === 'en';
  const shown = release ?? latest;
  const onDeck = release && mode === 'deck';

  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const deck = deckRef.current;
      if (!deck) return;
      deck.style.setProperty('--scroll-turn', `${window.scrollY * 0.18}deg`);
      deck.toggleAttribute('data-away', window.scrollY > window.innerHeight * 0.6);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!release) return undefined;
    if (mode === 'embed') cardRef.current?.focus({ preventScroll: true });
    const onKey = (event) => { if (event.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [release, mode, close]);

  const onDisc = () => (onDeck ? toggle() : play(shown));
  const discLabel = onDeck
    ? (playing ? (en ? 'Pause' : 'Duraklat') : (en ? 'Play' : 'Çal'))
    : (en ? `Listen to ${shown.title}` : `${shown.title} dinle`);

  return (
    <>
      <div
        ref={deckRef}
        className={styles.deck}
        data-active={onDeck ? '' : undefined}
        data-hidden={release && mode === 'embed' ? '' : undefined}
      >
        <button type="button" className={styles.disc} onClick={onDisc} aria-label={discLabel}>
          <span className={styles.turn}>
            <span className={styles.vinyl} data-spinning={playing ? '' : undefined}>
              <img src={coverArt(shown)} alt="" width="300" height="300" loading="lazy" decoding="async" />
            </span>
          </span>
        </button>

        {onDeck ? (
          <div className={styles.transport} role="group" aria-label={en ? `${release.title}, preview` : `${release.title}, önizleme`}>
            <div className={styles.meta}>
              <span className={styles.title}>{release.title}</span>
              <span className={styles.time}>
                {buffering ? (en ? 'Loading…' : 'Yükleniyor…') : `${en ? 'Preview' : 'Önizleme'} · ${clock(time)} / ${clock(duration)}`}
              </span>
            </div>
            <Meter playing={playing} />
            <button type="button" className={styles.icon} onClick={toggle} aria-label={playing ? (en ? 'Pause' : 'Duraklat') : (en ? 'Play' : 'Çal')}>
              {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
            </button>
            <button type="button" className={styles.full} onClick={fullTrack}>
              {en ? 'Full track' : 'Tam parça'}
            </button>
            <button type="button" className={styles.icon} onClick={close} aria-label={en ? 'Close player' : 'Oynatıcıyı kapat'}>
              <X size={18} aria-hidden="true" />
            </button>
            <input
              className={styles.seek}
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={Math.min(time, duration)}
              onChange={(event) => engine.seek(Number(event.target.value))}
              aria-label={en ? 'Position' : 'Konum'}
              style={{ '--p': duration ? time / duration : 0 }}
            />
          </div>
        ) : (
          <span className={styles.caption} aria-hidden="true">
            <Play size={13} />
            <span>{shown.title}</span>
          </span>
        )}
      </div>

      {release && mode === 'embed' && (
        <div
          ref={cardRef}
          tabIndex={-1}
          className={styles.card}
          role="region"
          aria-label={en ? `${albumService(release)} player` : `${albumService(release)} oynatıcı`}
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
            title={`${release.title}, ${albumService(release)}`}
            src={embedFor(release).src}
            width="100%"
            height={embedFor(release).height}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
          <a href={albumUrl(release)} target="_blank" rel="noopener">
            {en ? `Open in ${albumService(release)}` : OPEN_IN_TR[albumService(release)]}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      )}
    </>
  );
}
