import React, { useState } from 'react';
import SmoothScroll from './components/SmoothScroll';
import NoiseOverlay from './components/NoiseOverlay';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProjectList from './components/ProjectList';
import Software from './components/Software';
import Contact from './components/Contact';
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
      <NoiseOverlay />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {isLoading && (
          <Preloader onComplete={() => setIsLoading(false)} />
        )}
        
        {!isLoading && <Navbar isPlaying={isPlaying} />}
        
        <Hero />
        <About />
        <ProjectList 
          setHoveredProject={setHoveredProject} 
          playingTrackId={playingTrackId}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
        />
        <Software />
        <Contact />
        
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
