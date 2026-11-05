/**
 * Point every language-switcher link at the current page plus the current
 * hash. The original href is captured once in data-base-href, so subsequent
 * hash changes replace the fragment instead of stacking it.
 */
export function applyHashToLanguageLinks(links, hash) {
  const suffix = hash || '';

  for (const link of links) {
    let base = link.getAttribute('data-base-href');
    if (base === null) {
      base = (link.getAttribute('href') || '').split('#')[0];
      link.setAttribute('data-base-href', base);
    }
    link.setAttribute('href', `${base}${suffix}`);
  }
}

export function rememberLanguage(link, storage = globalThis.localStorage) {
  try {
    storage?.setItem('traknova.lang', link.getAttribute('data-lang') || '');
  } catch (error) {
    // Storage may be unavailable in private browsing; the switch still works.
  }
}
