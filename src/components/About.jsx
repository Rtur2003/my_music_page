import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Music, Code, Film, Headphones } from 'lucide-react';

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
    { icon: <Code size={24} />, title: "Software Engineering" },
    { icon: <Film size={24} />, title: "Cinematic Composition" },
    { icon: <Headphones size={24} />, title: "Audio Engineering" }
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
              Bridging Logic & Emotion
            </h2>
            
            <h3 className="font-display about-text-reveal" style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              lineHeight: 1.1,
              fontWeight: 900,
              marginBottom: 'var(--space-xl)',
              textTransform: 'uppercase'
            }}>
              Where algorithms meet <br/> cinematic soundscapes.
            </h3>
            
            <p className="about-text-reveal" style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.8,
              marginBottom: 'var(--space-xl)'
            }}>
              I tell stories through the universal language of music and the precise structure of code. 
              As a Cinematic Music Producer and AI Architect, I thrive at the intersection of art and technology. 
              Whether it's composing emotionally driven instrumental tracks like <em>"LIAR"</em> or building advanced 
              machine learning systems like <strong>AURIS</strong> (Wav2vec2 Audio Analysis) under the 
              <strong>CrownCode</strong> ecosystem, my focus is always on creating an immersive, memorable experience.
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
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 'var(--space-md)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
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
