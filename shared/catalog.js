// Builds the full discography from two official sources and merges them by title:
//  - Apple's iTunes Search API (public, no key): every release with exact dates,
//    plus a 30-second preview the page plays and analyses itself.
//  - Spotify (Web API with keys, or the committed releases.json): album ids for
//    the in-page Spotify player.
// Shared by the Worker (live /api/releases) and scripts/sync-catalog.js (build).
const APPLE_ARTIST_ID = 1758593368;

const SUFFIX = / - (Single|EP)$/;

// "Crimson Desert Going into Pywel(Remaster)" and "…Pywel (Remaster)" are the same record.
// Titles made only of punctuation ("!", "?") keep their raw form so they stay distinct.
function titleKey(title) {
  const bare = title.replace(SUFFIX, '').trim();
  return bare.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '') || `raw:${bare}`;
}

function normalizeApple(collection) {
  const suffix = collection.collectionName.match(SUFFIX)?.[1];
  return {
    title: collection.collectionName.replace(SUFFIX, '').trim(),
    type: suffix === 'EP' ? 'ep' : suffix === 'Single' ? 'single' : 'album',
    year: Number(collection.releaseDate.slice(0, 4)),
    date: collection.releaseDate.slice(0, 10),
    tracks: collection.trackCount,
    appleId: collection.collectionId,
    cover: collection.artworkUrl100.replace(/\/\d+x\d+bb\.(jpg|png)$/, '/300x300bb.$1'),
  };
}

export const PREVIEW_ORIGIN = 'https://audio-ssl.itunes.apple.com/';

// The first track's preview of every release, by Apple collection id. Apple serves
// these with CORS, so the page can read their spectrum.
async function fetchApplePreviews(fetchImpl = fetch) {
  const res = await fetchImpl(`https://itunes.apple.com/lookup?id=${APPLE_ARTIST_ID}&entity=song&limit=200&country=tr`);
  if (!res.ok) throw new Error(`itunes songs: HTTP ${res.status}`);
  const data = await res.json();
  const first = new Map();
  for (const track of data.results) {
    if (track.wrapperType !== 'track' || !track.previewUrl?.startsWith(PREVIEW_ORIGIN)) continue;
    const seen = first.get(track.collectionId);
    if (!seen || track.trackNumber < seen.trackNumber) first.set(track.collectionId, track);
  }
  return new Map([...first].map(([id, track]) => [id, track.previewUrl]));
}

export async function fetchAppleReleases(fetchImpl = fetch) {
  const [res, previews] = await Promise.all([
    fetchImpl(`https://itunes.apple.com/lookup?id=${APPLE_ARTIST_ID}&entity=album&limit=200&country=tr`),
    // Previews are a bonus: without them the page falls back to the embeds.
    fetchApplePreviews(fetchImpl).catch(() => new Map()),
  ]);
  if (!res.ok) throw new Error(`itunes: HTTP ${res.status}`);
  const data = await res.json();
  return data.results
    .filter((r) => r.wrapperType === 'collection' && r.artistId === APPLE_ARTIST_ID && r.artworkUrl100)
    .map((collection) => {
      const release = normalizeApple(collection);
      const preview = previews.get(collection.collectionId);
      return preview ? { ...release, preview } : release;
    });
}

// Spotify records keep their id, cover and type; Apple adds dates, track counts and
// every release Spotify data does not know about yet (played via the Apple Music embed).
export function mergeReleases(base, apple) {
  const byKey = new Map(base.map((r) => [titleKey(r.title), { ...r }]));
  for (const a of apple) {
    const key = titleKey(a.title);
    const known = byKey.get(key);
    if (!known) {
      byKey.set(key, { id: `am${a.appleId}`, ...a });
      continue;
    }
    byKey.set(key, {
      ...known,
      date: known.date ?? a.date,
      year: known.year ?? a.year,
      tracks: known.tracks ?? a.tracks,
      appleId: a.appleId,
      ...((a.preview ?? known.preview) && { preview: a.preview ?? known.preview }),
      ...(known.spotifyId ? {} : { cover: a.cover, type: a.type }),
    });
  }
  return [...byKey.values()].sort((x, y) => (y.date ?? '').localeCompare(x.date ?? ''));
}
