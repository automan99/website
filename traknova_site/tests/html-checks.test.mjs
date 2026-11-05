import test from 'node:test';
import assert from 'node:assert/strict';
import { hasHtmlLanguage, hasAlternateLanguage } from '../scripts/lib/html-checks.mjs';

test('html language check ignores hreflang attributes', () => {
  assert.equal(hasHtmlLanguage('<link rel="alternate" hreflang="en">', 'en'), false);
});

test('html language check reads the html element language', () => {
  assert.equal(hasHtmlLanguage('<html lang="en">', 'en'), true);
  assert.equal(hasHtmlLanguage('<html lang="zh-CN">', 'zh-CN'), true);
  assert.equal(hasHtmlLanguage('<html lang="fr">', 'en'), false);
});

test('alternate check requires a link rel=alternate element', () => {
  assert.equal(hasAlternateLanguage('<a href="/x" hreflang="en">', 'en'), false);
  assert.equal(hasAlternateLanguage('<link rel="alternate" hreflang="en" href="/x">', 'en'), true);
});
