import type { Language } from './i18n';

const STORAGE_KEY = 'vegvisr_login_language';

export const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  const value = window.localStorage.getItem(STORAGE_KEY) as Language | null;
  if (!value) return 'en';
  return value;
};

export const setStoredLanguage = (language: Language) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, language);
};
