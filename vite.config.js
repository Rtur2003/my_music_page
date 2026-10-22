import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, resolve, sep } from 'node:path'
import { brotliCompressSync, constants } from 'node:zlib'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { headTags } from './src/seo/seo.js'

// `vite preview` sends the production CSP from public/_headers, so local testing
// catches anything the policy would block. (HTTPS upgrade is dropped on localhost.)
const productionCsp = readFileSync('public/_headers', 'utf8')
  .split(/\r?\n/)
  .find((line) => line.trim().startsWith('Content-Security-Policy:'))
  .split(/:(.*)/)[1]
  .replace('; upgrade-insecure-requests', '')
  .trim()

// The Turkish <head> (title, canonical, hreflang, Open Graph, JSON-LD) comes from
// src/seo/seo.js; scripts/prerender.js swaps in the English one for /en/.
const seoPlugin = () => ({
  name: 'seo-head',
  transformIndexHtml(html) {
    if (!html.includes('<!--seo-head-->')) throw new Error('index.html is missing the <!--seo-head--> marker')
    return html.replace('<!--seo-head-->', headTags('tr'))
  },
})

// `vite preview` answers like the Worker in production: a missing path gets
// 404.html with status 404 (wrangler.toml: not_found_handling), /api/releases
// answers 204, "no live data", so the page keeps its built catalog, and text
// assets go out brotli-compressed as Cloudflare serves them (honest lab numbers).
const COMPRESSIBLE = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
}
// Compressed once per file version; quality 5 keeps the preview server off the CPU
// while the browser under test is being measured.
const compressed = new Map()
const brotli = (file) => {
  const key = `${file}:${statSync(file).mtimeMs}`
  if (!compressed.has(key)) {
    compressed.set(key, brotliCompressSync(readFileSync(file), { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }))
  }
  return compressed.get(key)
}
const productionParity = () => ({
  name: 'production-parity',
  configurePreviewServer(server) {
    const dist = resolve(server.config.root, server.config.build.outDir)
    server.middlewares.use((req, res, next) => {
      const path = decodeURIComponent(new URL(req.url, 'http://preview').pathname)
      if (path === '/api/releases') {
        res.statusCode = 204
        res.setHeader('Cache-Control', 'no-store')
        return res.end()
      }
      const file = resolve(join(dist, path))
      const inside = file === dist || file.startsWith(dist + sep)
      const found = inside && existsSync(file) && (statSync(file).isFile() || existsSync(join(file, 'index.html')))
      if (found) {
        const target = statSync(file).isFile() ? file : join(file, 'index.html')
        const type = COMPRESSIBLE[extname(target)]
        if (!type || !/\bbr\b/.test(req.headers['accept-encoding'] ?? '')) return next()
        res.setHeader('Content-Type', type)
        res.setHeader('Content-Encoding', 'br')
        res.setHeader('Vary', 'Accept-Encoding')
        if (type.startsWith('text/html')) res.setHeader('Content-Security-Policy', productionCsp)
        return res.end(brotli(target))
      }
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(readFileSync(join(dist, '404.html')))
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoPlugin(), productionParity()],
  preview: { headers: { 'Content-Security-Policy': productionCsp } },
  // gsap ships untranspiled ESM entry points that Node can't import during prerender
  ssr: { noExternal: true },
})
