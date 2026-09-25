// prebuild: refresh src/data/releases.json from Spotify when credentials exist,
// so the prerendered page and JSON-LD ship the current discography.
// Never fails the build: without credentials or on API errors it keeps the file.
import { writeFile } from 'node:fs/promises';
import { fetchReleases, getToken } from '../shared/spotify.js';

const target = new URL('../src/data/releases.json', import.meta.url);
const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret } = process.env;

if (!clientId || !clientSecret) {
  console.log('sync-spotify: no SPOTIFY_CLIENT_ID/SECRET, keeping src/data/releases.json');
} else {
  try {
    const releases = await fetchReleases(await getToken(clientId, clientSecret));
    if (!releases.length) throw new Error('empty discography');
    await writeFile(target, `${JSON.stringify(releases, null, 2)}\n`);
    console.log(`sync-spotify: wrote ${releases.length} releases`);
  } catch (error) {
    console.warn(`sync-spotify: ${error.message}; keeping existing data`);
  }
}
