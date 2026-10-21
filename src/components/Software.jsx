import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { TRACKS } from '../data/projects';
import repos from '../data/repos.json';
import styles from './Software.module.css';

export default function Software() {
  const { lang } = useTranslation();
  const en = lang === 'en';
  const updated = new Intl.DateTimeFormat(en ? 'en-GB' : 'tr-TR', { month: 'long', year: 'numeric' });

  return (
    <section id="software" className={`${styles.software}`} aria-labelledby="software-heading">
      <div className={`section-head ${styles.head}`}>
        <h2 id="software-heading">{en ? 'Software' : 'Yazılım'}</h2>
        <span>{TRACKS.length} {en ? 'projects' : 'proje'}</span>
      </div>
      <div className={styles.copy}>
        <p>{en ? 'Open-source projects on sound and AI. The code is on GitHub.' : 'Ses ve yapay zekâ üzerine açık kaynak projeler. Kodları GitHub’da.'}</p>
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
          const repo = repos[track.repo];
          const facts = [
            track.stack,
            repo && (en ? `${repo.stars} ${repo.stars === 1 ? 'star' : 'stars'}` : `${repo.stars} yıldız`),
            repo && `${en ? 'updated' : 'güncellendi'} ${updated.format(new Date(repo.pushedAt))}`,
          ].filter(Boolean).join(' · ');
          return (
            <li key={track.repo}>
              <a href={track.url} target="_blank" rel="noopener" className={styles.track}>
                <span className={styles.body}>
                  <span className={styles.name}>{track.name}</span>
                  <span className={styles.hook}>{track[lang]}</span>
                  <span className={styles.meta}>{facts}</span>
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
