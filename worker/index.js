// Serves the static site and one live endpoint, GET /api/releases: the full
// discography from Apple's public iTunes API (no key needed), merged with Spotify
// album ids. Optional secrets add Spotify's own list on top:
//   npx wrangler secret put SPOTIFY_CLIENT_ID
//   npx wrangler secret put SPOTIFY_CLIENT_SECRET
import committed from '../src/data/releases.json' with { type: 'json' };
import { fetchAppleReleases, mergeReleases } from '../shared/catalog.js';
import { fetchReleases, getToken } from '../shared/spotify.js';

const CACHE_SECONDS = 6 * 60 * 60;

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });

async function spotifyBase(env) {
  if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) return committed;
  try {
    const spotify = await fetchReleases(await getToken(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET));
    return [...spotify, ...committed.filter((r) => !r.spotifyId)];
  } catch (error) {
    console.error('releases: spotify', error.message);
    return committed;
  }
}

async function releases(request, env, ctx) {
  if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405, { Allow: 'GET' });

  const cache = caches.default;
  const key = new Request(new URL('/api/releases', request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;

  const [base, apple] = await Promise.all([
    spotifyBase(env),
    fetchAppleReleases().catch((error) => {
      console.error('releases: apple', error.message);
      return null;
    }),
  ]);
  // Neither live source answered: the page keeps the catalog it was built with.
  if (!apple && base === committed) return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });

  const body = { updatedAt: new Date().toISOString(), releases: mergeReleases(base, apple ?? []) };
  const res = json(body, 200, { 'Cache-Control': `public, max-age=${CACHE_SECONDS}` });
  ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/releases') return releases(request, env, ctx);
    return env.ASSETS.fetch(request);
  },
};
