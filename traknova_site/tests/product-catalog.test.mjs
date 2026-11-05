import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getProductFamilies,
  getProductFamily,
  getProductVariant,
  getProductHref
} from '../src/data/products/catalog.ts';

test('returns three families in order', () => {
  const families = getProductFamilies('en');
  assert.deepEqual(families.map((family) => family.id), ['ht540', 'ht550', 'y100']);
  assert.deepEqual(families.map((family) => family.order), [1, 2, 3]);
});

test('merges localized variant copy', () => {
  const family = getProductFamily('zh', 'y100-series');
  assert.equal(family.name, 'Y100 Series');
  assert.equal(family.variants.length, 5);
  assert.ok(family.variants[0].summary.length > 0);
});

test('resolves variants by id', () => {
  const family = getProductFamily('en', 'ht540-series');
  assert.equal(getProductVariant(family, 'uhf').model, 'HT540-UHF');
  assert.equal(getProductVariant(family, 'missing'), undefined);
});

test('builds variant deep links', () => {
  const family = getProductFamily('en', 'y100-series');
  assert.equal(getProductHref(family, 'rfid'), '/products/y100-series/#variant-rfid');
  assert.equal(getProductHref(family), '/products/y100-series/');
});
