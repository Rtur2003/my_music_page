import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Play, Pause } from 'lucide-react';
import { musicCatalog } from '../data/music-catalog';

export default function ProjectList({ setHoveredProject, playingTrackId, isPlaying, onTogglePlay }) {
  useGSAP(() => {
    // Basic reveal for the project list
    gsap.from('.project-item', {
      scrollTrigger: {
        trigger: '#project-list',
        start: 'top 75%',
      },
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out'
    });
  });

  return (
    <section id="project-list" style={{
      padding: 'var(--space-2xl) var(--space-md)',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 className="font-display" style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          marginBottom: 'var(--space-xl)',
          color: 'var(--color-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Selected Works
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {musicCatalog.map((track) => (
            <div 
              key={track.id}
              className="project-item"
              onMouseEnter={() => setHoveredProject(track.id)}
              onMouseLeave={() => setHoveredProject(null)}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                alignItems: 'center',
                gap: 'var(--space-lg)',
                padding: 'var(--space-lg) 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                cursor: 'none',
                position: 'relative'
              }}
              data-cursor-text="Play"
            >
              {/* Play Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePlay(track.id);
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.color = 'white';
                }}
              >
                {playingTrackId === track.id && isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '4px' }} />}
              </button>

              <div>
                <h3 className="font-display" style={{
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  fontWeight: 900,
                  margin: 0,
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  color: playingTrackId === track.id ? 'var(--color-primary)' : 'white',
                  transition: 'color 0.3s ease'
                }}>
                  {track.title}
                </h3>
                <p style={{
                  fontSize: 'var(--text-md)',
                  color: 'var(--color-text-muted)',
                  marginTop: '0.5rem'
                }}>
                  {track.genre} — {track.artist}
                </p>
              </div>

              <div style={{
                textAlign: 'right',
                color: 'var(--color-text-muted)',
                fontFamily: 'monospace',
                fontSize: 'var(--text-md)'
              }}>
                {track.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
