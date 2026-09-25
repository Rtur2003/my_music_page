import releases from './releases.json';

// releases.json is refreshed from Spotify at build time (scripts/sync-spotify.js)
// and live at runtime (worker /api/releases → ReleasesContext). Newest first.
export const musicCatalog = releases;

export const artistProfile = {
  spotifyId: '6D5NDnftFDOelT5ssMe0ef',
  spotifyUrl: 'https://open.spotify.com/artist/6D5NDnftFDOelT5ssMe0ef',
};

export const albumUrl = (id) => `https://open.spotify.com/album/${id}`;

// Curated records for the pinned "selected recordings" stage.
export const FEATURED_IDS = ['4vFvtR83SCitvFGQKM1RMu', '5FCUNSEIFdnK5EIXl0pZ61', '3NM3JPDVnoPdKyY64l6th5'];
export const featured = FEATURED_IDS.map((id) => releases.find((release) => release.id === id));

// Spotify serves the same cover at 300px (00001e02) and 640px (0000b273).
export function coverArt(release, large = false) {
  return large ? release.cover.replace('ab67616d00001e02', 'ab67616d0000b273') : release.cover;
}
