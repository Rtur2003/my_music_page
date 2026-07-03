import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Play, Pause } from 'lucide-react';
import { musicCatalog } from '../data/music-catalog';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectList({ setHoveredProject, playingTrackId, isPlaying, onTogglePlay }) {
  const containerRef = useRef();
  const sliderRef = useRef();

  useGSAP(() => {
    // We get all the panels
    let panels = gsap.utils.toArray('.horizontal-panel');
    
    // Set up horizontal scrolling
    let ctx = gsap.context(() => {
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          // Scroll length matches total width
          end: () => "+=" + sliderRef.current.offsetWidth
        }
      });
    }, containerRef);
    
    return () => ctx.revert(); // cleanup
  });

  return (
    <section id="project-list" ref={containerRef} style={{
      width: '100%',
      height: '100vh', // Needs to take full viewport height to pin properly
      backgroundColor: 'var(--color-bg)',
      overflow: 'hidden', // Hide horizontal overflow
      position: 'relative',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center'
    }}>
      
      {/* Title that stays fixed while scrolling */}
      <h2 className="font-display" style={{
        position: 'absolute',
        top: 'var(--space-md)',
        left: 'var(--space-md)',
        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
        fontWeight: 700,
        color: 'var(--color-primary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        zIndex: 20
      }}>
        Selected Works
      </h2>

      {/* The scrolling container */}
      <div 
        ref={sliderRef}
        style={{
          display: 'flex',
          height: '100%',
          width: `${musicCatalog.length * 100}vw`, // e.g., 600vw for 6 items
        }}
      >
        {musicCatalog.map((track) => (
          <div 
            key={track.id}
            className="horizontal-panel"
            style={{
              width: '100vw',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: 'var(--space-md)'
            }}
          >
            {/* Artistic Background per panel */}
            <div style={{
              position: 'absolute',
              top: '5%',
              left: '5%',
              right: '5%',
              bottom: '5%',
              background: track.backgroundGradient,
              borderRadius: '30px',
              border: '1px solid var(--color-border)',
              filter: 'grayscale(30%)',
              opacity: 0.3,
              zIndex: 1
            }}></div>

            {/* Content inside the panel */}
            <div className="project-panel-content" style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              maxWidth: '1200px',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 'var(--space-xl)',
              alignItems: 'center'
            }}>
              
              {/* Giant Play Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePlay(track.id);
                }}
                style={{
                  background: 'rgba(10,10,10,0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid var(--color-primary)',
                  borderRadius: '50%',
                  width: 'clamp(80px, 10vw, 120px)',
                  height: 'clamp(80px, 10vw, 120px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.color = '#0a0a0a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = 'rgba(10,10,10,0.6)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
              >
                {playingTrackId === track.id && isPlaying 
                  ? <Pause size={40} /> 
                  : <Play size={40} style={{ marginLeft: '6px' }} />
                }
              </button>

              {/* Text Information */}
              <div>
                <div style={{ 
                  display: 'inline-block',
                  padding: '5px 15px', 
                  backgroundColor: 'rgba(212, 176, 120, 0.1)',
                  border: '1px solid var(--color-primary)',
                  borderRadius: '20px',
                  color: 'var(--color-primary)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  marginBottom: '1rem'
                }}>
                  {track.genre}
                </div>
                
                <h3 className="font-display" style={{
                  fontSize: 'clamp(3rem, 6vw, 7rem)',
                  fontWeight: 900,
                  margin: 0,
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  color: 'white',
                  textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  marginBottom: '1rem'
                }}>
                  {track.title}
                </h3>
                
                <p style={{
                  fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
                  color: 'rgba(255,255,255,0.7)',
                  maxWidth: '800px',
                  lineHeight: 1.6,
                  marginBottom: '2rem'
                }}>
                  {track.description}
                </p>

                {/* Platform Links */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {track.spotifyUrl && (
                    <a href={track.spotifyUrl} target="_blank" rel="noreferrer" style={{ 
                      color: '#1DB954', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'opacity 0.3s'
                    }} onMouseEnter={(e)=>e.currentTarget.style.opacity=0.7} onMouseLeave={(e)=>e.currentTarget.style.opacity=1}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM19.081 10.2c-3.959-2.34-10.44-2.52-14.22-1.38-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38 4.32-1.32 11.52-1.08 16.08 1.62.54.3.72 1.02.42 1.56-.24.54-.9.72-1.68.36z"/></svg>
                        Spotify
                    </a>
                  )}
                  {track.youtubeUrl && (
                    <a href={track.youtubeUrl} target="_blank" rel="noreferrer" style={{ 
                      color: '#FF0000',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'opacity 0.3s'
                    }} onMouseEnter={(e)=>e.currentTarget.style.opacity=0.7} onMouseLeave={(e)=>e.currentTarget.style.opacity=1}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      YouTube
                    </a>
                  )}
                  {track.appleUrl && (
                    <a href={track.appleUrl} target="_blank" rel="noreferrer" style={{ 
                      color: '#FA243C',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'opacity 0.3s'
                    }} onMouseEnter={(e)=>e.currentTarget.style.opacity=0.7} onMouseLeave={(e)=>e.currentTarget.style.opacity=1}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.274 15.421c-.42.66-1.5 1.56-2.58 1.56-1.02 0-1.32-.6-2.52-.6-1.26 0-1.62.6-2.58.6-1.08 0-2.04-.9-2.58-1.56-1.56-1.92-2.22-5.46-.84-7.56.78-1.14 1.86-1.86 3.12-1.86 1.02 0 1.92.54 2.52.54.6 0 1.62-.6 2.76-.6.36 0 2.34.06 3.42 1.38-.06.06-2.04 1.14-2.04 3.36 0 2.7 2.46 3.66 2.46 3.66-.06.18-.36 1.02-1.14 2.16zM13.26 4.621c.54-.66.9-1.5.84-2.34-.84.06-1.8.6-2.34 1.26-.48.6-.9 1.5-.78 2.4.9.06 1.74-.54 2.28-1.32z"/></svg>
                      Apple Music
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
