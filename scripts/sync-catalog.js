// prebuild: refresh src/data/releases.json so the prerendered pages, JSON-LD and
// sitemap ship the full, current discography.
//  - Apple (iTunes Search API, no key): every release with exact dates. Always runs.
//  - Spotify Web API: album ids for the in-page player, when SPOTIFY_CLIENT_ID/SECRET exist.
// Never fails the build: on any error the existing file is kept.
import { readFile, writeFile } from 'node:fs/promises';
import { fetchAppleReleases, mergeReleases } from '../shared/catalog.js';
import { fetchReleases, getToken } from '../shared/spotify.js';

const target = new URL('../src/data/releases.json', import.meta.url);
const current = JSON.parse(await readFile(target, 'utf8'));
const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret } = process.env;

let base = current;
if (clientId && clientSecret) {
  try {
    const spotify = await fetchReleases(await getToken(clientId, clientSecret));
    // Spotify is authoritative for what it knows; keep Apple-only entries from before.
    base = [...spotify, ...current.filter((r) => !r.spotifyId)];
    console.log(`sync-catalog: spotify ${spotify.length} releases`);
  } catch (error) {
    console.warn(`sync-catalog: spotify skipped (${error.message})`);
  }
} else {
  console.log('sync-catalog: no SPOTIFY_CLIENT_ID/SECRET, using committed Spotify ids');
}

try {
  const apple = await fetchAppleReleases();
  const merged = mergeReleases(base, apple);
  if (merged.length < current.length) throw new Error(`refusing to shrink catalog ${current.length} → ${merged.length}`);
  await writeFile(target, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`sync-catalog: ${merged.length} releases (${merged.filter((r) => r.spotifyId).length} with Spotify ids, apple ${apple.length})`);
} catch (error) {
  console.warn(`sync-catalog: ${error.message}; keeping existing data`);
}
