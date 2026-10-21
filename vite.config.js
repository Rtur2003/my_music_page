import { readFileSync } from 'node:fs'
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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoPlugin()],
  preview: { headers: { 'Content-Security-Policy': productionCsp } },
  // gsap ships untranspiled ESM entry points that Node can't import during prerender
  ssr: { noExternal: true },
})
