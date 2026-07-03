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
                
                {/* Description added here */}
                <p style={{
                  fontSize: 'var(--text-base)',
                  color: 'rgba(255,255,255,0.8)',
                  marginTop: '0.75rem',
                  maxWidth: '600px',
                  lineHeight: 1.6
                }}>
                  {track.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  marginTop: '1rem'
                }}>
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    {track.genre} — {track.artist}
                  </span>
                  
                  {/* Streaming Links added here */}
                  <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                    {track.spotifyUrl && (
                      <a href={track.spotifyUrl} target="_blank" rel="noreferrer" style={{ color: '#1DB954' }}>
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM19.081 10.2c-3.959-2.34-10.44-2.52-14.22-1.38-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38 4.32-1.32 11.52-1.08 16.08 1.62.54.3.72 1.02.42 1.56-.24.54-.9.72-1.68.36z"/></svg>
                      </a>
                    )}
                    {track.youtubeUrl && (
                      <a href={track.youtubeUrl} target="_blank" rel="noreferrer" style={{ color: '#FF0000' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      </a>
                    )}
                    {track.appleUrl && (
                      <a href={track.appleUrl} target="_blank" rel="noreferrer" style={{ color: '#FA243C' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.274 15.421c-.42.66-1.5 1.56-2.58 1.56-1.02 0-1.32-.6-2.52-.6-1.26 0-1.62.6-2.58.6-1.08 0-2.04-.9-2.58-1.56-1.56-1.92-2.22-5.46-.84-7.56.78-1.14 1.86-1.86 3.12-1.86 1.02 0 1.92.54 2.52.54.6 0 1.62-.6 2.76-.6.36 0 2.34.06 3.42 1.38-.06.06-2.04 1.14-2.04 3.36 0 2.7 2.46 3.66 2.46 3.66-.06.18-.36 1.02-1.14 2.16zM13.26 4.621c.54-.66.9-1.5.84-2.34-.84.06-1.8.6-2.34 1.26-.48.6-.9 1.5-.78 2.4.9.06 1.74-.54 2.28-1.32z"/></svg>
                      </a>
                    )}
                  </div>
                </div>
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
