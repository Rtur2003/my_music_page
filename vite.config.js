import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { albumUrl, artistProfile, coverArt, musicCatalog } from './src/data/music-catalog.js'

const SITE = 'https://hasan-arthur-altuntas.com.tr'
const NAME = 'Hasan Arthur Altuntaş'
const canonicalSpotify = (url) => url.replace('/intl-tr/', '/')

const SAME_AS = [
  canonicalSpotify(artistProfile.spotifyUrl),
  'https://www.youtube.com/channel/UCA7E1X_uGUqtSJeIxvBeTQA',
  'https://www.instagram.com/rthur_hsn',
  'https://x.com/Rthur__1',
  'https://www.linkedin.com/in/hasan-arthur-altuntas',
  'https://github.com/Rtur2003',
  'https://medium.com/@hasannarthurrr',
  'https://hasan-arthur-altuntas.xyz',
]

const RELEASE_TYPES = {
  album: 'https://schema.org/AlbumRelease',
  single: 'https://schema.org/SingleRelease',
  ep: 'https://schema.org/EPRelease',
}

function releaseSchema(release) {
  return {
    '@type': 'MusicAlbum',
    name: release.title,
    url: albumUrl(release.id),
    image: coverArt(release, true),
    byArtist: { '@id': `${SITE}/#artist` },
    albumReleaseType: RELEASE_TYPES[release.type],
    ...(release.tracks && { numTracks: release.tracks }),
    ...((release.date || release.year) && { datePublished: String(release.date ?? release.year) }),
  }
}

// Structured data is generated from the same catalog the UI renders,
// so the two can never drift apart.
function structuredData() {
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: NAME,
      inLanguage: ['tr-TR', 'en-US'],
      publisher: { '@id': `${SITE}/#person` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE}/#webpage`,
      url: `${SITE}/`,
      name: `${NAME} — Sinematik Müzik`,
      isPartOf: { '@id': `${SITE}/#website` },
      mainEntity: { '@id': `${SITE}/#person` },
      about: { '@id': `${SITE}/#artist` },
      primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/assets/images/og-image.jpg`, width: 1200, height: 630 },
      dateModified: new Date().toISOString().slice(0, 10),
    },
    {
      '@type': 'Person',
      '@id': `${SITE}/#person`,
      name: NAME,
      alternateName: 'Hasan Arthur',
      url: `${SITE}/`,
      image: `${SITE}/assets/images/logo-main.png`,
      jobTitle: 'Composer & Music Producer',
      description: 'Composer and music producer writing cinematic, orchestral and game-inspired music; also builds audio AI software under CrownCode.',
      knowsAbout: ['Cinematic music', 'Film scoring', 'Video game music', 'Music production', 'Audio machine learning'],
      nationality: { '@type': 'Country', name: 'Türkiye' },
      sameAs: SAME_AS,
    },
    {
      '@type': 'MusicGroup',
      '@id': `${SITE}/#artist`,
      name: NAME,
      url: `${SITE}/`,
      image: `${SITE}/assets/images/og-image.jpg`,
      genre: ['Cinematic', 'Soundtrack', 'Orchestral'],
      founder: { '@id': `${SITE}/#person` },
      sameAs: SAME_AS.slice(0, 3),
      album: musicCatalog.map(releaseSchema),
    },
    {
      '@type': 'Organization',
      '@id': 'https://hasan-arthur-altuntas.xyz/#org',
      name: 'CrownCode',
      url: 'https://hasan-arthur-altuntas.xyz',
      logo: `${SITE}/assets/images/logo-main.png`,
      founder: { '@id': `${SITE}/#person` },
    },
  ]
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
}

const seoPlugin = () => ({
  name: 'seo-structured-data',
  transformIndexHtml: () => [
    // Hero sleeve = newest release, so its cover is preloaded from the same data.
    { tag: 'link', attrs: { rel: 'preload', as: 'image', href: coverArt(musicCatalog[0], true), fetchpriority: 'high' }, injectTo: 'head' },
    { tag: 'script', attrs: { type: 'application/ld+json' }, children: structuredData(), injectTo: 'head' },
  ],
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoPlugin()],
  // gsap ships untranspiled ESM entry points that Node can't import during prerender
  ssr: { noExternal: true },
})
