import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Navbar() {
  useGSAP(() => {
    gsap.from('.nav-item', {
      y: -20,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 2.5 // after preloader
    });
  });

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: 'var(--space-md) var(--space-md)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 50,
      pointerEvents: 'none'
    }}>
      <div className="nav-item" style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }} data-cursor-text="Home">
        <img src="/assets/images/logo-transparent.png" alt="Hasan Arthur Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <span className="font-display" style={{ fontWeight: 700, fontSize: 'var(--text-lg)', letterSpacing: '0.05em' }}>
          HASAN ARTHUR
        </span>
      </div>
      
      <div className="nav-item font-display" style={{ 
        pointerEvents: 'auto', 
        display: 'flex', 
        gap: 'var(--space-md)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        <span data-cursor-text="Work" style={{ cursor: 'none', transition: 'color 0.3s' }}>Work</span>
        <span data-cursor-text="About" style={{ cursor: 'none', transition: 'color 0.3s' }}>About</span>
        <span data-cursor-text="Contact" style={{ cursor: 'none', transition: 'color 0.3s' }}>Contact</span>
      </div>
    </nav>
  );
}
