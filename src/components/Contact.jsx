import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Coffee, Mail, Globe } from 'lucide-react';
import { FaSpotify, FaYoutube, FaInstagram, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
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
          <span className={`${styles.reveal} eyebrow`}>Let's Collaborate</span>
          <h2 className={`${styles.reveal} ${styles.heading} font-display`}>
            Create the next<br />masterpiece.
          </h2>
          <p className={`${styles.reveal} ${styles.lede}`}>
            Whether it's a cinematic score for your next film or a technical
            solution built with the same care, I'm here to bring the vision to life.
          </p>

          <div className={`${styles.reveal} ${styles.actions}`}>
            <a href="mailto:contact@hasanarthuraltuntas.xyz" className={styles.primaryCta}>
              <Mail size={18} />
              Say Hello
            </a>
            <a href="https://iyzi.link/AJspVg" target="_blank" rel="noreferrer" className={styles.secondaryCta}>
              <Coffee size={18} />
              Support the Art
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
            <a href="https://hasanarthuraltuntas.xyz" target="_blank" rel="noreferrer" className={styles.socialLink}>
              <Globe size={22} />
              <span>Portfolio</span>
            </a>
          </div>
        </div>
      </div>

      <div className={`${styles.reveal} ${styles.footerBar} container`}>
        <span>&copy; {new Date().getFullYear()} Hasan Arthur Altuntaş. All rights reserved.</span>
        <span className="font-mono">crafted with passion &amp; precision</span>
      </div>
    </section>
  );
}
