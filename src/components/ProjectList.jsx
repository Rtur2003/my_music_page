import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Play, Pause } from 'lucide-react';
import { FaSpotify, FaYoutube, FaApple } from 'react-icons/fa';
import { musicCatalog } from '../data/music-catalog';
import styles from './ProjectList.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectList({ playingTrackId, isPlaying, onTogglePlay }) {
  const containerRef = useRef();
  const sliderRef = useRef();

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
        <span className="eyebrow">Selected Works</span>
        <span className={`${styles.counter} font-mono`}>
          {String(musicCatalog.length).padStart(2, '0')} tracks
        </span>
      </div>

      <div ref={sliderRef} className={styles.slider} style={{ width: `${musicCatalog.length * 100}vw` }}>
        {musicCatalog.map((track) => {
          const isActive = playingTrackId === track.id && isPlaying;
          return (
            <div key={track.id} className={styles.panel}>
              <div className={styles.panelBg} style={{ background: track.backgroundGradient }} />

              <div className={styles.panelContent}>
                <button
                  onClick={(e) => { e.stopPropagation(); onTogglePlay(track.id); }}
                  className={`${styles.playButton} ${isActive ? styles.playing : ''}`}
                  aria-label={isActive ? `Pause ${track.title}` : `Play ${track.title}`}
                >
                  {isActive ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: 4 }} />}
                </button>

                <div className={styles.info}>
                  <div className={styles.meta}>
                    <span className={styles.genreTag}>{track.genre}</span>
                    <span className={`${styles.duration} font-mono`}>{track.duration}</span>
                  </div>

                  <h3 className={`${styles.trackTitle} font-display`}>{track.title}</h3>
                  <p className={styles.description}>{track.description}</p>

                  <div className={styles.platforms}>
                    {track.spotifyUrl && (
                      <a href={track.spotifyUrl} target="_blank" rel="noreferrer" className={`${styles.platformLink} ${styles.spotify}`}>
                        <FaSpotify size={20} /> Spotify
                      </a>
                    )}
                    {track.youtubeUrl && (
                      <a href={track.youtubeUrl} target="_blank" rel="noreferrer" className={`${styles.platformLink} ${styles.youtube}`}>
                        <FaYoutube size={20} /> YouTube
                      </a>
                    )}
                    {track.appleUrl && (
                      <a href={track.appleUrl} target="_blank" rel="noreferrer" className={`${styles.platformLink} ${styles.apple}`}>
                        <FaApple size={20} /> Apple Music
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <span className={`${styles.panelIndex} font-mono`}>
                {String(track.id).padStart(2, '0')}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
