// prebuild: refresh src/data/repos.json (stars, language, last push) for the
// projects in src/data/projects.js from the public GitHub API. GITHUB_TOKEN is
// optional (higher rate limit). Never fails the build: on error the file is kept.
import { readFile, writeFile } from 'node:fs/promises';
import { TRACKS } from '../src/data/projects.js';

const target = new URL('../src/data/repos.json', import.meta.url);
const current = JSON.parse(await readFile(target, 'utf8').catch(() => '{}'));
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'hasan-arthur-site' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

try {
  const entries = await Promise.all(TRACKS.map(async ({ repo }) => {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) throw new Error(`${repo}: HTTP ${res.status}`);
    const data = await res.json();
    return [repo, { stars: data.stargazers_count, language: data.language, pushedAt: data.pushed_at.slice(0, 10) }];
  }));
  await writeFile(target, `${JSON.stringify(Object.fromEntries(entries), null, 2)}\n`);
  console.log(`sync-repos: ${entries.length} repos`);
} catch (error) {
  console.warn(`sync-repos: ${error.message}; keeping ${Object.keys(current).length} cached repos`);
}
