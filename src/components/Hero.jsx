import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const containerRef = useRef(null);
  
  useGSAP(() => {
    // Simple staggering reveal for text lines
    gsap.from('.hero-line span', {
      y: '100%',
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power4.out',
      delay: 0.2 // wait for preloader a bit, in real app tie to preloader complete
    });
    
    gsap.from('.hero-desc', {
      opacity: 0,
      y: 20,
      duration: 1,
      delay: 1,
      ease: 'power2.out'
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 className="font-display no-overlap-title" style={{ fontSize: 'var(--text-7xl)', lineHeight: 0.9, letterSpacing: '-0.03em', fontWeight: 900, textTransform: 'uppercase' }}>
        <div className="hero-line" style={{ overflow: 'hidden' }}>
          <span style={{ display: 'inline-block' }}>Creative</span>
        </div>
        <div className="hero-line" style={{ overflow: 'hidden' }}>
          <span style={{ display: 'inline-block', color: 'var(--color-text-muted)' }}>Frontend</span>
        </div>
        <div className="hero-line" style={{ overflow: 'hidden' }}>
          <span style={{ display: 'inline-block' }}>Engineer</span>
        </div>
      </h1>
      
      <p className="hero-desc" style={{ marginTop: 'var(--space-md)', maxWidth: '500px', fontSize: 'var(--text-lg)' }}>
        Elevating digital experiences through pixel-perfect design, WebGL interactions, and smooth animations.
      </p>
    </section>
  );
}
