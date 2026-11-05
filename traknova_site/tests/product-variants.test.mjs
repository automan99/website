import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseVariantHash,
  buildVariantHash,
  getInitialVariant
} from '../src/scripts/product-variants.mjs';

test('parses a known variant hash', () => {
  assert.equal(parseVariantHash('#variant-rfid', ['standard', 'rfid']), 'rfid');
});

test('rejects an unknown variant hash', () => {
  assert.equal(parseVariantHash('#variant-missing', ['standard', 'rfid']), null);
  assert.equal(parseVariantHash('', ['standard']), null);
});

test('builds a variant hash', () => {
  assert.equal(buildVariantHash('5g'), '#variant-5g');
});

test('prefers hash, then default, then first variant', () => {
  assert.equal(getInitialVariant(['a', 'b'], 'a', '#variant-b'), 'b');
  assert.equal(getInitialVariant(['a', 'b'], 'b', '#variant-missing'), 'b');
  assert.equal(getInitialVariant(['a', 'b'], 'missing', ''), 'a');
});
