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

## Live Spotify data

The page never goes stale, in three layers:

1. **Always on, no setup:** the official Spotify artist embed in the discography shows the current popular tracks.
2. **Runtime (Worker):** `worker/index.js` serves `GET /api/releases` from the Spotify Web API (6 h edge cache). On load the page swaps in the live discography, and the hero sleeve and "new release" button follow the newest release.
3. **Build time:** `npm run build` runs `scripts/sync-spotify.js` first and rewrites `src/data/releases.json`, so the prerendered HTML and JSON-LD match Spotify.

Layers 2 and 3 need a Spotify app (developer.spotify.com, client-credentials; no user login):

```bash
npx wrangler secret put SPOTIFY_CLIENT_ID
npx wrangler secret put SPOTIFY_CLIENT_SECRET
```

For local or CI builds, export the same two variables. Without them, `/api/releases` answers 204 and the build keeps the committed `releases.json`; nothing breaks.

## Deploy

`public/_headers` sets security headers (CSP included) and cache policy. If you add a third-party script, image host or iframe, extend the CSP there.
