import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Music, Code, Film, Headphones } from 'lucide-react';
import styles from './About.module.css';

const SKILLS = [
  { icon: Music, title: 'Multi-Instrumentalist', detail: 'Piano, strings & synthesis' },
  { icon: Code, title: 'Software Engineering', detail: 'Next.js, FastAPI, Kotlin' },
  { icon: Film, title: 'Cinematic Composition', detail: 'Score & sound design' },
  { icon: Headphones, title: 'Audio Engineering', detail: 'Mix, master & analysis' },
];

export default function About() {
  const rootRef = useRef(null);

  useGSAP(() => {
    gsap.from(`.${styles.reveal}`, {
      scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      y: 36,
      opacity: 0,
      stagger: 0.12,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from(`.${styles.skillCard}`, {
      scrollTrigger: { trigger: `.${styles.skillsGrid}`, start: 'top 85%' },
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.9,
      ease: 'power3.out',
    });
  }, { scope: rootRef });

  return (
    <section id="about" ref={rootRef} className={styles.about}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.textCol}>
            <span className={`${styles.reveal} eyebrow`}>Bridging Logic &amp; Emotion</span>

            <h2 className={`${styles.reveal} ${styles.heading} font-display`}>
              Where algorithms meet cinematic soundscapes.
            </h2>

            <p className={`${styles.reveal} ${styles.body} font-editorial`}>
              I tell stories through the universal language of music and the precise
              structure of code. As a cinematic music producer and AI architect, I thrive
              at the intersection of art and technology — whether composing emotionally
              driven instrumental tracks like <em>"LIAR"</em>, or building machine learning
              systems like <strong className={styles.strong}>AURIS</strong> under the{' '}
              <strong className={styles.strong}>CrownCode</strong> ecosystem. The focus is
              always the same: an immersive, memorable experience.
            </p>
          </div>

          <div className={`${styles.skillsGrid} ${styles.reveal}`}>
            {SKILLS.map(({ icon: Icon, title, detail }) => (
              <div key={title} className={styles.skillCard}>
                <Icon size={22} strokeWidth={1.5} className={styles.skillIcon} />
                <div className={`${styles.skillTitle} font-display`}>{title}</div>
                <div className={styles.skillDetail}>{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
