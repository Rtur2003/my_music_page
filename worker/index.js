// Serves the static site and one live endpoint. Secrets (set once):
//   npx wrangler secret put SPOTIFY_CLIENT_ID
//   npx wrangler secret put SPOTIFY_CLIENT_SECRET
// Without them /api/releases answers 204 (no console noise) and the page keeps its built-in catalog.
import { fetchReleases, getToken } from '../shared/spotify.js';

const CACHE_SECONDS = 6 * 60 * 60;

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });

async function releases(request, env, ctx) {
  if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405, { Allow: 'GET' });
  if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });

  const cache = caches.default;
  const key = new Request(new URL('/api/releases', request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;

  try {
    const token = await getToken(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET);
    const body = { updatedAt: new Date().toISOString(), releases: await fetchReleases(token) };
    const res = json(body, 200, { 'Cache-Control': `public, max-age=${CACHE_SECONDS}` });
    ctx.waitUntil(cache.put(key, res.clone()));
    return res;
  } catch (error) {
    console.error('releases:', error.message);
    return json({ error: 'upstream_unavailable' }, 502);
  }
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/releases') return releases(request, env, ctx);
    return env.ASSETS.fetch(request);
  },
};
