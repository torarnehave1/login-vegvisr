import { createContext, useContext } from 'react';
import type { Language } from './i18n';

type LanguageContextValue = {
  language: Language;
  setLanguage: (value: Language) => void;
};

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageContext.Provider');
  }
  return context;
};
