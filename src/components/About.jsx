import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './About.module.css';

// Two walls of type slide past each other as you scroll: the worlds he scores,
// and the instruments he scores them with. One sentence carries the meaning.
const WORLDS = ['Crimson Desert', 'The Odyssey', 'Interstellar', 'NULL VECTOR', 'Embermelody'];
const CRAFT = {
  tr: ['Piyano', 'Orkestra', 'Beat', 'Ambient', 'Film müziği'],
  en: ['Piano', 'Orchestra', 'Beats', 'Ambient', 'Film score'],
};

function Row({ words, className }) {
  // Rendered twice so the row never runs out while it slides.
  const run = [...words, ...words];
  return (
    <div className={`${styles.row} ${className}`} aria-hidden="true">
      {run.map((word, i) => (
        <span key={i}>
          {word}
          <i />
        </span>
      ))}
    </div>
  );
}

export default function About() {
  const rootRef = useRef(null);
  const { lang } = useTranslation();
  const en = lang === 'en';

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const along = () => ({ trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 });
        gsap.fromTo(`.${styles.worlds}`, { xPercent: 0 }, { xPercent: -28, ease: 'none', scrollTrigger: along() });
        gsap.fromTo(`.${styles.craft}`, { xPercent: -30 }, { xPercent: -2, ease: 'none', scrollTrigger: along() });
      });
      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="about" className={styles.about} ref={rootRef} aria-labelledby="about-heading" data-tone="about">
      <h2 id="about-heading" className="sr-only">{en ? 'About' : 'Hakkımda'}</h2>
      <div className={styles.walls}>
        <Row words={WORLDS} className={styles.worlds} />
        <Row words={CRAFT[lang]} className={styles.craft} />
      </div>
      <div className={styles.inner}>
        <p className={styles.statement}>
          {en
            ? 'I rewrite the worlds of films and games with piano, orchestra and beats, and build software that listens to sound with the same curiosity.'
            : 'Film ve oyun dünyalarını piyano, orkestra ve beat ile yeniden yazıyorum; aynı merakla sesi dinleyen yazılımlar geliştiriyorum.'}
        </p>
        <div className={styles.signature}>
          <p>
            Hasan Arthur Altuntaş
            <span>{en ? 'Composer & pianist · Düzce, Türkiye' : 'Besteci ve piyanist · Düzce'}</span>
          </p>
          <a href="https://medium.com/@hasannarthurrr" target="_blank" rel="me noopener">
            {en ? 'Writing on Medium' : 'Medium’daki yazılarım'}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
