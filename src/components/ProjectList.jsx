import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, X, Play } from 'lucide-react';
import { musicCatalog } from '../data/music-catalog';
import artwork from '../data/artwork.json';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './ProjectList.module.css';

gsap.registerPlugin(ScrollTrigger);
const selected = musicCatalog.slice(0, 3);
const moods = ['#3b2c20', '#243337', '#28282d'];

export default function ProjectList() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const railRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const [playing, setPlaying] = useState(null);
  const { lang } = useTranslation();
  const en = lang === 'en';
  const filtered = musicCatalog.filter(
    (track) =>
      filter === 'all' ||
      (filter === 'albums'
        ? track.genre.startsWith('Albüm')
        : !track.genre.startsWith('Albüm')),
  );

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
        () => {
          const distance = () =>
            railRef.current.scrollWidth - stageRef.current.clientWidth;
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: stageRef.current,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          });
          timeline.to(
            railRef.current,
            { x: () => -distance(), ease: 'none' },
            0,
          );
          timeline.fromTo(
            `.${styles.progress} span`,
            { scaleX: 0 },
            { scaleX: 1, ease: 'none' },
            0,
          );
        },
      );
      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="project-list" ref={rootRef} className={styles.section}>
      <div className={styles.intro}>
        <p>{en ? 'A few places to begin.' : 'Başlamak için birkaç dünya.'}</p>
        <h2>{en ? 'Made to be felt.' : 'Hissetmek için.'}</h2>
        <a href="#discography">
          {en ? 'Browse all releases' : 'Tüm yayınlara göz at'}{' '}
          <ArrowUpRight size={18} />
        </a>
      </div>
      <div ref={stageRef} className={styles.stage}>
        <div ref={railRef} className={styles.rail}>
          {selected.map((track, index) => (
            <article
              key={track.id}
              className={styles.panel}
              style={{ '--mood': moods[index] }}
            >
              <div className={styles.artwork}>
                <img
                  src={artwork[track.spotifyUrl]}
                  alt={track.title}
                  width="600"
                  height="600"
                  loading="lazy"
                />
              </div>
              <div className={styles.info}>
                <span className={styles.artist}>Hasan Arthur Altuntaş</span>
                <h3>{track.title}</h3>
                <p>
                  {index === 0
                    ? en
                      ? 'Into Pywel. An orchestral journey through Crimson Desert.'
                      : 'Pywel’e doğru. Crimson Desert dünyasında orkestral bir yolculuk.'
                    : index === 1
                      ? en
                        ? 'The Odyssey, reimagined in sound.'
                        : 'The Odyssey, seslerle yeniden.'
                      : en
                        ? 'Enter the world of NULL VECTOR.'
                        : 'NULL VECTOR dünyasına gir.'}
                </p>
                <button onClick={() => setPlaying(track)}>
                  <Play size={16} />
                  {en ? 'Listen to this record' : 'Bu kaydı dinle'}
                </button>
                <a href={track.spotifyUrl} target="_blank" rel="noreferrer">
                  Spotify <ArrowUpRight size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.progress} aria-hidden="true">
          <span />
        </div>
      </div>
      <div id="discography" className={styles.catalog}>
        <div className={styles.catalogHeader}>
          <div>
            <p>{en ? 'From the release archive' : 'Yayın arşivinden'}</p>
            <h2>
              {en ? 'Discography' : 'Diskografi'}
              <sup>{musicCatalog.length}</sup>
            </h2>
          </div>
          <div
            className={styles.filters}
            aria-label={en ? 'Filter releases' : 'Yayınları filtrele'}
          >
            {[
              ['all', en ? 'All' : 'Tümü'],
              ['albums', en ? 'Albums' : 'Albümler'],
              ['singles', 'Singles & EP'],
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <p className={styles.resultCount} aria-live="polite">
          {filtered.length} {en ? 'releases' : 'yayın'}
        </p>
        <div className={styles.catalogGrid}>
          {filtered.map((track) => (
            <button
              key={track.id}
              className={styles.release}
              onClick={() => setPlaying(track)}
            >
              <span className={styles.cover}>
                <img
                  src={artwork[track.spotifyUrl]}
                  alt=""
                  width="300"
                  height="300"
                  loading="lazy"
                />
                <span className={styles.coverPlay}>
                  <Play size={22} />
                </span>
              </span>
              <span className={styles.releaseTitle}>{track.title}</span>
              <span className={styles.releaseMeta}>
                {track.genre
                  .replace('Albüm', en ? 'Album' : 'Albüm')
                  .replace(
                    'En Çok Dinlenen',
                    en ? 'Featured release' : 'Öne çıkan yayın',
                  )}
              </span>
            </button>
          ))}
        </div>
      </div>
      {playing && (
        <div
          className={styles.player}
          role="region"
          aria-label={en ? 'Spotify player' : 'Spotify oynatıcı'}
        >
          <div className={styles.playerHeading}>
            <span>{playing.title}</span>
            <button
              onClick={() => setPlaying(null)}
              aria-label={en ? 'Close player' : 'Oynatıcıyı kapat'}
            >
              <X size={20} />
            </button>
          </div>
          <iframe
            key={playing.id}
            title={`${playing.title} — Spotify`}
            src={`https://open.spotify.com/embed/album/${playing.spotifyUrl.split('/').pop()}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
          <a href={playing.spotifyUrl} target="_blank" rel="noreferrer">
            {en ? 'Open in Spotify' : 'Spotify’da aç'}{' '}
            <ArrowUpRight size={14} />
          </a>
        </div>
      )}
    </section>
  );
}
