// Spotify Web API access shared by the Cloudflare Worker (live /api/releases)
// and scripts/sync-spotify.js (build-time refresh). Client-credentials flow only:
// no user data, just the public discography.
export const ARTIST_ID = '6D5NDnftFDOelT5ssMe0ef';

export async function getToken(clientId, clientSecret, fetchImpl = fetch) {
  const res = await fetchImpl('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`spotify token: HTTP ${res.status}`);
  return (await res.json()).access_token;
}

// Spotify files EPs under album_type "single"; 4+ tracks is its own EP rule.
export function normalizeAlbum(album) {
  const byClosestTo300 = [...(album.images ?? [])].sort((a, b) => Math.abs(a.width - 300) - Math.abs(b.width - 300));
  return {
    id: album.id,
    title: album.name,
    type: album.album_type === 'album' ? 'album' : album.total_tracks >= 4 ? 'ep' : 'single',
    year: Number(album.release_date?.slice(0, 4)) || null,
    date: album.release_date ?? null,
    tracks: album.total_tracks ?? null,
    cover: byClosestTo300[0]?.url ?? null,
  };
}

export async function fetchReleases(token, fetchImpl = fetch) {
  const albums = [];
  let url = `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?include_groups=album,single&market=TR&limit=50`;
  while (url) {
    const res = await fetchImpl(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`spotify albums: HTTP ${res.status}`);
    const page = await res.json();
    albums.push(...page.items);
    url = page.next;
  }
  const seen = new Set();
  return albums
    .map(normalizeAlbum)
    .filter((release) => release.cover && !seen.has(release.id) && seen.add(release.id))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}
