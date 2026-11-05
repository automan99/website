function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * True when the document element itself declares the given language.
 * The check is scoped to the <html ...> tag so that hreflang attributes on
 * links cannot satisfy it.
 */
export function hasHtmlLanguage(html, language) {
  const match = html.match(/<html\b[^>]*>/i);
  if (!match) return false;
  return new RegExp(`\\blang="${escapeRegExp(language)}"`).test(match[0]);
}

/**
 * True when a <link rel="alternate"> element declares the given hreflang.
 * Switcher anchors do not satisfy this check.
 */
export function hasAlternateLanguage(html, language) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    if (/\brel="alternate"/.test(tag) && new RegExp(`\\bhreflang="${escapeRegExp(language)}"`).test(tag)) {
      return true;
    }
  }
  return false;
}
