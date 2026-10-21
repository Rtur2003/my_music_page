# hasan-arthur-altuntas.com.tr

Music site of Hasan Arthur Altuntaş — React 19 + Vite 8, GSAP/Lenis motion, deployed as static assets on Cloudflare Workers.

## Scripts

```bash
npm run dev      # dev server (client-rendered)
npm run build    # client build → SSR build → prerender into dist/index.html
npm run preview  # serve dist/ locally
npm run lint     # oxlint
```

## How the build works

- `vite.config.js` generates the JSON-LD graph (Person, MusicGroup, albums) from `src/data/music-catalog.js`, so structured data always matches the UI.
- `scripts/prerender.js` renders `<App />` with `react-dom/server` and injects it into `dist/index.html`; `src/main.jsx` hydrates it. Crawlers and link previews get real HTML.
- `src/components/Backdrop.jsx` is one fixed, animated background behind every section. Sections set `data-tone`; the one crossing the viewport centre retints it (tones live in `Backdrop.module.css`). Keep section backgrounds transparent.
- `src/player/PlayerContext.jsx` + `src/components/Player.jsx`: one Spotify player for the whole page (plain embed, no third-party script, strict CSP). Any "listen" button calls `usePlayer().play(release)`; the small record that follows the page opens and closes it.
- Release data lives in `src/data/music-catalog.js`; cover URLs in `src/data/artwork.json` (Spotify CDN, 300px — `coverArt(url, true)` returns the 640px variant).

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

1. **Always on, no setup:** the official Spotify artist embed in the discography shows the current popular tracks.
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
