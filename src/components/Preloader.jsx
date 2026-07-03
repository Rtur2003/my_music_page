import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const preloaderRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Slide up the preloader
        gsap.to(preloaderRef.current, {
          y: '-100%',
          duration: 1,
          ease: 'power4.inOut',
          onComplete: onComplete
        });
      }
    });

    // Fake loading progress
    const dummyObj = { p: 0 };
    tl.to(dummyObj, {
      p: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        setProgress(Math.round(dummyObj.p));
      }
    });

  }, [onComplete]);

  return (
    <div
      ref={preloaderRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: '#050505',
        color: '#F3F4F6',
        zIndex: 99999, // Above everything
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div 
        ref={textRef}
        className="font-display" 
        style={{ 
          fontSize: 'var(--text-6xl)',
          fontWeight: 900,
          lineHeight: 1
        }}
      >
        {progress}%
      </div>
      <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--text-sm)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
        Loading Experience
      </div>
    </div>
  );
}
