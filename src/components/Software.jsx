import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './Software.module.css';

// B-side of the record: the code, listed like the back of a sleeve.
const TRACKS = [
  {
    side: 'B1',
    name: 'AURIS',
    url: 'https://hasan-arthur-altuntas.xyz/ai-music-detection',
    meta: 'Python · ML',
    tr: 'Bir makine farkı duyabilir mi?',
    en: 'Can a machine hear the difference?',
  },
  {
    side: 'B2',
    name: 'AuraSynth',
    url: 'https://github.com/Rtur2003/Music_With_MY_Hand',
    meta: 'TypeScript · Web Audio',
    tr: 'Orkestrayı ellerinle yönet.',
    en: 'Conduct the orchestra with your hands.',
  },
  {
    side: 'B3',
    name: 'Kognita',
    url: 'https://github.com/Rtur2003/Kognita',
    meta: 'Python · Desktop',
    tr: 'Zamanın nereye gittiğini gör.',
    en: 'See where your time goes.',
  },
  {
    side: 'B4',
    name: 'Claude Code Prompts',
    url: 'https://github.com/Rtur2003/Claude-Code-Promts-Skills',
    meta: 'Prompt library',
    tr: 'Kodlama ajanları için bir partisyon.',
    en: 'A score for coding agents.',
  },
];

export default function Software() {
  const { lang } = useTranslation();
  const en = lang === 'en';
  const signalRef = useRef(null);

  // The equalizer idles while on screen and jumps with how fast you scroll.
  useEffect(() => {
    const signal = signalRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      signal.toggleAttribute('data-live', entry.isIntersecting);
    });
    observer.observe(signal);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => observer.disconnect();
    const level = { value: 1 };
    const push = gsap.quickTo(level, 'value', {
      duration: 0.5,
      ease: 'power3.out',
      onUpdate: () => signal.style.setProperty('--energy', level.value.toFixed(3)),
    });
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const pxPerSecond = Math.abs(window.scrollY - lastY) / Math.max(now - lastT, 1) * 1000;
      lastY = window.scrollY;
      lastT = now;
      if (!signal.hasAttribute('data-live')) return;
      push(1 + Math.min(pxPerSecond / 2600, 0.8));
      window.clearTimeout(onScroll.settle);
      onScroll.settle = window.setTimeout(() => push(1), 140);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(onScroll.settle);
    };
  }, []);

  return (
    <section id="software" className={styles.software} aria-labelledby="software-heading" data-tone="signal">
      <div className={styles.copy}>
        <h2 id="software-heading">{en ? 'The other side\nof the record.' : 'Plağın\ndiğer yüzü.'}</h2>
        <p>{en ? 'Open-source tools for sound and AI.' : 'Ses ve yapay zekâ için açık kaynak araçlar.'}</p>
        <div ref={signalRef} className={styles.signal} aria-hidden="true">
          {Array.from({ length: 45 }, (_, i) => (
            <i
              key={i}
              style={{
                height: `${12 + Math.abs(Math.sin(i * 0.71) * Math.cos(i * 0.21)) * 85}%`,
                '--i': i,
                '--d': `${1.1 + ((i * 37) % 90) / 100}s`,
              }}
            />
          ))}
        </div>
        <div className={styles.links}>
          <a href="https://hasan-arthur-altuntas.xyz" target="_blank" rel="me noopener">
            {en ? 'CrownCode platform' : 'CrownCode platformu'}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a href="https://github.com/Rtur2003" target="_blank" rel="me noopener">
            {en ? 'All projects on GitHub' : 'Tüm projeler GitHub’da'}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>

      <ol className={styles.tracklist}>
        {TRACKS.map((track) => {
          const hook = track[lang];
          return (
            <li key={track.side}>
              <a href={track.url} target="_blank" rel="noopener" className={styles.track}>
                <span className={styles.side}>{track.side}</span>
                <span className={styles.body}>
                  <span className={styles.name}>{track.name}</span>
                  <span className={styles.hook}>{hook}</span>
                  <span className={styles.meta}>{track.meta}</span>
                </span>
                <ArrowUpRight className={styles.arrow} size={22} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
