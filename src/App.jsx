import React from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import SmoothScroll from './components/SmoothScroll';
import NoiseOverlay from './components/NoiseOverlay';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProjectList from './components/ProjectList';
import Software from './components/Software';
import Contact from './components/Contact';

function App() {

  return (
    <LanguageProvider>
      <SmoothScroll>
        <NoiseOverlay />

        <main style={{ position: 'relative', zIndex: 1 }}>
          <Navbar />

          <Hero />
          <ProjectList />
          <About />
          <Software />
          <Contact />
        </main>
      </SmoothScroll>
    </LanguageProvider>
  );
}

export default App;
