import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateProductCatalog } from '../src/data/products/validate.ts';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const family = readJson(new URL('../src/data/products/ht550.json', import.meta.url));
const en = readJson(new URL('../src/i18n/content/en/products.json', import.meta.url));
const zh = readJson(new URL('../src/i18n/content/zh/products.json', import.meta.url));

test('HT550 data passes validation and is a single-variant product', () => {
  const errors = validateProductCatalog(
    [family],
    { en, zh },
    { publicDir: join(process.cwd(), 'public'), locales: ['en', 'zh'] }
  );
  assert.deepEqual(errors, []);
  assert.equal(family.id, 'ht550');
  assert.equal(family.variants.length, 1);
  assert.equal(family.defaultVariant, 'standard');
  assert.ok(JSON.stringify(family).includes('9,600 mAh'));
  assert.ok(JSON.stringify(family).includes('IP67'));
});
