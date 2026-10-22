import { ArrowUp } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './Contact.module.css';

const EMAIL = 'hasannarthurrr@gmail.com';
// Read once when the module loads (at build time for the prerendered page).
const YEAR = new Date().getFullYear();

// End credits: role on the left, names on the right, centred on one gutter.
const CREDITS = [
  {
    role: 'listen',
    links: [
      { name: 'Spotify', url: 'https://open.spotify.com/artist/6D5NDnftFDOelT5ssMe0ef' },
      { name: 'Apple Music', url: 'https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368' },
      { name: 'YouTube', url: 'https://www.youtube.com/channel/UCA7E1X_uGUqtSJeIxvBeTQA' },
      { name: 'Deezer', url: 'https://www.deezer.com/artist/274514701' },
    ],
  },
  {
    role: 'follow',
    links: [
      { name: 'Instagram', url: 'https://www.instagram.com/rthur_hsn' },
      { name: 'X', url: 'https://x.com/Rthur__1' },
    ],
  },
  {
    role: 'code',
    links: [
      { name: 'GitHub', url: 'https://github.com/Rtur2003' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/hasan-arthur-altuntas' },
      { name: 'CrownCode', url: 'https://hasan-arthur-altuntas.xyz' },
    ],
  },
  {
    role: 'support',
    links: [{ nameKey: 'contact.supportLink', url: 'https://iyzi.link/AJspVg' }],
  },
];

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section id="contact" className={`${styles.contact} defer-render`} aria-labelledby="contact-heading">
      <div className="section-head">
        <h2 id="contact-heading">{t('nav.contact')}</h2>
        <span>{t('contact.reply')}</span>
      </div>
      <div className={styles.inner}>
        <p className={styles.lede}>{t('contact.heading')}</p>
        <a className={styles.email} href={`mailto:${EMAIL}`}>{EMAIL}</a>

        <dl className={styles.credits} aria-label={t('contact.creditsLabel')}>
          {CREDITS.map(({ role, links }) => (
            <div key={role} className={styles.credit}>
              <dt>{t(`contact.roles.${role}`)}</dt>
              <dd>
                {links.map(({ name, nameKey, url }) => (
                  <a key={url} href={url} target="_blank" rel="me noopener">{nameKey ? t(nameKey) : name}</a>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBar}>
        <small suppressHydrationWarning>&copy; {YEAR} Hasan Arthur Altuntaş</small>
        <span>{t('contact.footerCredit')}</span>
        <a href="#hero" className={styles.backToTop}>
          {t('contact.backToTop')}
          <ArrowUp size={15} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
