import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from './translations';

const STORAGE_KEY = 'hasan-arthur-site-lang';
const LanguageContext = createContext(null);

function resolvePath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'tr';
    return window.localStorage.getItem(STORAGE_KEY) || 'tr';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(STORAGE_KEY, lang);
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

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useTranslation must be used within a LanguageProvider');
  return ctx;
}
