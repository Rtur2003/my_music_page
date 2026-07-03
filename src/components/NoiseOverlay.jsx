import React from 'react';

export default function NoiseOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9998, // Just below the cursor
        opacity: 0.4,
        /* We use a tiny webp/png repeating background for noise. 
           In a real scenario, this would point to an optimized noise.webp asset. */
        backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/O6f+AAAACHRSTlMAMwA0MwA0M0U0MzQAAABHSURBVDjL42BgQAIXf8gwYIB3nxlY8JvBwf/D3wwO3n0mYMFvBgf/D38zOHj3mYEFvxkc/D/8zeDg3WcCFvxmcPD/8DeDg/cDAM6sVb1+xP+BAAAAAElFTkSuQmCC")',
        backgroundRepeat: 'repeat',
        mixBlendMode: 'overlay',
      }}
    />
  );
}
