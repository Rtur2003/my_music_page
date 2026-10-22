import releases from './releases.json' with { type: 'json' };
import localCovers from './local-covers.json' with { type: 'json' };

// releases.json is refreshed at build time (scripts/sync-catalog.js: Apple dates +
// Spotify ids) and live at runtime (worker /api/releases → ReleasesContext). Newest first.
export const musicCatalog = releases;

export const artistProfile = {
  spotifyId: '6D5NDnftFDOelT5ssMe0ef',
  spotifyUrl: 'https://open.spotify.com/artist/6D5NDnftFDOelT5ssMe0ef',
  appleMusicUrl: 'https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368',
  deezerUrl: 'https://www.deezer.com/artist/274514701',
  tidalUrl: 'https://tidal.com/artist/49240204',
  qobuzUrl: 'https://open.qobuz.com/artist/23169884',
  musicBrainzUrl: 'https://musicbrainz.org/artist/c311c619-df0f-4b34-8f56-fe65effe9984',
};

export const spotifyAlbumUrl = (release) => (release.spotifyId ? `https://open.spotify.com/album/${release.spotifyId}` : null);
export const appleAlbumUrl = (release) => (release.appleId ? `https://music.apple.com/tr/album/${release.appleId}` : null);

// Where "listen" goes: Spotify when the id is known, otherwise Apple Music.
export const albumUrl = (release) => spotifyAlbumUrl(release) ?? appleAlbumUrl(release);
export const albumService = (release) => (release.spotifyId ? 'Spotify' : 'Apple Music');

// The in-page player: Spotify's embed, or Apple Music's for releases without a Spotify id.
export function embedFor(release) {
  if (release.spotifyId) {
    return { src: `https://open.spotify.com/embed/album/${release.spotifyId}?utm_source=generator&theme=0`, height: 152 };
  }
  return { src: `https://embed.music.apple.com/tr/album/${release.appleId}?app=music&theme=dark`, height: 175 };
}

// Curated records for the pinned "selected recordings" stage, each with its
// display name. A record missing from the catalog is skipped instead of
// breaking the stage.
const FEATURED = [
  { id: '4vFvtR83SCitvFGQKM1RMu', name: 'Crimson Desert' },
  { id: '5FCUNSEIFdnK5EIXl0pZ61', name: 'The Odyssey' },
  { id: '3NM3JPDVnoPdKyY64l6th5', name: 'NULL VECTOR' },
];
export const featured = FEATURED.flatMap(({ id, name }) => {
  const release = releases.find((r) => r.id === id);
  return release ? [{ ...release, name }] : [];
});

// First and last release year of a catalog (null when no release is dated).
export function yearRange(list) {
  const years = list.map((r) => r.year ?? Number(String(r.date).slice(0, 4))).filter(Number.isFinite);
  return years.length ? [Math.min(...years), Math.max(...years)] : null;
}

// Both CDNs serve the same cover at other sizes: Spotify by hash prefix
// (00001e02 = 300px, 0000b273 = 640px), Apple by the size in the path. The newest
// release's cover is also copied to /covers at build time (scripts/sync-covers.js),
// since it is the hero image and the page's largest paint.
export function coverArt(release, large = false) {
  if (localCovers[release.id]) return `/covers/${release.id}-${large ? 640 : 300}.jpg`;
  if (!large) return release.cover;
  return release.cover
    .replace('ab67616d00001e02', 'ab67616d0000b273')
    .replace('/300x300bb.', '/640x640bb.');
}
