import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import styles from './Navbar.module.css';

const SECTIONS = [
  { id: 'hero' },
  { id: 'project-list', nav: 'project-list' },
  { id: 'discography', nav: 'project-list' },
  { id: 'about', nav: 'about' },
  { id: 'software', nav: 'software' },
  { id: 'contact', nav: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const { t, lang, toggleLang } = useTranslation();
  const active = SECTIONS[sectionIndex].nav ?? null;

  const NAV_ITEMS = [
    { label: t('nav.works'), id: 'project-list' },
    { label: t('nav.about'), id: 'about' },
    { label: t('nav.software'), id: 'software' },
    { label: t('nav.contact'), id: 'contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sections nest (the archive sits inside the records section), so track every
  // one on the centre line and use the deepest.
  useEffect(() => {
    const onLine = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) onLine.add(entry.target.id);
          else onLine.delete(entry.target.id);
        });
        const deepest = SECTIONS.reduce((found, c, i) => (onLine.has(c.id) ? i : found), -1);
        if (deepest !== -1) setSectionIndex(deepest);
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    setMenuOpen(false);
    // Unlock before scrolling: changing overflow mid-animation cancels a smooth scroll.
    document.body.style.overflow = '';
    const target = document.getElementById(targetId);
    if (target) target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <header className={styles.header}>
      <a href="#main" className={styles.skipLink}>{t('nav.skip')}</a>
      <nav className={`${styles.navShell} ${scrolled ? styles.scrolled : ''}`} aria-label={t('nav.label')}>
        <a
          href="#hero"
          className={styles.brand}
          onClick={(e) => handleScroll(e, 'hero')}
          aria-label={t('nav.home')}
        >
          <img src="/assets/images/logo-mark.webp" alt="" className={styles.brandMark} width="28" height="37" />
          <span className={`${styles.brandName} font-display`} aria-hidden="true">Hasan&nbsp;Arthur</span>
        </a>

        <ul className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleScroll(e, item.id)}
                className={styles.link}
                aria-current={active === item.id ? 'location' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.status}>
          <button
            type="button"
            className={styles.langToggle}
            onClick={toggleLang}
            aria-label={t('nav.switchLang')}
            lang={lang === 'tr' ? 'en' : 'tr'}
          >
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
          <button
            type="button"
            className={styles.menuToggle}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
        <span className={styles.progress} aria-hidden="true" />
      </nav>

      <div id="mobile-menu" className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`} inert={!menuOpen}>
        <ul className={styles.overlayLinks}>
          {NAV_ITEMS.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleScroll(e, item.id)}
                className={`${styles.overlayLink} font-display`}
                style={{ transitionDelay: menuOpen ? `${i * 60 + 100}ms` : '0ms' }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
