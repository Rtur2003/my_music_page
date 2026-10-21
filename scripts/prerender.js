// Prerenders both languages into static HTML (dist/index.html and dist/en/index.html),
// each with its own <head>, and writes sitemap.xml and llms.txt from the same data.
// Crawlers and link previews get real content instead of an empty #root.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = `${root}dist`;
const ssrDir = `${root}dist-ssr`;

const { render, headTags, sitemapXml, llmsTxt } = await import(pathToFileURL(`${ssrDir}/entry-server.js`).href);
const template = await readFile(`${dist}/index.html`, 'utf8');

const ROOT_MARKER = '<div id="root"></div>';
const HEAD_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
if (!template.includes(ROOT_MARKER)) throw new Error('prerender: #root marker not found in dist/index.html');
if (!HEAD_BLOCK.test(template)) throw new Error('prerender: <!--seo:start/end--> block not found in dist/index.html');

const pages = { tr: `${dist}/index.html`, en: `${dist}/en/index.html` };
await mkdir(`${dist}/en`, { recursive: true });

for (const [lang, file] of Object.entries(pages)) {
  const html = template
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(HEAD_BLOCK, headTags(lang))
    .replace(ROOT_MARKER, `<div id="root">${render(lang)}</div>`);

  // Fail the build rather than ship a page search engines would misread.
  const checks = {
    lang: html.includes(`<html lang="${lang}"`),
    canonical: html.includes(`rel="canonical" href="https://hasan-arthur-altuntas.com.tr${lang === 'en' ? '/en/' : '/'}"`),
    hreflang: ['hreflang="tr"', 'hreflang="en"', 'hreflang="x-default"'].every((h) => html.includes(h)),
    jsonLd: html.includes('application/ld+json'),
    h1: /<h1[\s>]/.test(html),
  };
  const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
  if (failed.length) throw new Error(`prerender: ${lang} page failed checks: ${failed.join(', ')}`);

  await writeFile(file, html);
}

await writeFile(`${dist}/sitemap.xml`, sitemapXml());
await writeFile(`${dist}/llms.txt`, llmsTxt());
await rm(ssrDir, { recursive: true, force: true });
console.log('prerender: wrote /, /en/, sitemap.xml, llms.txt');
