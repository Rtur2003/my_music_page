import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { LANG_PREF_KEY, langFromPath } from './i18n/lang';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lang = langFromPath(window.location.pathname);

// A visitor who explicitly picked English lands on /en/ next time. Only an explicit
// choice counts (crawlers never have one), so search engines always see each URL as is.
let preferred = null;
try { preferred = window.localStorage.getItem(LANG_PREF_KEY); } catch { /* storage blocked */ }
if (lang === 'tr' && preferred === 'en' && window.location.pathname === '/') {
  window.location.replace(`/en/${window.location.hash}`);
}

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <App lang={lang} />
  </StrictMode>
);

// Production HTML is prerendered (scripts/prerender.js); dev serves an empty root.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
