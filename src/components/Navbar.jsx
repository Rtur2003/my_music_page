import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Navbar({ isPlaying }) {
  useGSAP(() => {
    gsap.from('.nav-item', {
      y: -20,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 2.5
    });
  });

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      padding: 'var(--space-md) var(--space-xl)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      mixBlendMode: 'difference'
    }}>
      <div className="nav-item font-display" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'none' }} data-cursor-text="Home" onClick={(e) => handleScroll(e, 'root')}>
        <img src="/assets/images/logo-transparent.png" alt="Hasan Arthur Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <span style={{ fontWeight: 700, fontSize: 'var(--text-lg)', letterSpacing: '0.05em', color: 'white' }}>
          HASAN ARTHUR
        </span>
      </div>
      
      <div className="nav-item nav-links font-display" style={{ display: 'flex', gap: 'var(--space-lg)' }}>
        {['About', 'Selected Works', 'Software', 'Contact'].map((item) => {
          const targetId = item.toLowerCase().replace(' ', '-');
          const finalId = targetId === 'selected-works' ? 'project-list' : targetId;
          
          return (
            <a 
              key={item}
              href={`#${finalId}`}
              onClick={(e) => handleScroll(e, finalId)}
              style={{
                fontSize: 'var(--text-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'white',
                textDecoration: 'none',
                position: 'relative',
                cursor: 'none'
              }}
              className="nav-link"
              data-cursor-text="Go"
            >
              {item}
            </a>
          );
        })}
      </div>

      <div className="nav-item font-display" style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'white', display: 'flex', alignItems: 'center', gap: '15px' }}>
        {isPlaying ? (
          <div style={{ display: 'flex', alignItems: 'center', height: '15px' }}>
            <span className="sound-wave-bar"></span>
            <span className="sound-wave-bar"></span>
            <span className="sound-wave-bar"></span>
            <span className="sound-wave-bar"></span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', height: '15px', gap: '3px' }}>
            <span style={{ width: '4px', height: '4px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '2px' }}></span>
            <span style={{ width: '4px', height: '4px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '2px' }}></span>
            <span style={{ width: '4px', height: '4px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '2px' }}></span>
          </div>
        )}
        <span>Sakarya, TR</span>
      </div>
    </nav>
  );
}
