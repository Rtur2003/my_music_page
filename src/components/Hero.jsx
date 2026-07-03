import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Hero() {
  const containerRef = React.useRef();

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 2.8 }); // Wait for preloader + navbar
    
    // Reveal Image
    tl.to('.hero-image-wrapper', {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
      duration: 1.5,
      ease: 'power4.inOut'
    }, 0);

    // Reveal Texts
    tl.from('.hero-text-line', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power4.out',
      rotation: 2
    }, 0.5);
    
    // Stats reveal
    tl.from('.hero-stat', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    }, 1.2);

  }, { scope: containerRef });

  return (
    <section ref={containerRef} style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: 'var(--space-2xl) var(--space-md) 0',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-2xl)',
        alignItems: 'center'
      }}>
        {/* Left Column - Text */}
        <div style={{ paddingRight: 'var(--space-xl)' }}>
          <h2 className="font-display" style={{ 
            fontSize: 'var(--text-lg)',
            fontWeight: 500,
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginBottom: 'var(--space-md)'
          }}>
            <div className="hero-text-line">Cinematic Music Producer</div>
          </h2>
          
          <h1 className="font-display" style={{ 
            fontSize: 'clamp(4rem, 8vw, 8rem)',
            fontWeight: 900,
            lineHeight: 0.9,
            margin: '0 0 var(--space-xl) 0',
            textTransform: 'uppercase'
          }}>
            <div style={{ overflow: 'hidden' }}><div className="hero-text-line">HASAN</div></div>
            <div style={{ overflow: 'hidden' }}><div className="hero-text-line">ARTHUR</div></div>
          </h1>
          
          <div style={{ overflow: 'hidden', marginBottom: 'var(--space-xl)' }}>
            <p className="hero-text-line" style={{ 
              fontSize: 'var(--text-md)',
              color: 'var(--color-text-muted)',
              maxWidth: '500px',
              lineHeight: 1.8
            }}>
              Creating atmospheric soundscapes and reimagining iconic film scores. 
              Each composition tells a story through the universal language of music, 
              bringing emotional depth to every note.
            </p>
          </div>

          {/* Stats */}
          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-xl)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 'var(--space-lg)'
          }}>
            <div className="hero-stat">
              <div className="font-display" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-primary)' }}>10+</div>
              <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>Original Tracks</div>
            </div>
            <div className="hero-stat">
              <div className="font-display" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-primary)' }}>12K+</div>
              <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>Total Plays</div>
            </div>
            <div className="hero-stat">
              <div className="font-display" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-primary)' }}>3</div>
              <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>Platforms</div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Image */}
        <div style={{ position: 'relative', height: '70vh' }}>
          <div className="hero-image-wrapper" style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)', // Starts hidden from bottom
            overflow: 'hidden',
            borderRadius: '12px'
          }}>
            <img 
              src="/assets/images/hasan-arthur-profile.jpg" 
              alt="Hasan Arthur"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(20%) contrast(110%)'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
