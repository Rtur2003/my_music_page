// Single source for everything search engines read: <head> tags, JSON-LD,
// sitemap.xml and llms.txt. Built from the same catalog the page renders.
// Used by vite.config.js (Turkish head) and entry-server.jsx (prerender of both languages).
import { albumUrl, appleAlbumUrl, artistProfile, coverArt, musicCatalog, spotifyAlbumUrl } from '../data/music-catalog.js';
import { TRACKS } from '../data/projects.js';

export const SITE = 'https://hasan-arthur-altuntas.com.tr';
export const NAME = 'Hasan Arthur Altuntaş';
const OG_IMAGE = `${SITE}/assets/images/og-image.jpg`;
const EMAIL = 'hasannarthurrr@gmail.com';

export const LANGS = {
  tr: { path: '/', htmlLang: 'tr', locale: 'tr_TR', bcp47: 'tr-TR' },
  en: { path: '/en/', htmlLang: 'en', locale: 'en_US', bcp47: 'en-US' },
};

export const pageUrl = (lang) => `${SITE}${LANGS[lang].path}`;

const SAME_AS = [
  artistProfile.spotifyUrl,
  'https://www.youtube.com/channel/UCA7E1X_uGUqtSJeIxvBeTQA',
  artistProfile.appleMusicUrl,
  artistProfile.deezerUrl,
  artistProfile.tidalUrl,
  artistProfile.qobuzUrl,
  artistProfile.musicBrainzUrl,
  'https://www.instagram.com/rthur_hsn',
  'https://x.com/Rthur__1',
  'https://www.linkedin.com/in/hasan-arthur-altuntas',
  'https://github.com/Rtur2003',
  'https://medium.com/@hasannarthurrr',
  'https://hasan-arthur-altuntas.xyz',
];

const KIND = {
  tr: { album: 'albüm', ep: 'EP', single: 'single' },
  en: { album: 'album', ep: 'EP', single: 'single' },
};

export function meta(lang) {
  const latest = musicCatalog[0];
  const kind = KIND[lang][latest.type] ?? (lang === 'en' ? 'release' : 'yayın');
  if (lang === 'en') {
    return {
      title: `${NAME} — Composer & Pianist | Cinematic Music`,
      description: `Official site of composer and pianist ${NAME}: orchestral takes on Crimson Desert, The Odyssey and Interstellar, plus the new ${kind} ${latest.title}.`,
      ogTitle: `${NAME} — Composer & Pianist`,
      ogDescription: 'Composer and pianist. Film and game music reworked for piano and orchestra, and pieces of his own.',
      imageAlt: 'The words Hasan Arthur. beside a vinyl record with a gold label',
      jobTitle: 'Composer and pianist',
      personDescription: 'Composer and pianist writing cinematic, orchestral and game-inspired music, who also builds open-source audio AI tools under CrownCode.',
    };
  }
  return {
    title: `${NAME} — Besteci ve Piyanist | Sinematik Müzik`,
    description: `Besteci ve piyanist ${NAME}’ın resmi sitesi: Crimson Desert, The Odyssey ve Interstellar yorumları ve yeni ${kind} ${latest.title}. Hemen dinle.`,
    ogTitle: `${NAME} — Besteci ve Piyanist`,
    ogDescription: 'Besteci ve piyanist. Piyano ve orkestra için yeniden düzenlenmiş film ve oyun müzikleri, kendi parçaları.',
    imageAlt: 'Hasan Arthur. yazısı ve altın etiketli bir plak',
    jobTitle: 'Besteci ve piyanist',
    personDescription: 'Sinematik, orkestral ve oyun dünyalarından beslenen müzikler yazan besteci ve piyanist; CrownCode altında açık kaynak ses ve yapay zekâ araçları geliştiriyor.',
  };
}

const RELEASE_TYPES = {
  album: 'https://schema.org/AlbumRelease',
  single: 'https://schema.org/SingleRelease',
  ep: 'https://schema.org/EPRelease',
};

function releaseSchema(release) {
  return {
    '@type': 'MusicAlbum',
    name: release.title,
    url: albumUrl(release),
    ...(spotifyAlbumUrl(release) && appleAlbumUrl(release) && { sameAs: [appleAlbumUrl(release)] }),
    image: absolute(coverArt(release, true)),
    byArtist: { '@id': `${SITE}/#artist` },
    albumReleaseType: RELEASE_TYPES[release.type],
    ...(release.tracks && { numTracks: release.tracks }),
    ...((release.date || release.year) && { datePublished: String(release.date ?? release.year) }),
  };
}

