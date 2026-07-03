import React, { useState } from 'react';
import SmoothScroll from './components/SmoothScroll';
import MagneticCursor from './components/MagneticCursor';
import NoiseOverlay from './components/NoiseOverlay';
import ProjectCanvas from './components/ProjectCanvas';

// Awwwards aesthetic typically relies on very large bold text and clean empty spaces
function App() {
  const [hoveredProject, setHoveredProject] = useState(null);

  return (
    <SmoothScroll>
      <MagneticCursor />
      <NoiseOverlay />
      
      {/* WebGL Canvas for Hover Effects */}
      <ProjectCanvas hoveredProject={hoveredProject} />

      <main style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Preloader area */}
        
        <section className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 className="font-display no-overlap-title" style={{ fontSize: 'var(--text-7xl)', lineHeight: 0.9, letterSpacing: '-0.03em', fontWeight: 900, textTransform: 'uppercase' }}>
            Creative <br/>
            <span style={{ color: 'var(--color-text-muted)' }}>Frontend</span>
          </h1>
          <p style={{ marginTop: 'var(--space-md)', maxWidth: '500px', fontSize: 'var(--text-lg)' }}>
            Elevating digital experiences through pixel-perfect design, WebGL interactions, and smooth animations.
          </p>
        </section>
        
        <section className="container" style={{ minHeight: '100vh' }}>
          <h2 className="font-display" style={{ fontSize: 'var(--text-5xl)', marginBottom: 'var(--space-xl)' }}>Case Studies</h2>
          
          <div className="project-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {[
              { id: 1, title: 'Nebula', role: 'WebGL & React', year: '2026' },
              { id: 2, title: 'Echoes', role: 'Creative Direction', year: '2025' },
              { id: 3, title: 'Aura', role: 'Fullstack', year: '2025' }
            ].map(proj => (
              <div 
                key={proj.id}
                className="project-row"
                data-cursor-text="View Case"
                onMouseEnter={() => setHoveredProject(proj.id)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'auto 1fr auto', 
                  alignItems: 'center', 
                  gap: 'var(--space-md)',
                  padding: 'var(--space-md) 0',
                  borderBottom: '1px solid var(--color-border)',
                  cursor: 'none'
                }}
              >
                <h3 className="font-display no-overlap-title" style={{ fontSize: 'var(--text-4xl)', fontWeight: 700 }}>{proj.title}</h3>
                <span className="text-muted" style={{ fontSize: 'var(--text-sm)', justifySelf: 'start', paddingLeft: 'var(--space-lg)' }}>{proj.role}</span>
                <span className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>{proj.year}</span>
              </div>
            ))}
          </div>
        </section>
        
      </main>
    </SmoothScroll>
  );
}

export default App;
