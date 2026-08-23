import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { label: 'About', id: 'about' },
  { label: 'Works', id: 'project-list' },
  { label: 'Software', id: 'software' },
  { label: 'Contact', id: 'contact' },
];

export default function Navbar({ isPlaying }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(() => {
    gsap.from(`.${styles.navShell}`, {
      y: -40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 2.3,
    });
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.getElementById(targetId);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`${styles.navShell} ${scrolled ? styles.scrolled : ''}`}>
        <a
          href="#hero"
          className={styles.brand}
          onClick={(e) => handleScroll(e, 'hero')}
        >
          <img src="/assets/images/logo-transparent.png" alt="" className={styles.brandMark} />
          <span className={`${styles.brandName} font-display`}>Hasan&nbsp;Arthur</span>
        </a>

        <div className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleScroll(e, item.id)}
              className={styles.link}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className={styles.status}>
          {isPlaying ? (
            <div className={styles.waveIndicator} aria-label="Playing">
              <span className="sound-wave-bar" />
              <span className="sound-wave-bar" />
              <span className="sound-wave-bar" />
              <span className="sound-wave-bar" />
            </div>
          ) : (
            <span className={styles.idleDot} aria-hidden="true" />
          )}
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`}>
        <div className={styles.overlayLinks}>
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleScroll(e, item.id)}
              className={`${styles.overlayLink} font-display`}
              style={{ transitionDelay: menuOpen ? `${i * 60 + 100}ms` : '0ms' }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
