import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Hero() {
  useGSAP(() => {
    // Staggered reveal for hero text
    gsap.from('.hero-reveal', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 0.2
    });

    // Profile image floating is handled by CSS
  });

  return (
    <section id="root" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      paddingTop: 'var(--space-xl)',
      paddingBottom: 'var(--space-xl)',
      overflow: 'hidden'
    }}>
      <div className="hero-grid container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Left: Text Content */}
        <div style={{ maxWidth: '600px' }}>
          <h1 className="hero-reveal font-display" style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            color: 'var(--color-text)',
            marginBottom: '1rem',
            letterSpacing: '-2px'
          }}>
            HASAN ARTHUR
          </h1>
          
          <h2 className="hero-reveal font-display" style={{
            fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
            fontWeight: 600,
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '1.5rem',
            position: 'relative',
            display: 'inline-block'
          }}>
            Cinematic Music Producer
            <div style={{ position: 'absolute', bottom: '-8px', left: 0, width: '60px', height: '3px', background: 'var(--color-primary)', borderRadius: '2px' }}></div>
          </h2>
          
          <p className="hero-reveal" style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.8,
            marginBottom: '2.5rem'
          }}>
            Creating atmospheric soundscapes and reimagining iconic film scores. 
            Blending the art of cinematic composition with modern software engineering.
          </p>

          <div className="hero-reveal" style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem'
          }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--color-border)', minWidth: '120px' }}>
              <span className="font-display" style={{ display: 'block', fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>10+</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Original Tracks</span>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--color-border)', minWidth: '120px' }}>
              <span className="font-display" style={{ display: 'block', fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>12K+</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Plays</span>
            </div>
          </div>

          <div className="hero-reveal" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#project-list" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              backgroundColor: 'var(--color-primary)',
              color: '#0a0a0a',
              borderRadius: '50px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 176, 120, 0.4)' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
              Listen to Music
            </a>
            <a href="#about" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              backgroundColor: 'transparent',
              color: 'var(--color-primary)',
              border: '2px solid var(--color-primary)',
              borderRadius: '50px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'transform 0.3s ease, background 0.3s ease'
            }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.backgroundColor = 'var(--color-primary)'; e.currentTarget.style.color = '#0a0a0a' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-primary)' }}>
              About Me
            </a>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="hero-reveal hero-image-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          
          <div className="hero-profile" style={{
            position: 'relative',
            width: 'clamp(280px, 30vw, 400px)',
            height: 'clamp(280px, 30vw, 400px)',
            borderRadius: '50%',
            border: '4px solid var(--color-primary)',
            boxShadow: '0 0 0 8px rgba(212, 176, 120, 0.1), 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 80px rgba(212, 176, 120, 0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            overflow: 'hidden'
          }}>
            <img 
              src="/assets/images/hasan-arthur-profile.jpg" 
              alt="Hasan Arthur" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(1.1) contrast(1.05)'
              }}
            />
          </div>

          <div className="hero-halo" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(320px, 35vw, 450px)',
            height: 'clamp(320px, 35vw, 450px)',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent, var(--color-primary), transparent, var(--color-primary), transparent)',
            opacity: 0.4,
            animation: 'rotateHalo 10s linear infinite',
            zIndex: 1
          }}></div>

          <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
             <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '4px',
                height: '50px',
                padding: '10px 20px',
                background: 'rgba(10, 10, 10, 0.7)',
                borderRadius: '25px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(212, 176, 120, 0.3)'
             }}>
                {[15, 25, 20, 35, 25, 30, 20, 25, 15].map((h, i) => (
                  <span key={i} style={{
                    width: '4px',
                    height: `${h}px`,
                    background: 'linear-gradient(to top, var(--color-primary), var(--color-accent))',
                    borderRadius: '2px',
                    animation: `soundWave 1.2s ease-in-out infinite ${i * 0.1}s`
                  }}></span>
                ))}
             </div>
          </div>

        </div>

      </div>

      <style>{`
        @keyframes rotateHalo {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes soundWave {
          0%, 100% { transform: scaleY(1); opacity: 0.8; }
          50% { transform: scaleY(0.4); opacity: 1; }
        }
        .hero-profile {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
}
