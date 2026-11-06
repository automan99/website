import { DEFAULT_LOCALE, LOCALE_META, isLocale, type Locale } from '../i18n/config';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Prefix root-relative paths with the site base path so the site works when
 * deployed under a subpath such as /website/. Non-root paths (external URLs,
 * mailto:, etc.) are returned unchanged.
 */
export function withBase(path: string): string {
  return path.startsWith('/') ? `${base}${path}` : path;
}

/**
 * Build an internal link for a specific locale. English has no prefix;
 * other locales are mounted under their configured prefix.
 */
export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return withBase(`${LOCALE_META[locale].pathPrefix}${normalized}`);
}

/**
 * Link to the inquiry form embedded on the contact page.
 */
export function inquiryPath(locale: Locale): string {
  return `${localizedPath(locale, '/contact/')}#request-a-quote`;
}

/**
 * Split a request pathname into the active locale and the locale-neutral
 * path. Handles the deployment base (for example /website/zh/products/).
 */
export function getPathInfo(pathname: string): { locale: Locale; path: string } {
  let logical = pathname;

  if (base && logical.startsWith(base)) {
    logical = logical.slice(base.length) || '/';
  }
  if (!logical.startsWith('/')) logical = `/${logical}`;

  const segments = logical.split('/');
  const first = segments[1];

  if (first && first !== DEFAULT_LOCALE && isLocale(first)) {
    const rest = segments.slice(2).join('/');
    return { locale: first, path: `/${rest}` };
  }

  return { locale: DEFAULT_LOCALE, path: logical };
}
