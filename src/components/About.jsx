import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Music, SlidersHorizontal, Film, Headphones } from 'lucide-react';

export default function About() {
  useGSAP(() => {
    gsap.from('.about-text-reveal', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 70%',
      },
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.skill-card', {
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 80%',
      },
      scale: 0.9,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'back.out(1.5)'
    });
  });

  const skills = [
    { icon: <Music size={24} />, title: "Multi-Instrumentalist" },
    { icon: <SlidersHorizontal size={24} />, title: "Music Production" },
    { icon: <Film size={24} />, title: "Music Composition" },
    { icon: <Headphones size={24} />, title: "Mixing & Mastering" }
  ];

  return (
    <section id="about" style={{
      padding: 'var(--space-2xl) var(--space-md)',
      position: 'relative',
      zIndex: 10,
      backgroundColor: 'var(--color-bg)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2xl)', alignItems: 'center' }}>
          
          <div>
            <h2 className="font-display about-text-reveal" style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 'var(--space-lg)'
            }}>
              Musical Journey & Vision
            </h2>
            
            <h3 className="font-display about-text-reveal" style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              lineHeight: 1.1,
              fontWeight: 900,
              marginBottom: 'var(--space-xl)',
              textTransform: 'uppercase'
            }}>
              Every note is an emotion,<br/>every melody is a memory.
            </h3>
            
            <p className="about-text-reveal" style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.8,
              marginBottom: 'var(--space-xl)'
            }}>
              I tell stories in the universal language of music. In the world of cinematic and instrumental music, I express myself while taking listeners on an emotional journey.
            </p>
          </div>

          <div className="skills-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-md)'
          }}>
            {skills.map((skill, i) => (
              <div key={i} className="skill-card" style={{
                padding: 'var(--space-xl)',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 'var(--space-md)',
                transition: 'all 0.3s ease',
                cursor: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}
              data-cursor-text="Explore">
                <div style={{ color: 'var(--color-primary)' }}>{skill.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>{skill.title}</div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
