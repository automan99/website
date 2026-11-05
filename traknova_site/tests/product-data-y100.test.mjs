import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateProductCatalog } from '../src/data/products/validate.ts';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const family = readJson(new URL('../src/data/products/y100.json', import.meta.url));
const en = readJson(new URL('../src/i18n/content/en/products.json', import.meta.url));
const zh = readJson(new URL('../src/i18n/content/zh/products.json', import.meta.url));

test('Y100 data passes validation and contains five variants', () => {
  const errors = validateProductCatalog(
    [family],
    { en, zh },
    { publicDir: join(process.cwd(), 'public'), locales: ['en', 'zh'] }
  );
  assert.deepEqual(errors, []);
  assert.equal(family.id, 'y100');
  assert.deepEqual(
    family.variants.map((variant) => variant.id),
    ['standard', 'rfid', 'rtk', 'fingerprint', '5g']
  );
  assert.equal(family.defaultVariant, 'standard');
  assert.ok(JSON.stringify(family).includes('Android 16'));
  assert.ok(JSON.stringify(family).includes('Android 13'));
  assert.ok(JSON.stringify(family).includes('10,000 mAh'));
  assert.ok(JSON.stringify(family).includes('IP67'));
});
