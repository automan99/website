import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateProductCatalog } from '../src/data/products/validate.ts';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const family = readJson(new URL('../src/data/products/ht540.json', import.meta.url));
const en = readJson(new URL('../src/i18n/content/en/products.json', import.meta.url));
const zh = readJson(new URL('../src/i18n/content/zh/products.json', import.meta.url));

test('HT540 data passes validation and contains the expected variants', () => {
  const errors = validateProductCatalog(
    [family],
    { en, zh },
    { publicDir: join(process.cwd(), 'public'), locales: ['en', 'zh'] }
  );
  assert.deepEqual(errors, []);
  assert.equal(family.id, 'ht540');
  assert.equal(family.variants.length, 3);
  assert.deepEqual(family.variants.map((variant) => variant.id), ['lf', 'hf', 'uhf']);
  assert.equal(family.defaultVariant, 'uhf');
  assert.ok(JSON.stringify(family).includes('IP65'));
  assert.ok(JSON.stringify(family).includes('Android 10'));
});
