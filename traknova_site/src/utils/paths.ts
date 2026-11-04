const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Prefix root-relative paths with the site base path so the site works when
 * deployed under a subpath such as /website/. Non-root paths (external URLs,
 * mailto:, etc.) are returned unchanged.
 */
export function withBase(path: string): string {
  return path.startsWith('/') ? `${base}${path}` : path;
}
