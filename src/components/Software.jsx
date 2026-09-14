import { ArrowUpRight, AudioLines } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './Software.module.css';

export default function Software() {
  const { lang } = useTranslation();
  const en = lang === 'en';
  return (
    <section id="software" className={styles.software}>
      <div className={styles.copy}>
        <span>CrownCode</span>
        <h2>{en ? 'The other side\nof the record.' : 'Plağın\ndiğer yüzü.'}</h2>
        <p>
          {en
            ? 'Audio intelligence, creative tools and open-source experiments. The engineering behind the curiosity.'
            : 'Ses zekâsı, yaratıcı araçlar ve açık kaynak deneyler. Merakın mühendislik tarafı.'}
        </p>
        <a
          href="https://hasanarthuraltuntas.xyz"
          target="_blank"
          rel="noreferrer"
        >
          {en ? 'Explore CrownCode' : 'CrownCode’u keşfet'}
          <ArrowUpRight size={20} />
        </a>
      </div>
      <a
        className={styles.feature}
        href="https://hasanarthuraltuntas.xyz/ai-music-detection"
        target="_blank"
        rel="noreferrer"
      >
        <AudioLines size={45} strokeWidth={1} />
        <div className={styles.signal} aria-hidden="true">
          {Array.from({ length: 45 }, (_, i) => (
            <i
              key={i}
              style={{
                height: `${12 + Math.abs(Math.sin(i * 0.71) * Math.cos(i * 0.21)) * 85}%`,
              }}
            />
          ))}
        </div>
        <div className={styles.featureTitle}>
          <h3>AURIS</h3>
          <ArrowUpRight size={24} />
        </div>
        <p>
          {en
            ? 'Can a machine hear the difference?'
            : 'Bir makine farkı duyabilir mi?'}
        </p>
        <span>
          {en
            ? 'AI-generated music detection'
            : 'Yapay zekâ ile üretilen müzik tespiti'}
        </span>
      </a>
    </section>
  );
}
