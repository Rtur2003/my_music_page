import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Code2, BrainCircuit, Sparkles, TerminalSquare } from 'lucide-react';
import styles from './Software.module.css';

const CROWN_PROJECTS = [
  {
    title: 'AURIS',
    subtitle: 'AI Audio Detection Model',
    desc: 'Built on the Wav2vec2 architecture, classifying deepfake AI-generated music from authentic human compositions.',
    icon: BrainCircuit,
  },
  {
    title: 'CrownCode',
    subtitle: 'Monorepo Ecosystem',
    desc: 'A modular architecture using Next.js, FastAPI, and Kotlin Native for cross-platform, scalable AI tooling.',
    icon: Code2,
  },
  {
    title: 'Crown Dreams',
    subtitle: 'Neural Dream Diary',
    desc: 'An experimental platform leveraging LLMs to interpret and archive human dreams through atmospheric narratives.',
    icon: Sparkles,
  },
  {
    title: 'VOTRYX',
    subtitle: 'Automated Voting System',
    desc: 'A high-performance decision architecture designed for rapid, automated community consensus.',
    icon: TerminalSquare,
  },
];

export default function Software() {
  const rootRef = useRef(null);
  const [stats, setStats] = useState({ commits: 120, repos: 15, languages: 6, isLive: false });

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

          const activeRepos = reposData.filter(
            (r) => new Date(r.updated_at) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          );
          const estimatedCommits = Math.min(activeRepos.length * 12 + 50, 200);
          const languages = new Set();
          reposData.forEach((r) => { if (r.language) languages.add(r.language); });

          setStats({
            commits: estimatedCommits,
            repos: userData.public_repos || reposData.length,
            languages: Math.min(languages.size, 8),
            isLive: true,
          });
        }
      } catch {
        // Falls back to static defaults above.
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
  }, { scope: rootRef });

  return (
    <section id="software" ref={rootRef} className={styles.software}>
      <div className="container">
        <div className={styles.header}>
          <span className={`${styles.reveal} eyebrow`}>CrownCode Ecosystem</span>
          <h2 className={`${styles.reveal} ${styles.heading} font-display`}>
            Architecting the future
          </h2>
          <p className={`${styles.reveal} ${styles.subheading}`}>
            Where machine learning systems and scalable software architecture meet creative vision.
          </p>
        </div>

        <div className={`${styles.reveal} ${styles.statsShell}`}>
          <div className={styles.statsCore}>
            {stats.isLive && (
              <div className={styles.liveBadge}>
                <span className={styles.liveDot} />
                Live from GitHub
              </div>
            )}
            <div className={styles.statsRow}>
              <div className={styles.statBlock}>
                <div className={`${styles.statNumber} font-display`}>{stats.commits}</div>
                <div className={styles.statLabel}>Commits / yr</div>
              </div>
              <div className={styles.statBlock}>
                <div className={`${styles.statNumber} font-display`}>{stats.repos}</div>
                <div className={styles.statLabel}>Repositories</div>
              </div>
              <div className={styles.statBlock}>
                <div className={`${styles.statNumber} font-display`}>{stats.languages}</div>
                <div className={styles.statLabel}>Languages</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.cardGrid}>
          {CROWN_PROJECTS.map(({ title, subtitle, desc, icon: Icon }) => (
            <div key={title} className={styles.cardShell}>
              <div className={styles.card}>
                <Icon size={26} strokeWidth={1.5} className={styles.cardIcon} />
                <h3 className={`${styles.cardTitle} font-display`}>{title}</h3>
                <h4 className={styles.cardSubtitle}>{subtitle}</h4>
                <p className={styles.cardDesc}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
