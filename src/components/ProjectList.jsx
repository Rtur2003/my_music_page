import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Play } from 'lucide-react';
import { albumUrl, artistProfile, coverArt, featured } from '../data/music-catalog';
import { useReleases } from '../data/ReleasesContext';
import { usePlayer } from '../player/PlayerContext';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './ProjectList.module.css';

gsap.registerPlugin(ScrollTrigger);
// Backdrop tone per featured record (see Backdrop.module.css).
const tones = ['crimson', 'odyssey', 'nullvector'];
const releaseNames = ['Crimson Desert', 'The Odyssey', 'NULL VECTOR'];

export default function ProjectList() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const railRef = useRef(null);
  const timelineRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const { play } = usePlayer();
  const { lang } = useTranslation();
  const en = lang === 'en';
  const { releases, live, updatedAt } = useReleases();
  const filtered = releases.filter(
    (release) => filter === 'all' || (filter === 'albums') === (release.type === 'album'),
  );
  const typeLabel = { album: en ? 'Album' : 'Albüm', ep: 'EP', single: 'Single' };
  const updatedLabel = updatedAt
    ? new Intl.DateTimeFormat(en ? 'en-GB' : 'tr-TR', { day: 'numeric', month: 'long' }).format(new Date(updatedAt))
    : null;

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
            stage.dataset.tone = tones[next];
            // Scrub catch-up keeps updating after the pin releases; only the
            // pinned stage may retint the backdrop.
            if (timeline?.scrollTrigger?.isActive) {
              window.dispatchEvent(new CustomEvent('backdrop:tone', { detail: tones[next] }));
            }
          };
          let timeline;
          timeline = gsap.timeline({
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
            stage.dataset.tone = tones[0];
            timelineRef.current = null;
            panels.forEach((panel) => {
              panel.inert = false;
              panel.removeAttribute('aria-hidden');
            });
          };
        },
      );
      // Stacked layout (phones, short screens): scroll-linked drift per record.
      media.add(
        '(max-width: 800px) and (prefers-reduced-motion: no-preference), (max-height: 639px) and (prefers-reduced-motion: no-preference)',
        () => {
          [...railRef.current.children].forEach((panel) => {
            const along = () => ({ trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true });
            gsap.fromTo(panel.querySelector(`.${styles.atmosphere}`),
              { yPercent: -5, scale: 1.22 }, { yPercent: 5, scale: 1.08, ease: 'none', scrollTrigger: along() });
            gsap.fromTo(panel.querySelector(`.${styles.artwork}`),
              { rotation: 6, yPercent: 10 }, { rotation: -5, yPercent: -8, ease: 'none', scrollTrigger: along() });
          });
        },
      );
      return () => media.revert();
    },
    { scope: rootRef },
  );

  // Cover columns drift at different speeds while the archive scrolls past.
  const gridRef = useRef(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const items = [...gridRef.current.children];
        const cols = window.matchMedia('(max-width: 700px)').matches ? 2 : 3;
        const drift = cols === 2 ? [0, 70] : [0, 110, 45];
        items.forEach((item, i) => {
          const distance = drift[i % cols];
          if (!distance) return;
          gsap.fromTo(item, { y: distance }, {
            y: -distance,
            ease: 'none',
            scrollTrigger: { trigger: gridRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
      });
      // The archive's height changed: everything below needs fresh positions.
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => media.revert();
    },
    { scope: rootRef, dependencies: [filter, releases], revertOnUpdate: true },
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
      <div ref={stageRef} className={styles.stage} data-tone={tones[0]}>
      <div className={styles.intro}>
        <h2>{en ? 'Selected recordings' : 'Seçili kayıtlar'}</h2>
        <a href="#discography">
          {en ? 'Browse all releases' : 'Tüm yayınlara göz at'}{' '}
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
        <div ref={railRef} className={styles.rail}>
          {featured.map((track, index) => (
            <article
              key={track.id}
              className={styles.panel}
              data-tone={tones[index]}
            >
              <div className={styles.atmosphereWrap}>
                <img className={styles.atmosphere} src={coverArt(track, true)} alt="" width="640" height="640" loading="lazy" decoding="async" />
              </div>
              <div className={styles.artwork}>
                <img
                  src={coverArt(track, true)}
                  alt={en ? `${track.title} cover art` : `${track.title} kapak görseli`}
                  width="640"
                  height="640"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles.info}>
                <h3>{releaseNames[index]}</h3>
                <span className={styles.artist}>{track.title}</span>
                <button type="button" onClick={() => play(track)}>
                  <Play size={16} aria-hidden="true" />
                  {en ? 'Listen to this record' : 'Bu kaydı dinle'}
                </button>
                <a href={albumUrl(track.id)} target="_blank" rel="noopener" aria-label={`${track.title}, Spotify`}>
                  Spotify <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.releaseNav} role="group" aria-label={en ? 'Choose a recording' : 'Kayıt seç'}>
          {releaseNames.map((name, index) => (
            <button key={name} type="button" data-release-nav aria-pressed={index === 0} onClick={() => showRelease(index)}>{name}</button>
          ))}
        </div>
        <div className={styles.progress} aria-hidden="true">
          <span />
        </div>
      </div>
      <div id="discography" className={styles.catalog} data-tone="archive">
        <div className={styles.catalogHeader}>
          <div>
            <h2>
              {en ? 'Discography' : 'Diskografi'}
              <sup aria-hidden="true">{releases.length}</sup>
            </h2>
            {live && (
              <p className={styles.liveNote}>
                <i aria-hidden="true" />
                {en ? `Live from Spotify · updated ${updatedLabel}` : `Spotify’dan canlı · ${updatedLabel} güncellendi`}
              </p>
            )}
          </div>
          <div
            className={styles.filters}
            role="group"
            aria-label={en ? 'Filter releases' : 'Yayınları filtrele'}
          >
            {[
              ['all', en ? 'All' : 'Tümü'],
              ['albums', en ? 'Albums' : 'Albümler'],
              ['singles', en ? 'Singles & EPs' : 'Single & EP'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
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
        <div className={styles.catalogBody}>
        <aside className={styles.popular} aria-labelledby="popular-heading">
          <h3 id="popular-heading">{en ? 'Most played right now' : 'Şu an en çok dinlenenler'}</h3>
          <p>{en ? 'Straight from Spotify, always current.' : 'Doğrudan Spotify’dan, her zaman güncel.'}</p>
          <iframe
            title={en ? 'Hasan Arthur Altuntaş on Spotify: popular tracks' : 'Spotify’da Hasan Arthur Altuntaş: popüler parçalar'}
            src={`https://open.spotify.com/embed/artist/${artistProfile.spotifyId}?utm_source=generator&theme=0`}
            width="100%"
            height="352"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </aside>
        <ul ref={gridRef} className={styles.catalogGrid}>
          {filtered.map((track) => (
            <li key={track.id}>
            <button
              type="button"
              className={styles.release}
              onClick={() => play(track)}
            >
              <span className={styles.cover}>
                <img
                  src={coverArt(track)}
                  srcSet={`${coverArt(track)} 300w, ${coverArt(track, true)} 640w`}
                  sizes="(max-width: 700px) 44vw, 18vw"
                  alt=""
                  width="300"
                  height="300"
                  loading="lazy"
                  decoding="async"
                />
                <span className={styles.coverPlay} aria-hidden="true">
                  <Play size={22} />
                </span>
              </span>
              <span className={styles.releaseTitle}>{track.title}</span>
              <span className={styles.releaseMeta}>
                {typeLabel[track.type]}
                {track.year ? ` · ${track.year}` : ''}
              </span>
            </button>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}
