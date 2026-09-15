import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './About.module.css';

export default function About() {
  const rootRef = useRef(null);
  const { lang } = useTranslation();
  const en = lang === 'en';
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        '(min-width: 800px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.fromTo(
            `.${styles.portrait} img`,
            { yPercent: -8, scale: 1.15 },
            {
              yPercent: 8,
              scale: 1.15,
              ease: 'none',
              scrollTrigger: {
                trigger: rootRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          );
        },
      );
      return () => media.revert();
    },
    { scope: rootRef },
  );
  return (
    <section id="about" className={styles.about} ref={rootRef}>
      <div className={styles.portrait}>
        <img
          src="/assets/images/hasan-arthur-profile.jpg"
          alt="Hasan Arthur Altuntaş marka logosu"
          width="600"
          height="750"
          loading="lazy"
        />
      </div>
      <div className={styles.copy}>
        <p className={styles.name}>Hasan Arthur Altuntaş</p>
        <h2>{en ? 'One mind.\nTwo languages.' : 'Bir zihin.\nİki dil.'}</h2>
        <p>
          {en
            ? 'I make cinematic music and build software. The first gives an imagined world a feeling. The second gives an idea a working form.'
            : 'Sinematik müzik yapıyor, yazılım geliştiriyorum. Birinde hayal ettiğim dünyaya bir his, diğerinde bir fikre çalışan bir biçim veriyorum.'}
        </p>
        <p>
          {en
            ? 'From reimagined film scores to AURIS, my work keeps returning to the same place: the relationship between sound and technology.'
            : 'Yeniden yorumladığım film müziklerinden AURIS’e, çalışmalarım hep aynı yere dönüyor: ses ve teknoloji arasındaki ilişkiye.'}
        </p>
        <a
          href="https://medium.com/@hasannarthurrr"
          target="_blank"
          rel="noreferrer"
        >
          {en ? 'Notes on music & code' : 'Müzik ve kod üzerine notlar'}
          <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}
