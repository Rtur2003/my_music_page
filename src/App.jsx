import React from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { ReleasesProvider } from './data/ReleasesContext';
import { PlayerProvider } from './player/PlayerContext';
import Player from './components/Player';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProjectList from './components/ProjectList';
import Software from './components/Software';
import Contact, { Footer } from './components/Contact';

function App({ lang }) {

  return (
    <LanguageProvider lang={lang}>
      <ReleasesProvider>
      <PlayerProvider>
      <SmoothScroll>
        <Navbar />

        <main id="main" tabIndex={-1} style={{ position: 'relative', zIndex: 1 }}>
          <Hero />
          <ProjectList />
          <About />
          <Software />
          <Contact />
        </main>
        <Footer />
        <Player />
      </SmoothScroll>
      </PlayerProvider>
      </ReleasesProvider>
    </LanguageProvider>
  );
}

export default App;
