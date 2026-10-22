// prebuild: copy the newest release's cover (300 px and 640 px) into public/covers,
// so the hero image, which is the page's LCP element, comes from the site's own
// origin instead of a third-party CDN. Other covers stay on Spotify/Apple CDNs.
// Writes src/data/local-covers.json; on any error the previous files are kept.
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const dir = new URL('public/covers/', root);
const manifest = new URL('src/data/local-covers.json', root);
const [latest] = JSON.parse(await readFile(new URL('src/data/releases.json', root), 'utf8'));

// Same size rules as coverArt() in src/data/music-catalog.js.
const sized = (url, large) => (large ? url.replace('ab67616d00001e02', 'ab67616d0000b273').replace('/300x300bb.', '/640x640bb.') : url);

try {
  const files = await Promise.all([300, 640].map(async (size) => {
    const res = await fetch(sized(latest.cover, size === 640));
    if (!res.ok || !res.headers.get('content-type')?.startsWith('image/jpeg')) throw new Error(`${size}px: HTTP ${res.status}`);
    return [`${latest.id}-${size}.jpg`, Buffer.from(await res.arrayBuffer())];
  }));
  await mkdir(dir, { recursive: true });
  for (const name of await readdir(dir)) await rm(new URL(name, dir));
  for (const [name, data] of files) await writeFile(new URL(name, dir), data);
  await writeFile(manifest, `${JSON.stringify({ [latest.id]: true }, null, 2)}\n`);
  console.log(`sync-covers: ${latest.title} (${files.map(([, d]) => `${Math.round(d.length / 1024)} KB`).join(', ')})`);
} catch (error) {
  console.warn(`sync-covers: ${error.message}; keeping existing covers`);
}
