import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { BrainCircuit, MessageSquare, TestTube2, Terminal, Database } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './Software.module.css';

const PROJECT_ORDER = [
  { key: 'auris', icon: BrainCircuit },
  { key: 'commendai', icon: MessageSquare },
  { key: 'webtestai', icon: TestTube2 },
  { key: 'votryx', icon: Terminal },
  { key: 'musicdatasettool', icon: Database },
];

const EXPERIENCE_ORDER = ['teknofest2025', 'teknofest2024', 'sosmart', 'sakarya'];

export default function Software() {
  const rootRef = useRef(null);
  const { t } = useTranslation();
  // Only real GitHub API fields are shown — no estimated/invented numbers.
  const [stats, setStats] = useState({ repos: null, languages: null, isLive: false });

  useEffect(() => {
    let cancelled = false;
    async function fetchGitHubStats() {
      try {
        const username = 'Rtur2003';
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100`),
        ]);

        if (userRes.ok && reposRes.ok && !cancelled) {
          const userData = await userRes.json();
          const reposData = await reposRes.json();

          const languages = new Set();
          reposData.forEach((r) => { if (r.language) languages.add(r.language); });

          setStats({
            repos: userData.public_repos ?? reposData.length,
            languages: languages.size,
            isLive: true,
          });
        }
      } catch {
        // Stays at null — the stats block simply doesn't render rather than
        // showing a made-up fallback number.
      }
    }
    fetchGitHubStats();
    return () => { cancelled = true; };
  }, []);

  useGSAP(() => {
    gsap.from(`.${styles.reveal}`, {
      scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      y: 36,
      opacity: 0,
      stagger: 0.1,
      duration: 0.9,
      ease: 'power3.out',
    });

    gsap.from(`.${styles.card}`, {
      scrollTrigger: { trigger: `.${styles.cardGrid}`, start: 'top 82%' },
      y: 30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from(`.${styles.expCard}`, {
      scrollTrigger: { trigger: `.${styles.expGrid}`, start: 'top 85%' },
      y: 24,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { scope: rootRef });

  return (
    <section id="software" ref={rootRef} className={styles.software}>
      <div className="container">
        <div className={styles.header}>
          <span className={`${styles.reveal} eyebrow`}>{t('software.eyebrow')}</span>
          <h2 className={`${styles.reveal} ${styles.heading} font-display`}>
            {t('software.heading')}
          </h2>
          <p className={`${styles.reveal} ${styles.subheading}`}>
            {t('software.subheading')}
          </p>
        </div>

        {stats.isLive && (
          <div className={`${styles.reveal} ${styles.statsShell}`}>
            <div className={styles.statsCore}>
              <div className={styles.liveBadge}>
                <span className={styles.liveDot} />
                {t('software.liveFromGithub')}
              </div>
              <div className={styles.statsRow}>
                <div className={styles.statBlock}>
                  <div className={`${styles.statNumber} font-display`}>{stats.repos}</div>
                  <div className={styles.statLabel}>{t('software.statRepos')}</div>
                </div>
                <div className={styles.statBlock}>
                  <div className={`${styles.statNumber} font-display`}>{stats.languages}</div>
                  <div className={styles.statLabel}>{t('software.statLanguages')}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.cardGrid}>
          {PROJECT_ORDER.map(({ key, icon: Icon }) => (
            <div key={key} className={styles.cardShell}>
              <div className={styles.card}>
                <Icon size={26} strokeWidth={1.5} className={styles.cardIcon} />
                <h3 className={`${styles.cardTitle} font-display`}>{t(`software.projects.${key}.title`)}</h3>
                <h4 className={styles.cardSubtitle}>{t(`software.projects.${key}.subtitle`)}</h4>
                <p className={styles.cardDesc}>{t(`software.projects.${key}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.expHeader}>
          <h3 className={`${styles.reveal} ${styles.expHeading} font-display`}>
            {t('software.experience.heading')}
          </h3>
        </div>

        <div className={styles.expGrid}>
          {EXPERIENCE_ORDER.map((key) => (
            <div key={key} className={styles.expCard}>
              <h4 className={`${styles.expTitle} font-display`}>{t(`software.experience.${key}.title`)}</h4>
              <span className={styles.expOrg}>{t(`software.experience.${key}.org`)}</span>
              <p className={styles.expDesc}>{t(`software.experience.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
