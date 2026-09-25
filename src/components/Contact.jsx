import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './Contact.module.css';

const EMAIL = 'hasannarthurrr@gmail.com';

// End credits: role on the left, names on the right, centred on one gutter.
const CREDITS = [
  {
    role: 'listen',
    links: [
      { name: 'Spotify', url: 'https://open.spotify.com/artist/6D5NDnftFDOelT5ssMe0ef' },
      { name: 'YouTube', url: 'https://www.youtube.com/channel/UCA7E1X_uGUqtSJeIxvBeTQA' },
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
  const rootRef = useRef(null);
  const { t } = useTranslation();

  // The credits drift up as they come into view, like a roll; never hidden.
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(`.${styles.credit}`, { y: 48 }, {
        y: 0,
        ease: 'none',
        stagger: 0.08,
        scrollTrigger: { trigger: `.${styles.credits}`, start: 'top bottom', end: 'center 60%', scrub: true },
      });
    });
    return () => media.revert();
  }, { scope: rootRef });

  return (
    <section id="contact" ref={rootRef} className={styles.contact} aria-labelledby="contact-heading" data-tone="ember">
      <div className={`${styles.inner} container`}>
        <h2 id="contact-heading" className={styles.heading}>{t('contact.heading')}</h2>
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
      <div className={`${styles.footerBar} container`}>
        <small suppressHydrationWarning>&copy; {new Date().getFullYear()} Hasan Arthur Altuntaş</small>
        <span>{t('contact.footerCredit')}</span>
        <a href="#hero" className={styles.backToTop}>
          {t('contact.backToTop')}
          <ArrowUp size={15} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
