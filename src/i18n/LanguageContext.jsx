import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { translations } from './translations';

const STORAGE_KEY = 'hasan-arthur-site-lang';
const LanguageContext = createContext(null);

function resolvePath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function readPreferredLang() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'tr' || stored === 'en') return stored;
  } catch {
    // storage blocked (private mode); fall through to the browser language
  }
  return navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en';
}

export function LanguageProvider({ children }) {
  // Always start as 'tr' so the client matches the prerendered HTML,
  // then switch before first paint if the visitor prefers English.
  const [lang, setLang] = useState('tr');

  useLayoutEffect(() => {
    setLang(readPreferredLang());
  }, []);

  useEffect(() => {
    const meta = translations[lang].meta;
    document.documentElement.lang = lang;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore: preference just won't persist
    }
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === 'tr' ? 'en' : 'tr'));

  const t = (path) => {
    const value = resolvePath(translations[lang], path);
    return value === undefined ? path : value;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react/only-export-components -- hook is colocated with its provider
export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useTranslation must be used within a LanguageProvider');
  return ctx;
}
