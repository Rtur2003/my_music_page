// After a deploy, tell IndexNow engines (Bing, Yandex, Seznam, Naver…) that the
// pages changed so they recrawl quickly. Google does not use IndexNow; it reads
// sitemap.xml (submit it once in Search Console).
//   npm run indexnow
const HOST = 'hasan-arthur-altuntas.com.tr';
const KEY = '6860447ba78a1dfb9a9e413d239632de'; // must match public/<KEY>.txt
const urlList = [`https://${HOST}/`, `https://${HOST}/en/`];

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});

// 200 = accepted, 202 = accepted (key validation pending); anything else is an error.
console.log(`indexnow: HTTP ${res.status} for ${urlList.length} URLs`);
if (res.status !== 200 && res.status !== 202) process.exitCode = 1;
