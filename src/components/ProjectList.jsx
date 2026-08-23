import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ExternalLink } from 'lucide-react';
import { FaSpotify } from 'react-icons/fa';
import { musicCatalog } from '../data/music-catalog';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './ProjectList.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectList() {
  const containerRef = useRef();
  const sliderRef = useRef();
  const { t } = useTranslation();

  useGSAP(() => {
    const panels = gsap.utils.toArray(`.${styles.panel}`);

    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        end: () => '+=' + sliderRef.current.offsetWidth,
      },
    });

    gsap.from(`.${styles.sectionLabel}`, {
      scrollTrigger: { trigger: containerRef.current, start: 'top 90%' },
      y: -20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  return (
    <section id="project-list" ref={containerRef} className={styles.section}>
      <div className={styles.sectionLabel}>
        <span className="eyebrow">{t('works.eyebrow')}</span>
        <span className={`${styles.counter} font-mono`}>
          {String(musicCatalog.length).padStart(2, '0')} {t('works.counterSuffix')}
        </span>
      </div>

      <div ref={sliderRef} className={styles.slider} style={{ width: `${musicCatalog.length * 100}vw` }}>
        {musicCatalog.map((track) => (
          <div key={track.id} className={styles.panel}>
            <div className={styles.panelBg} style={{ background: track.backgroundGradient }} />

            <div className={styles.panelContent}>
              <a
                href={track.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.playButton}
                aria-label={`${track.title} — Spotify'da dinle`}
              >
                <FaSpotify size={32} />
              </a>

              <div className={styles.info}>
                <div className={styles.meta}>
                  <span className={styles.genreTag}>{track.genre}</span>
                </div>

                <h3 className={`${styles.trackTitle} font-display`}>{track.title}</h3>
                {track.description && (
                  <p className={styles.description}>{track.description}</p>
                )}

                <div className={styles.platforms}>
                  <a href={track.spotifyUrl} target="_blank" rel="noreferrer" className={`${styles.platformLink} ${styles.spotify}`}>
                    <FaSpotify size={20} /> Spotify
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>

            <span className={`${styles.panelIndex} font-mono`}>
              {String(track.id).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
