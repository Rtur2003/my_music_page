import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Coffee, Mail, Globe } from 'lucide-react';
import { FaSpotify, FaYoutube, FaInstagram, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './Contact.module.css';

const SOCIALS = [
  { name: 'Spotify', icon: FaSpotify, url: 'https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef' },
  { name: 'YouTube', icon: FaYoutube, url: 'https://www.youtube.com/channel/UCA7E1X_uGUqtSJeIxvBeTQA' },
  { name: 'Instagram', icon: FaInstagram, url: 'https://www.instagram.com/rthur_hsn' },
  { name: 'X', icon: FaTwitter, url: 'https://x.com/Rthur__1' },
  { name: 'LinkedIn', icon: FaLinkedin, url: 'https://tr.linkedin.com/in/hasan-arthur-altuntas' },
  { name: 'GitHub', icon: FaGithub, url: 'https://github.com/Rtur2003' },
];

export default function Contact() {
  const rootRef = useRef(null);
  const { t } = useTranslation();

  useGSAP(() => {
    gsap.from(`.${styles.reveal}`, {
      scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
      y: 28,
      opacity: 0,
      stagger: 0.08,
      duration: 0.9,
      ease: 'power3.out',
    });
  }, { scope: rootRef });

  return (
    <section id="contact" ref={rootRef} className={styles.contact}>
      <div className={`${styles.grid} container`}>
        <div>
          <span className={`${styles.reveal} eyebrow`}>{t('contact.eyebrow')}</span>
          <h2 className={`${styles.reveal} ${styles.heading} font-display`}>
            {t('contact.heading').split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </h2>
          <p className={`${styles.reveal} ${styles.lede}`}>
            {t('contact.lede')}
          </p>

          <div className={`${styles.reveal} ${styles.actions}`}>
            <a href="mailto:hasannarthurrr@gmail.com" className={styles.primaryCta}>
              <Mail size={18} />
              {t('contact.ctaEmail')}
            </a>
            <a href="https://iyzi.link/AJspVg" target="_blank" rel="noreferrer" className={styles.secondaryCta}>
              <Coffee size={18} />
              {t('contact.ctaSupport')}
            </a>
          </div>
        </div>

        <div className={`${styles.reveal} ${styles.socialCol}`}>
          <div className={styles.socialGrid}>
            {SOCIALS.map(({ name, icon: Icon, url }) => (
              <a key={name} href={url} target="_blank" rel="noreferrer" className={styles.socialLink}>
                <Icon size={22} />
                <span>{name}</span>
              </a>
            ))}
            <a href="https://hasan-arthur-altuntas.xyz" target="_blank" rel="noreferrer" className={styles.socialLink}>
              <Globe size={22} />
              <span>{t('contact.linkPortfolio')}</span>
            </a>
          </div>
        </div>
      </div>

      <div className={`${styles.reveal} ${styles.footerBar} container`}>
        <span>&copy; {new Date().getFullYear()} Hasan Arthur Altuntaş. {t('contact.footerRights')}</span>
        <span className="font-mono">{t('contact.footerTagline')}</span>
      </div>
    </section>
  );
}
