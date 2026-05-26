import en from './en.json';
import es from './es.json';
import zh from './zh.json';
import hi from './hi.json';
import ar from './ar.json';
import fr from './fr.json';
import pt from './pt.json';
import bn from './bn.json';
import ru from './ru.json';
import ur from './ur.json';

export type Locale = keyof typeof locales;

const locales = { en, es, zh, hi, ar, fr, pt, bn, ru, ur };

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
  hi: 'हिन्दी',
  ar: 'العربية',
  fr: 'Français',
  pt: 'Português',
  bn: 'বাংলা',
  ru: 'Русский',
  ur: 'اردو',
};

/** Detect browser language or fall back to localStorage -> en */
export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('swal-locale') as Locale | null;
  if (stored && stored in locales) return stored;
  const nav = navigator.languages?.map(l => l.split('-')[0]) ?? [navigator.language?.split('-')[0]];
  for (const code of nav) {
    if (code in locales) return code as Locale;
  }
  return 'en';
}

export function setLocale(locale: Locale) {
  localStorage.setItem('swal-locale', locale);
}

let current: Locale = detectLocale();

export function t(key: string, locale?: Locale): string {
  const l = locale ?? current;
  const keys = key.split('.');
  let val: any = locales[l];
  for (const k of keys) {
    if (val && typeof val === 'object' && k in val) val = val[k];
    else return key; // fallback: return key itself
  }
  return typeof val === 'string' ? val : key;
}

export function getCurrentLocale(): Locale {
  return current;
}

export function setCurrentLocale(locale: Locale) {
  current = locale;
  if (typeof window !== 'undefined') setLocale(locale);
}
