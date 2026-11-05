import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateProductCatalog } from '../src/data/products/validate.ts';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const family = readJson(new URL('../src/data/products/rfid-handhelds.json', import.meta.url));
const en = readJson(new URL('../src/i18n/content/en/products.json', import.meta.url));
const zh = readJson(new URL('../src/i18n/content/zh/products.json', import.meta.url));
const serialized = JSON.stringify(family);

test('RFID Handheld Series passes validation and merges HT540 and HT550', () => {
  const errors = validateProductCatalog(
    [family],
    { en, zh },
    { publicDir: join(process.cwd(), 'public'), locales: ['en', 'zh'] }
  );
  assert.deepEqual(errors, []);
  assert.equal(family.id, 'rfid-handhelds');
  assert.equal(family.category, 'rfid-handheld');
  assert.equal(family.order, 1);
  assert.deepEqual(
    family.variants.map((variant) => variant.id),
    ['lf', 'hf', 'uhf', 'ht550']
  );
  assert.deepEqual(
    family.variants.map((variant) => variant.label),
    ['HT540 LF', 'HT540 HF', 'HT540 UHF', 'HT550']
  );
  assert.equal(family.defaultVariant, 'uhf');
  assert.ok(serialized.includes('IP65'));
  assert.ok(serialized.includes('IP67'));
  assert.ok(serialized.includes('9,600 mAh'));
});