export function structuredData(lang, today = new Date().toISOString().slice(0, 10)) {
  const m = meta(lang);
  const url = pageUrl(lang);
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: NAME,
      inLanguage: [LANGS.tr.bcp47, LANGS.en.bcp47],
      publisher: { '@id': `${SITE}/#person` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${url}#webpage`,
      url,
      name: m.title,
      description: m.description,
      inLanguage: LANGS[lang].bcp47,
      isPartOf: { '@id': `${SITE}/#website` },
      mainEntity: { '@id': `${SITE}/#person` },
      about: { '@id': `${SITE}/#artist` },
      primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE, width: 1200, height: 630 },
      dateModified: today,
    },
    {
      '@type': 'Person',
      '@id': `${SITE}/#person`,
      name: NAME,
      alternateName: 'Hasan Arthur',
      url: `${SITE}/`,
      image: `${SITE}/assets/images/logo-main.png`,
      email: `mailto:${EMAIL}`,
      jobTitle: m.jobTitle,
      description: m.personDescription,
      knowsAbout: ['Film scoring', 'Video game music', 'Piano', 'Orchestration', 'Music production', 'Audio machine learning'],
      affiliation: { '@type': 'CollegeOrUniversity', name: 'Düzce Üniversitesi', url: 'https://www.duzce.edu.tr' },
      nationality: { '@type': 'Country', name: 'Türkiye' },
      sameAs: SAME_AS,
    },
    {
      '@type': 'MusicGroup',
      '@id': `${SITE}/#artist`,
      name: NAME,
      url: `${SITE}/`,
      image: OG_IMAGE,
      genre: ['Cinematic', 'Soundtrack', 'Orchestral', 'Neoclassical'],
      founder: { '@id': `${SITE}/#person` },
      sameAs: SAME_AS.slice(0, 7),
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
  ];
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

// Covers can be site-relative (the self-hosted newest one); feeds need absolute URLs.
const absolute = (url) => (url.startsWith('/') ? `${SITE}${url}` : url);

const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Everything language-specific in <head>, between markers so the prerender can swap it.
export function headTags(lang) {
  const m = meta(lang);
  const url = pageUrl(lang);
  const other = lang === 'tr' ? 'en' : 'tr';
  return [
    '<!--seo:start-->',
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}">`,
    `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" hreflang="tr" href="${pageUrl('tr')}">`,
    `<link rel="alternate" hreflang="en" href="${pageUrl('en')}">`,
    `<link rel="alternate" hreflang="x-default" href="${pageUrl('tr')}">`,
    `<link rel="preload" as="image" href="${coverArt(musicCatalog[0], true)}" imagesrcset="${coverArt(musicCatalog[0])} 300w, ${coverArt(musicCatalog[0], true)} 640w" imagesizes="(max-width: 800px) 50vw, 29vw" fetchpriority="high">`,
    '<meta property="og:type" content="profile">',
    `<meta property="og:site_name" content="${NAME}">`,
    `<meta property="og:title" content="${esc(m.ogTitle)}">`,
    `<meta property="og:description" content="${esc(m.ogDescription)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${OG_IMAGE}">`,
    '<meta property="og:image:type" content="image/jpeg">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${esc(m.imageAlt)}">`,
    `<meta property="og:locale" content="${LANGS[lang].locale}">`,
    `<meta property="og:locale:alternate" content="${LANGS[other].locale}">`,
    '<meta property="profile:first_name" content="Hasan Arthur">',
    '<meta property="profile:last_name" content="Altuntaş">',
    `<meta property="music:musician" content="${artistProfile.spotifyUrl}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:site" content="@Rthur__1">',
    '<meta name="twitter:creator" content="@Rthur__1">',
    `<meta name="twitter:title" content="${esc(m.ogTitle)}">`,
    `<meta name="twitter:description" content="${esc(m.ogDescription)}">`,
    `<meta name="twitter:image" content="${OG_IMAGE}">`,
    `<meta name="twitter:image:alt" content="${esc(m.imageAlt)}">`,
    `<script type="application/ld+json">${structuredData(lang)}</script>`,
    '<!--seo:end-->',
  ].join('\n    ');
}

export function sitemapXml(today = new Date().toISOString().slice(0, 10)) {
  const alternates = ['tr', 'en']
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${pageUrl(l)}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl('tr')}"/>`)
    .join('\n');
  const images = [OG_IMAGE, ...musicCatalog.map((r) => absolute(coverArt(r, true)))]
    .map((src) => `    <image:image><image:loc>${src}</image:loc></image:image>`)
    .join('\n');
  const entry = (lang) => `  <url>\n    <loc>${pageUrl(lang)}</loc>\n    <lastmod>${today}</lastmod>\n${alternates}\n${images}\n  </url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entry('tr')}
${entry('en')}
</urlset>
`;
}

// llms.txt (llmstxt.org): a plain summary for AI search and assistants.
export function llmsTxt() {
  const kind = { album: 'album', ep: 'EP', single: 'single' };
  const releases = musicCatalog
    .map((r) => `- [${r.title}](${albumUrl(r)}): ${kind[r.type]}${r.date ? `, ${r.date}` : r.year ? `, ${r.year}` : ''}`)
    .join('\n');
  const projects = TRACKS.map((t) => `- [${t.name}](${t.url}): ${t.en} (${t.stack})`).join('\n');
  return `# ${NAME}

> Composer and pianist from Türkiye writing cinematic, orchestral and game-inspired music, and building open-source audio AI tools under CrownCode.

- [Official site, Turkish](${pageUrl('tr')})
- [Official site, English](${pageUrl('en')})
- [Spotify](${artistProfile.spotifyUrl})
- [Apple Music](${artistProfile.appleMusicUrl})
- [YouTube](${SAME_AS[1]})
- [Deezer](${artistProfile.deezerUrl})

## Discography (newest first)

${releases}

## Software

${projects}

## Contact

- Email: ${EMAIL}
- [GitHub](https://github.com/Rtur2003)
- [Instagram](https://www.instagram.com/rthur_hsn)
`;
}
