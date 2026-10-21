// The language comes from the URL (/ = Turkish, /en/ = English) so every
// language has its own indexable page; switching languages is a real link.
export const LANG_PREF_KEY = 'hasan-arthur-site-lang';
export const langPath = (lang) => (lang === 'en' ? '/en/' : '/');
export const langFromPath = (pathname) => (/^\/en(\/|$)/.test(pathname) ? 'en' : 'tr');
