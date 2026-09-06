import { useState, useEffect } from 'react';
import { LanguageCode } from '../types';

const STORAGE_KEY = 'ruralcare_preferred_language';

/**
 * Architectural foundation for Marathi, Hindi, and English localization
 */
export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as LanguageCode) || 'en';
  });

  const changeLanguage = (newLang: LanguageCode) => {
    setCurrentLanguage(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return {
    currentLanguage,
    changeLanguage,
  };
};
