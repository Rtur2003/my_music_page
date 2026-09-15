import { useEffect, useRef, useState } from 'react';
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
const releaseNames = ['Crimson Desert', 'The Odyssey', 'NULL VECTOR'];

export default function ProjectList() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const railRef = useRef(null);
  const timelineRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const [playing, setPlaying] = useState(null);
  const { lang } = useTranslation();
  const en = lang === 'en';
  useEffect(() => {
    if (!playing) return;
    const close = (event) => { if (event.key === 'Escape') setPlaying(null); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [playing]);
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
        '(min-width: 801px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)',
        () => {
          const stage = stageRef.current;
          const panels = [...railRef.current.children];
          const buttons = [...stage.querySelectorAll('[data-release-nav]')];
          stage.dataset.immersive = 'true';
          gsap.set(panels.slice(1), { autoAlpha: 0 });
          let active = -1;
          const syncPanel = (time) => {
            const next = time < 1.1 ? 0 : time < 2.3 ? 1 : 2;
            if (next === active) return;
            active = next;
            panels.forEach((panel, index) => {
              panel.inert = index !== next;
              panel.setAttribute('aria-hidden', String(index !== next));
              buttons[index]?.setAttribute('aria-pressed', String(index === next));
            });
          };
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: () => `+=${stage.clientHeight * 2.7}`,
              pin: true,
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
            onUpdate() { syncPanel(this.time()); },
          });
          timelineRef.current = timeline;
          timeline.to({}, { duration: 3.3 });
          panels.forEach((panel, index) => {
            const start = index === 0 ? 0 : index * 1.2 - 0.4;
            timeline.fromTo(panel.querySelector(`.${styles.atmosphere}`),
              { scale: 1.12 }, { scale: 1, duration: index === 2 ? 1.3 : 1.7, ease: 'none' }, start);
            if (index === 0) return;
            timeline.to(panels[index - 1], { autoAlpha: 0, duration: 0.65 }, start)
              .fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.65 }, start)
              .fromTo(panel.querySelector(`.${styles.artwork}`),
                { yPercent: 15, rotation: 7, scale: 0.94 },
                { yPercent: 0, rotation: -3, scale: 1, duration: 0.8, ease: 'power2.out' }, start)
              .fromTo(panel.querySelector(`.${styles.info}`),
                { y: 26 }, { y: 0, duration: 0.8, ease: 'power2.out' }, start);
          });
          timeline.fromTo(`.${styles.progress} span`, { scaleX: 0 },
            { scaleX: 1, duration: 3.3, ease: 'none' }, 0);
          syncPanel(0);
          return () => {
            delete stage.dataset.immersive;
            timelineRef.current = null;
            panels.forEach((panel) => {
              panel.inert = false;
              panel.removeAttribute('aria-hidden');
            });
          };
        },
      );
      return () => media.revert();
    },
    { scope: rootRef },
  );

  const showRelease = (index) => {
    const timeline = timelineRef.current;
    if (timeline?.scrollTrigger) {
      const trigger = timeline.scrollTrigger;
      const progress = [0, 1.65 / 3.3, 2.9 / 3.3][index];
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'instant' });
      ScrollTrigger.update();
    } else {
      railRef.current.children[index]?.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  };

  return (
    <section id="project-list" ref={rootRef} className={styles.section}>
      <div ref={stageRef} className={styles.stage}>
      <div className={styles.intro}>
        <h2>{en ? 'Selected recordings' : 'Seçili kayıtlar'}</h2>
        <a href="#discography">
          {en ? 'Browse all releases' : 'Tüm yayınlara göz at'}{' '}
          <ArrowUpRight size={18} />
        </a>
      </div>
        <div ref={railRef} className={styles.rail}>
          {selected.map((track, index) => (
            <article
              key={track.id}
              className={styles.panel}
              style={{ '--mood': moods[index] }}
            >
              <img className={styles.atmosphere} src={artwork[track.spotifyUrl]} alt="" aria-hidden="true" width="640" height="640" loading="lazy" />
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
                <h3>{releaseNames[index]}</h3>
                <span className={styles.artist}>{track.title}</span>
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
        <div className={styles.releaseNav} aria-label={en ? 'Choose a recording' : 'Kayıt seç'}>
          {releaseNames.map((name, index) => (
            <button key={name} data-release-nav aria-pressed={index === 0} onClick={() => showRelease(index)}>{name}</button>
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
