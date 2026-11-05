import en from './dictionaries/en.json';
import type { Locale } from './config';

export type Dictionary = typeof en;

const dictionaries: Partial<Record<Locale, Dictionary>> = { en };

export function getDictionary(locale: Locale): Dictionary {
  const dictionary = dictionaries[locale];
  if (!dictionary) throw new Error(`Missing dictionary for locale "${locale}"`);
  return dictionary;
}
