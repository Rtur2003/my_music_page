import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { albumService, albumUrl, artistProfile, coverArt, featured } from '../data/music-catalog';
import { useReleases } from '../data/ReleasesContext';
import { usePlayer } from '../player/PlayerContext';
import { useTranslation } from '../i18n/LanguageContext';
import Timeline from './Timeline';
import styles from './ProjectList.module.css';

gsap.registerPlugin(ScrollTrigger);
// The archive shows this many covers until "show all"; the rest stay in the HTML for crawlers.
const COLLAPSED_COUNT = 12;

export default function ProjectList() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const railRef = useRef(null);
  const timelineRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const { release: current, playing, play } = usePlayer();
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
            // The record leaves its sleeve while the panel is on screen.
            timeline.fromTo(panel.querySelector(`.${styles.panelDisc}`),
              { xPercent: 4, rotation: 0 }, { xPercent: 40, rotation: 220, duration: index === 2 ? 1.3 : 1.7, ease: 'none' }, start);
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
      // Stacked layout (phones, short screens): scroll-linked drift per record.
      media.add(
        '(max-width: 800px) and (prefers-reduced-motion: no-preference), (max-height: 639px) and (prefers-reduced-motion: no-preference)',
        () => {
          [...railRef.current.children].forEach((panel) => {
            const along = () => ({ trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true });
            gsap.fromTo(panel.querySelector(`.${styles.panelDisc}`),
              { xPercent: 6, rotation: 0 }, { xPercent: 34, rotation: 200, ease: 'none', scrollTrigger: along() });
            gsap.fromTo(panel.querySelector(`.${styles.artwork}`),
              { rotation: 6, yPercent: 10 }, { rotation: -5, yPercent: -8, ease: 'none', scrollTrigger: along() });
          });
        },
      );
      return () => media.revert();
    },
    { scope: rootRef },
  );

  // The archive's height changed: scroll-linked effects need fresh positions.
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [filter, releases, expanded]);

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
      <div className={`section-head ${styles.intro}`}>
        <h2>{en ? 'Selected recordings' : 'Seçili kayıtlar'}</h2>
        <a href="#discography">
          {en ? 'Full discography' : 'Tüm diskografi'}{' '}
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
        <div ref={railRef} className={styles.rail}>
          {featured.map((track) => (
            <article key={track.id} className={styles.panel}>
              <div className={styles.artwork}>
                <span className={styles.panelDisc} aria-hidden="true" />
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
                <h3>{track.name}</h3>
                <span className={styles.artist}>{track.title}</span>
                <span className={styles.facts}>
                  {[
                    typeLabel[track.type],
                    track.date && new Intl.DateTimeFormat(en ? 'en-GB' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(track.date)),
                    track.tracks && (en ? `${track.tracks} ${track.tracks === 1 ? 'track' : 'tracks'}` : `${track.tracks} parça`),
                  ].filter(Boolean).join(' · ')}
                </span>
                <button type="button" onClick={() => play(track)}>
                  <Play size={16} aria-hidden="true" />
                  {en ? 'Listen' : 'Dinle'}
                </button>
                <a href={albumUrl(track)} target="_blank" rel="noopener" aria-label={`${track.title}, ${albumService(track)}`}>
                  {albumService(track)} <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.releaseNav} role="group" aria-label={en ? 'Choose a recording' : 'Kayıt seç'}>
          {featured.map((track, index) => (
            <button key={track.id} type="button" data-release-nav aria-pressed={index === 0} onClick={() => showRelease(index)}>{track.name}</button>
          ))}
        </div>
        <div className={styles.progress} aria-hidden="true">
          <span />
        </div>
      </div>
      <div id="discography" className={styles.catalog}>
        <div className="section-head">
          <h2>{en ? 'Discography' : 'Diskografi'}</h2>
          <span>
            {live && <i className="live-dot" aria-hidden="true" />}
            {releases.length} {en ? 'releases' : 'yayın'}
            {live && (en ? ` · updated ${updatedLabel}` : ` · güncellendi: ${updatedLabel}`)}
          </span>
        </div>
        <Timeline releases={releases} current={current} playing={playing} onPlay={play} en={en} />
        <div className={styles.catalogHeader}>
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
          {filtered.length} {en ? 'shown' : 'gösteriliyor'}
        </p>
        <div className={styles.catalogBody}>
        <aside className={styles.popular} aria-labelledby="popular-heading">
          <h3 id="popular-heading">{en ? 'Most played on Spotify' : 'Spotify’da en çok dinlenenler'}</h3>
          <iframe
            title={en ? 'Hasan Arthur Altuntaş on Spotify: popular tracks' : 'Spotify’da Hasan Arthur Altuntaş: popüler parçalar'}
            src={`https://open.spotify.com/embed/artist/${artistProfile.spotifyId}?utm_source=generator&theme=0`}
            width="100%"
            height="352"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </aside>
        <ul
          id="discography-list"
          className={`${styles.catalogGrid} ${expanded ? '' : styles.collapsed}`}
        >
          {filtered.map((track) => {
            const onDeck = current?.id === track.id;
            const spinning = onDeck && playing;
            return (
            <li key={track.id} data-on-deck={onDeck ? '' : undefined} data-spinning={spinning ? '' : undefined}>
            <button
              type="button"
              className={styles.release}
              onClick={() => play(track)}
              title={track.title}
              aria-pressed={spinning}
            >
              {/* Each sleeve holds its record: it slides out on hover and spins while it plays. */}
              <span className={styles.sleeve}>
                <span className={styles.disc} aria-hidden="true">
                  <img src={coverArt(track)} alt="" width="300" height="300" loading="lazy" decoding="async" />
                </span>
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
                    {spinning ? <Pause size={20} /> : <Play size={20} />}
                  </span>
                </span>
              </span>
              <span className={styles.releaseTitle}>{track.title}</span>
              <span className={styles.releaseMeta}>
                {[typeLabel[track.type], track.year].filter(Boolean).join(' · ')}
              </span>
            </button>
            </li>
            );
          })}
        </ul>
        {filtered.length > COLLAPSED_COUNT && (
          <button
            type="button"
            className={styles.showAll}
            aria-expanded={expanded}
            aria-controls="discography-list"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded
              ? (en ? 'Show fewer' : 'Daha az göster')
              : (en ? `Show all ${filtered.length}` : `Tümünü göster (${filtered.length})`)}
          </button>
        )}
        </div>
      </div>
    </section>
  );
}
