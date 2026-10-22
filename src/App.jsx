import React, { Suspense } from 'react';
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
          {/* Each boundary hydrates as its own task, so the page stays responsive
              while the sections below the fold come alive. */}
          <Suspense fallback={null}><ProjectList /></Suspense>
          <Suspense fallback={null}><About /></Suspense>
          <Suspense fallback={null}><Software /></Suspense>
          <Suspense fallback={null}><Contact /></Suspense>
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
