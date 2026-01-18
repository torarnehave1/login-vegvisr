import { translations, type Language } from './i18n';

const getValue = (obj: Record<string, unknown>, path: string[]) => {
  let current: unknown = obj;
  for (const part of path) {
    if (!current || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
};

export const useTranslation = (language: Language) => {
  const t = (key: string) => {
    const value = getValue(translations[language], key.split('.'));
    if (typeof value === 'string') return value;
    return key;
  };

  return t;
};
