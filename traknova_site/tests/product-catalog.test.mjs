import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCategoryLabel,
  getProductCategories,
  getProductFamilies,
  getProductFamily,
  getProductVariant,
  getProductHref
} from '../src/data/products/catalog.ts';

test('returns three families in order', () => {
  const families = getProductFamilies('en');
  assert.deepEqual(families.map((family) => family.id), ['rfid-handhelds', 'ht600', 'y100']);
  assert.deepEqual(families.map((family) => family.order), [1, 2, 3]);
});

test('groups families into three categories', () => {
  const categories = getProductCategories('en');
  assert.deepEqual(
    categories.map((category) => category.id),
    ['rfid-handheld', 'barcode-handheld', 'rugged-tablet']
  );
  assert.deepEqual(
    categories.map((category) => category.label),
    ['RFID Handhelds', 'Barcode Handhelds', 'Rugged Tablets']
  );
  assert.deepEqual(
    categories.map((category) => category.members.map((family) => family.id)),
    [['rfid-handhelds'], ['ht600'], ['y100']]
  );
  assert.deepEqual(
    categories.map((category) => category.representative.id),
    ['rfid-handhelds', 'ht600', 'y100']
  );
});

test('labels every product category', () => {
  assert.equal(getCategoryLabel('en', 'rfid-handheld'), 'RFID Handhelds');
  assert.equal(getCategoryLabel('en', 'barcode-handheld'), 'Barcode Handhelds');
  assert.equal(getCategoryLabel('en', 'rugged-tablet'), 'Rugged Tablets');
});

test('merges localized variant copy', () => {
  const family = getProductFamily('zh', 'y100-series');
  assert.equal(family.name, 'Y100 Series');
  assert.equal(family.variants.length, 5);
  assert.ok(family.variants[0].summary.length > 0);
});

test('resolves variants by id', () => {
  const family = getProductFamily('en', 'rfid-handhelds');
  assert.equal(getProductVariant(family, 'uhf').model, 'HT540-UHF');
  assert.equal(getProductVariant(family, 'missing'), undefined);
});

test('builds variant deep links', () => {
  const family = getProductFamily('en', 'y100-series');
  assert.equal(getProductHref(family, 'rfid'), '/products/y100-series/#variant-rfid');
  assert.equal(getProductHref(family), '/products/y100-series/');
});
