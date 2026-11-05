import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const publicDir = join(process.cwd(), 'public');
const files = [
  'images/products/ht540/ht540-lf-front.webp',
  'images/products/ht540/ht540-lf-angle.webp',
  'images/products/ht540/ht540-hf-front.webp',
  'images/products/ht540/ht540-hf-angle.webp',
  'images/products/ht540/ht540-uhf-front.webp',
  'images/products/ht540/ht540-uhf-angle.webp',
  'images/products/ht550/ht550-front.webp',
  'images/products/ht550/ht550-angle.webp',
  'images/products/y100/y100-standard-front.webp',
  'images/products/y100/y100-standard-angle.webp',
  'images/products/y100/y100-rfid-front.webp',
  'images/products/y100/y100-rfid-angle.webp',
  'images/products/y100/y100-rtk-front.webp',
  'images/products/y100/y100-rtk-angle.webp',
  'images/products/y100/y100-fingerprint-front.webp',
  'images/products/y100/y100-fingerprint-angle.webp',
  'images/products/y100/y100-5g-front.webp',
  'images/products/y100/y100-5g-angle.webp'
];

test('product images exist and are WebP', () => {
  for (const file of files) {
    const path = join(publicDir, file);
    assert.ok(existsSync(path), `missing ${file}`);
    const buf = readFileSync(path);
    assert.equal(buf.subarray(0, 4).toString(), 'RIFF', `${file} is not RIFF`);
    assert.equal(buf.subarray(8, 12).toString(), 'WEBP', `${file} is not WebP`);
  }
});
