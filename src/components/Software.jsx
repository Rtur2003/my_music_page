import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Software() {
  useGSAP(() => {
    gsap.from('.software-reveal', {
      scrollTrigger: {
        trigger: '#software',
        start: 'top 75%',
      },
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out'
    });
  });

  return (
    <section id="software" style={{
      padding: 'var(--space-2xl) var(--space-md)',
      position: 'relative',
      zIndex: 10,
      backgroundColor: '#050505'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <h2 className="font-display software-reveal" style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Software Projects
          </h2>
          <p className="software-reveal" style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-muted)',
            marginTop: 'var(--space-sm)'
          }}>Where creativity meets technology</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2xl)', alignItems: 'center' }}>
          
          <div className="software-reveal">
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'white',
              lineHeight: 1.8,
              marginBottom: 'var(--space-xl)'
            }}>
              As a musician and developer, I create innovative software solutions for the music industry. From audio processing tools to music production applications.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-lg)',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: 'var(--space-xl)'
            }}>
              <div>
                <div className="font-display" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1 }}>120</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginTop: '4px' }}>GitHub Commits</div>
              </div>
              <div>
                <div className="font-display" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1 }}>15</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginTop: '4px' }}>Public Repositories</div>
              </div>
              <div>
                <div className="font-display" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1 }}>6</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginTop: '4px' }}>Programming Languages</div>
              </div>
              <div>
                <div className="font-display" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1 }}>2</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', marginTop: '4px' }}>Years Coding</div>
              </div>
            </div>
          </div>

          <div className="software-reveal" style={{
            backgroundColor: '#1e1e1e',
            borderRadius: '12px',
            padding: 'var(--space-lg)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            fontFamily: 'monospace',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-md)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }}></div>
            </div>
            
            <div style={{ color: '#d4d4d4', fontSize: '1rem', lineHeight: 1.6 }}>
              <div><span style={{ color: '#569cd6' }}>const</span> <span style={{ color: '#4fc1ff' }}>artist</span> <span style={{ color: '#d4d4d4' }}>=</span> {'{'}</div>
              <div style={{ paddingLeft: '20px' }}><span style={{ color: '#9cdcfe' }}>name</span>: <span style={{ color: '#ce9178' }}>'Hasan Arthur'</span>,</div>
              <div style={{ paddingLeft: '20px' }}><span style={{ color: '#9cdcfe' }}>music</span>: <span style={{ color: '#ce9178' }}>'🎵 Cinematic'</span>,</div>
              <div style={{ paddingLeft: '20px' }}><span style={{ color: '#9cdcfe' }}>code</span>: <span style={{ color: '#ce9178' }}>'💻 Creative'</span>,</div>
              <div style={{ paddingLeft: '20px' }}><span style={{ color: '#9cdcfe' }}>passion</span>: <span style={{ color: '#ce9178' }}>'∞'</span></div>
              <div>{'}'};</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
