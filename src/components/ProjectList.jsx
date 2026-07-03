import React from 'react';

const projects = [
  { id: 1, title: 'Nebula', role: 'WebGL & React', year: '2026' },
  { id: 2, title: 'Echoes', role: 'Creative Direction', year: '2025' },
  { id: 3, title: 'Aura', role: 'Fullstack', year: '2025' },
  { id: 4, title: 'Prism', role: 'Three.js / GLSL', year: '2024' },
];

export default function ProjectList({ setHoveredProject }) {
  return (
    <section className="container" style={{ minHeight: '100vh', paddingBottom: 'var(--space-xl)' }}>
      <h2 className="font-display" style={{ fontSize: 'var(--text-5xl)', marginBottom: 'var(--space-xl)' }}>Case Studies</h2>
      
      <div className="project-list" style={{ display: 'flex', flexDirection: 'column' }}>
        {projects.map(proj => (
          <div 
            key={proj.id}
            className="project-row"
            data-cursor-text="View Case"
            onMouseEnter={() => setHoveredProject(proj.id)}
            onMouseLeave={() => setHoveredProject(null)}
            style={{ 
              display: 'grid', 
              /* Using minmax to enforce clamp and prevent text overlap */
              gridTemplateColumns: 'minmax(0, 1fr) auto auto', 
              alignItems: 'center', 
              gap: 'var(--space-md)',
              padding: 'var(--space-md) 0',
              borderBottom: '1px solid var(--color-border)',
              cursor: 'none'
            }}
          >
            <h3 
              className="font-display no-overlap-title" 
              style={{ 
                fontSize: 'var(--text-4xl)', 
                fontWeight: 700,
                transition: 'transform 0.5s var(--ease-out-expo)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(20px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              {proj.title}
            </h3>
            
            <span 
              className="text-muted" 
              style={{ 
                fontSize: 'var(--text-sm)', 
                paddingLeft: 'var(--space-lg)',
                whiteSpace: 'nowrap'
              }}
            >
              {proj.role}
            </span>
            
            <span 
              className="text-muted" 
              style={{ 
                fontSize: 'var(--text-sm)',
                whiteSpace: 'nowrap',
                minWidth: '60px',
                textAlign: 'right'
              }}
            >
              {proj.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
