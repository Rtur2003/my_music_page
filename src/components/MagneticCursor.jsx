import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(useGSAP);

export default function MagneticCursor() {
  const cursorRef = useRef(null);
  const cursorTextRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    // QuickTo for ultra-smooth 60fps tracking without memory leaks
    const xTo = gsap.quickTo(cursorRef.current, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(cursorRef.current, 'y', { duration: 0.6, ease: 'power3' });

    const onMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Global event listener for hover states using dataset attributes
  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor-text], [data-cursor-magnetic]');
      if (target) {
        setIsHovered(true);
        if (target.dataset.cursorText) {
          setCursorText(target.dataset.cursorText);
        }
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, []);

  useGSAP(() => {
    if (isHovered) {
      gsap.to(cursorRef.current, {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(cursorTextRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        delay: 0.1,
      });
    } else {
      gsap.to(cursorRef.current, {
        width: 16,
        height: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(cursorTextRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 0.1,
      });
    }
  }, [isHovered]);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '16px',
        height: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mixBlendMode: 'difference',
      }}
    >
      <span
        ref={cursorTextRef}
        style={{
          color: '#050505',
          fontSize: '12px',
          fontWeight: 600,
          opacity: 0,
          scale: 0.5,
          pointerEvents: 'none',
        }}
      >
        {cursorText}
      </span>
    </div>
  );
}
