import React, { useState } from 'react';
import SmoothScroll from './components/SmoothScroll';
import MagneticCursor from './components/MagneticCursor';
import NoiseOverlay from './components/NoiseOverlay';
import ProjectCanvas from './components/ProjectCanvas';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProjectList from './components/ProjectList';
import Software from './components/Software';
import YouTubePlayer from './components/YouTubePlayer';

function App() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = (trackId) => {
    if (playingTrackId === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingTrackId(trackId);
      setIsPlaying(true);
    }
  };

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
        <About />
        <ProjectList 
          setHoveredProject={setHoveredProject} 
          playingTrackId={playingTrackId}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
        />
        <Software />
        
        {playingTrackId && (
          <YouTubePlayer 
            currentTrackId={playingTrackId} 
            isPlaying={isPlaying} 
            onTrackEnd={() => setIsPlaying(false)}
          />
        )}
      </main>
    </SmoothScroll>
  );
}

export default App;
