import { renderToString } from 'react-dom/server';
import App from './App.jsx';

export { headTags, sitemapXml, llmsTxt } from './seo/seo.js';

export function render(lang) {
  return renderToString(<App lang={lang} />);
}
