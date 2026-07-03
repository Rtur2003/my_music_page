import React, { useState } from 'react';
import SmoothScroll from './components/SmoothScroll';
import MagneticCursor from './components/MagneticCursor';
import NoiseOverlay from './components/NoiseOverlay';
import ProjectCanvas from './components/ProjectCanvas';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectList from './components/ProjectList';

function App() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SmoothScroll>
      <MagneticCursor />
      <NoiseOverlay />
      
      {/* WebGL Canvas for Hover Effects */}
      <ProjectCanvas hoveredProject={hoveredProject} />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {isLoading && (
          <Preloader onComplete={() => setIsLoading(false)} />
        )}
        
        {!isLoading && <Navbar />}
        
        <Hero />
        <ProjectList setHoveredProject={setHoveredProject} />
        
      </main>
    </SmoothScroll>
  );
}

export default App;
