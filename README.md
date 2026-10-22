# hasan-arthur-altuntas.com.tr

Music site of Hasan Arthur Altuntaş — React 19 + Vite 8, GSAP/Lenis motion, deployed as static assets on Cloudflare Workers.

## Scripts

```bash
npm run dev      # dev server (client-rendered)
npm run build    # client build → SSR build → prerender into dist/index.html
npm run preview  # serve dist/ like production: CSP from _headers, brotli, real 404s, /api/releases → 204
npm run lint     # oxlint
```

## How the build works

- `prebuild` refreshes the data the page is built from: `sync-catalog.js` (releases + Apple previews → `src/data/releases.json`), `sync-repos.js` (GitHub stars/language/last push → `src/data/repos.json`) and `sync-covers.js` (newest cover → `public/covers/`, so the hero image, the LCP element, is served from the site itself). Each keeps the previous data if a source is down.
- `scripts/prerender.js` renders `<App />` with `react-dom/server` for both languages, inlines the stylesheet and writes `dist/index.html` and `dist/en/index.html`; `src/main.jsx` hydrates it. Crawlers and link previews get real HTML.
- One surface, one type family: Archivo (SIL OFL, self-hosted in `public/fonts/`), with its width axis for display type. Red (`--color-signal`) only means "live".
- `src/player/engine.js` plays a release's 30-second Apple preview through Web Audio and exposes its spectrum. `src/components/Turntable.jsx` turns the hero record with it and lights its grooves; `Player.jsx` is the transport with a live meter. "Full track" (or a release without a preview) falls back to the plain Spotify / Apple Music embed. Any "listen" button calls `usePlayer().play(release)`.
- `src/components/Timeline.jsx` plots every release by date (height = track count); the archive below is its table view.

## SEO

Everything search engines read is generated from `src/seo/seo.js` and the release catalog:

| URL | What it is |
|---|---|
| `/` and `/en/` | Prerendered Turkish and English pages, each with its own title, description, canonical, `hreflang` pair and JSON-LD (`Person`, `MusicGroup` + every release as `MusicAlbum`, `ProfilePage`, `WebSite`) |
| `/sitemap.xml` | Both pages with `hreflang` alternates and cover images; regenerated every build |
| `/robots.txt` | Allows everything except `/api/`, points to the sitemap |
| `/llms.txt` | Plain-text summary for AI search (llmstxt.org) |
| `/404.html` | Real 404 status (`not_found_handling = "404-page"`), `noindex` |
| `/humans.txt`, `/.well-known/security.txt` | Credits and security contact (renew `Expires` before 2027-10-20) |
| `/6860447ba78a1dfb9a9e413d239632de.txt` | IndexNow key; `npm run indexnow` after a deploy pings Bing, Yandex and others |

The language comes from the URL; the TR/EN switch is a real link, so both pages are crawlable.

## Live discography

The page never goes stale, in three layers:

1. **Always on, no setup:** the official Spotify artist embed shows the current popular tracks. It loads on request, since it sets third-party cookies.
2. **Runtime (Worker):** `worker/index.js` serves `GET /api/releases`: every release from Apple's public iTunes API (exact dates, no key needed) merged by title with Spotify album ids (`shared/catalog.js`), cached 6 h at the edge. The page swaps it in on load; the hero follows the newest release. Releases with a Spotify id play in Spotify's embed, the rest in Apple Music's.
3. **Build time:** `npm run build` runs `scripts/sync-catalog.js` first and rewrites `src/data/releases.json`, so the prerendered HTML, JSON-LD, sitemap and `llms.txt` list the full discography.

Spotify keys are optional; with them every release also gets its Spotify id (developer.spotify.com, client-credentials, no user login):

```bash
npx wrangler secret put SPOTIFY_CLIENT_ID
npx wrangler secret put SPOTIFY_CLIENT_SECRET
```

For local or CI builds, export the same two variables. If a source is down, the committed `releases.json` is kept; nothing breaks.

## Deploy

`public/_headers` sets security headers (CSP included) and cache policy. If you add a third-party script, image host or iframe, extend the CSP there.
