import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { useReleases } from '../data/ReleasesContext';
import { yearRange } from '../data/music-catalog';
import styles from './About.module.css';

// One statement and the liner notes beside it. Release count and years come
// from the live catalog, so they never go stale.
const WORLDS = 'Crimson Desert, The Odyssey, Interstellar, NULL VECTOR, Embermelody';

function yearSpan(releases) {
  const range = yearRange(releases);
  if (!range) return '';
  return range[0] === range[1] ? `${range[0]}` : `${range[0]}–${range[1]}`;
}

export default function About() {
  const { lang } = useTranslation();
  const en = lang === 'en';
  const { releases } = useReleases();
  const span = yearSpan(releases);
  const recordings = `${releases.length} ${en ? 'releases' : 'yayın'}${span ? ` · ${span}` : ''}`;

  const notes = en
    ? [
        ['Role', 'Composer, pianist, producer'],
        ['Worlds', WORLDS],
        ['Instruments', 'Piano, orchestra, beats, ambient'],
        ['Recordings', recordings],
        ['Based in', 'Düzce, Türkiye'],
      ]
    : [
        ['Rol', 'Besteci, piyanist, prodüktör'],
        ['Dünyalar', WORLDS],
        ['Çalgılar', 'Piyano, orkestra, beat, ambient'],
        ['Kayıtlar', recordings],
        ['Şehir', 'Düzce, Türkiye'],
      ];

  return (
    <section id="about" className={`${styles.about}`} aria-labelledby="about-heading">
      <div className={`section-head ${styles.head}`}>
        <h2 id="about-heading">{en ? 'About' : 'Hakkımda'}</h2>
        <span>Hasan Arthur Altuntaş</span>
      </div>
      <p className={styles.statement}>
        {en
          ? 'I rework music from games and films for piano and orchestra, and write my own pieces. Away from the piano I build open-source software that works with sound.'
          : 'Oyun ve film müziklerini piyano ve orkestra için yeniden düzenliyor, kendi parçalarımı yazıyorum. Piyanonun başında olmadığım zamanlarda sesle çalışan açık kaynak yazılımlar geliştiriyorum.'}
      </p>
      <dl className={styles.notes}>
        {notes.map(([term, value]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
        <div>
          <dt>{en ? 'Writing' : 'Yazılar'}</dt>
          <dd>
            <a href="https://medium.com/@hasannarthurrr" target="_blank" rel="me noopener">
              Medium <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
