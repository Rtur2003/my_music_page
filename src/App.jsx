import React, { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import SmoothScroll from './components/SmoothScroll';
import NoiseOverlay from './components/NoiseOverlay';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProjectList from './components/ProjectList';
import Software from './components/Software';
import Contact from './components/Contact';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <LanguageProvider>
      <SmoothScroll>
        <NoiseOverlay />

        <main style={{ position: 'relative', zIndex: 1 }}>
          {isLoading && (
            <Preloader onComplete={() => setIsLoading(false)} />
          )}

          {!isLoading && <Navbar />}

          <Hero />
          <About />
          <ProjectList />
          <Software />
          <Contact />
        </main>
      </SmoothScroll>
    </LanguageProvider>
  );
}

export default App;
