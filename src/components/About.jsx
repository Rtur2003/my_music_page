import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Code, Cpu, Wrench, Globe } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './About.module.css';

const SKILL_ICONS = {
  programming: Code,
  web: Globe,
  ai: Cpu,
  tools: Wrench,
};

export default function About() {
  const rootRef = useRef(null);
  const { t } = useTranslation();

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

  const skillKeys = ['programming', 'web', 'ai', 'tools'];

  return (
    <section id="about" ref={rootRef} className={styles.about}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.textCol}>
            <span className={`${styles.reveal} eyebrow`}>{t('about.eyebrow')}</span>

            <h2 className={`${styles.reveal} ${styles.heading} font-display`}>
              {t('about.heading')}
            </h2>

            <p
              className={`${styles.reveal} ${styles.body} font-editorial`}
              dangerouslySetInnerHTML={{ __html: t('about.body') }}
            />
          </div>

          <div className={`${styles.skillsGrid} ${styles.reveal}`}>
            {skillKeys.map((key) => {
              const Icon = SKILL_ICONS[key];
              return (
                <div key={key} className={styles.skillCard}>
                  <Icon size={22} strokeWidth={1.5} className={styles.skillIcon} />
                  <div className={`${styles.skillTitle} font-display`}>{t(`about.skills.${key}.title`)}</div>
                  <div className={styles.skillDetail}>{t(`about.skills.${key}.detail`)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
