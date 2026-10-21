import React, { createContext, useContext, useEffect, useState } from 'react';
import { musicCatalog } from './music-catalog';
import { PREVIEW_ORIGIN } from '../../shared/catalog.js';

const ReleasesContext = createContext({ releases: musicCatalog, live: false, updatedAt: null });

const isRelease = (r) =>
  r && typeof r.id === 'string' && typeof r.title === 'string' &&
  (typeof r.spotifyId === 'string' || Number.isInteger(r.appleId)) &&
  typeof r.cover === 'string' && /^https:\/\/(i\.scdn\.co|is\d+-ssl\.mzstatic\.com)\//.test(r.cover);

// A preview is only ever played from Apple's preview CDN.
const withSafePreview = ({ preview, ...r }) =>
  (typeof preview === 'string' && preview.startsWith(PREVIEW_ORIGIN) ? { ...r, preview } : r);

// Starts from the built-in catalog (matches the prerendered HTML), then swaps in
// the live discography from /api/releases once the page is idle.
export function ReleasesProvider({ children }) {
  const [state, setState] = useState({ releases: musicCatalog, live: false, updatedAt: null });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch('/api/releases', { signal: controller.signal, headers: { Accept: 'application/json' } });
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) return;
        const data = await res.json();
        const releases = Array.isArray(data.releases) ? data.releases.filter(isRelease).map(withSafePreview) : [];
        if (releases.length) setState({ releases, live: true, updatedAt: data.updatedAt ?? null });
      } catch {
        // offline, aborted or not configured: the built-in catalog stays
      }
    };
    const idle = 'requestIdleCallback' in window;
    const handle = idle ? window.requestIdleCallback(load, { timeout: 3000 }) : window.setTimeout(load, 1200);
    return () => {
      controller.abort();
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  return <ReleasesContext.Provider value={state}>{children}</ReleasesContext.Provider>;
}

// eslint-disable-next-line react/only-export-components -- hook is colocated with its provider
export const useReleases = () => useContext(ReleasesContext);
