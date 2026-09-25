// Injects the server-rendered app into dist/index.html so crawlers and
// link previews get real content instead of an empty #root.
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const ssrDir = `${root}dist-ssr`;
const htmlPath = `${root}dist/index.html`;

const { render } = await import(pathToFileURL(`${ssrDir}/entry-server.js`).href);
const template = await readFile(htmlPath, 'utf8');
const marker = '<div id="root"></div>';

if (!template.includes(marker)) throw new Error('prerender: #root marker not found in dist/index.html');

await writeFile(htmlPath, template.replace(marker, `<div id="root">${render()}</div>`));
await rm(ssrDir, { recursive: true, force: true });
console.log('prerender: dist/index.html populated');
