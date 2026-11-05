import { DEFAULT_LOCALE, ENABLED_LOCALES, type Locale } from './config';

/**
 * Static paths for localized pages. English lives at the root, so only
 * non-default enabled locales are generated under /[lang]/.
 */
export function localizedRouteParams(): Array<{ params: { lang: Locale } }> {
  return ENABLED_LOCALES
    .filter((locale) => locale !== DEFAULT_LOCALE)
    .map((lang) => ({ params: { lang } }));
}
