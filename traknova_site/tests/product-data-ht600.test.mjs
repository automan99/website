import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateProductCatalog } from '../src/data/products/validate.ts';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const family = readJson(new URL('../src/data/products/ht600.json', import.meta.url));
const en = readJson(new URL('../src/i18n/content/en/products.json', import.meta.url));
const zh = readJson(new URL('../src/i18n/content/zh/products.json', import.meta.url));
const serialized = JSON.stringify(family);

test('HT600 data passes validation and is a single-variant barcode handheld', () => {
  const errors = validateProductCatalog(
    [family],
    { en, zh },
    { publicDir: join(process.cwd(), 'public'), locales: ['en', 'zh'] }
  );
  assert.deepEqual(errors, []);
  assert.equal(family.id, 'ht600');
  assert.equal(family.category, 'barcode-handheld');
  assert.equal(family.order, 2);
  assert.equal(family.variants.length, 1);
  assert.equal(family.defaultVariant, 'standard');
  assert.match(family.comparison.capture, /1D\/2D/);
});

test('HT600 publishes only confirmed specification values', () => {
  assert.ok(serialized.includes('8,000 mAh'));
  assert.ok(serialized.includes('IP68'));
  assert.ok(serialized.includes('Android 13'));
  assert.ok(serialized.includes('2.2 GHz'));
  assert.ok(serialized.includes('-30 to 60'));
  assert.ok(!serialized.includes('18 W'));
  assert.ok(!serialized.includes('Android 15'));
  assert.ok(!serialized.includes('-20 to 60'));
  assert.ok(!/\b(CE|FCC|RoHS)\b|MIL-STD/.test(serialized));
});
