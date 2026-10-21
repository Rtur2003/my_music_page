import React, { createContext, useContext, useEffect } from 'react';
import { translations } from './translations';

// `lang` comes from the URL; see ./lang.js.
const LanguageContext = createContext(null);

function resolvePath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function LanguageProvider({ lang = 'tr', children }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (path) => {
    const value = resolvePath(translations[lang], path);
    return value === undefined ? path : value;
  };

  return (
    <LanguageContext.Provider value={{ lang, t }}>
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
