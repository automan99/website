import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateProductCatalog } from '../src/data/products/validate.ts';

function publicDir() {
  const dir = mkdtempSync(join(tmpdir(), 'traknova-products-'));
  mkdirSync(join(dir, 'images/products/demo'), { recursive: true });
  for (const name of ['front.webp', 'angle.webp']) {
    writeFileSync(join(dir, `images/products/demo/${name}`), 'RIFFxxxxWEBP');
  }
  return dir;
}

function validFamily() {
  return {
    id: 'demo',
    order: 1,
    slug: 'demo-series',
    series: 'Demo Series',
    category: 'rugged-tablet',
    formFactor: '10-inch tablet',
    tags: ['10.1"', 'Android 16', 'IP67'],
    defaultVariant: 'standard',
    heroImage: '/images/products/demo/front.webp',
    kpis: [
      { label: 'Display', value: '10.1 in' },
      { label: 'Battery', value: '10,000 mAh' },
      { label: 'Protection', value: 'IP67' }
    ],
    comparison: {
      formFactor: 'tablet',
      rfid: 'optional',
      os: 'Android 16',
      battery: '10,000 mAh',
      protection: 'IP67',
      bestFor: 'inventory'
    },
    variantComparison: [{ label: 'OS', values: { standard: 'Android 16' } }],
    sharedSpecGroups: [{
      id: 'platform',
      label: 'Platform',
      items: [{ label: 'Display', value: '10.1 in' }]
    }],
    variants: [{
      id: 'standard',
      model: 'Demo Standard',
      image: '/images/products/demo/front.webp',
      gallery: [
        { src: '/images/products/demo/front.webp', view: 'front' },
        { src: '/images/products/demo/angle.webp', view: 'angle' }
      ],
      keySpecs: [
        { label: 'Display', value: '10.1 in' },
        { label: 'OS', value: 'Android 16' },
        { label: 'Battery', value: '10,000 mAh' },
        { label: 'Protection', value: 'IP67' }
      ],
      specGroups: [{
        id: 'system',
        label: 'System',
        items: [{ label: 'Processor', value: 'Demo CPU' }]
      }],
      options: []
    }]
  };
}

function validCopy() {
  return {
    demo: {
      name: 'Demo Series',
      eyebrow: 'Demo platform',
      tagline: 'Demo tagline',
      summary: 'Demo summary',
      overview: ['One.', 'Two.'],
      variants: {
        standard: {
          label: 'Standard',
          name: 'Demo Standard',
          summary: 'Demo variant',
          highlights: ['A', 'B', 'C'],
          features: [
            { title: 'A', body: 'A' },
            { title: 'B', body: 'B' },
            { title: 'C', body: 'C' }
          ],
          applications: [
            { label: 'Warehouse', solution: 'logistics' },
            { label: 'Production', solution: 'manufacturing' },
            { label: 'Retail', solution: 'retail' },
            { label: 'Field', solution: 'field-service' }
          ]
        }
      }
    }
  };
}

const locales = ['en', 'zh'];

test('valid catalog returns no errors', () => {
  assert.deepEqual(
    validateProductCatalog([validFamily()], { en: validCopy(), zh: validCopy() },
      { publicDir: publicDir(), locales }),
    []
  );
});

test('duplicate variant ids are rejected', () => {
  const family = validFamily();
  family.variants.push(structuredClone(family.variants[0]));
  const errors = validateProductCatalog([family], { en: validCopy(), zh: validCopy() },
    { publicDir: publicDir(), locales });
  assert.ok(errors.some((e) => e.includes('duplicate variant id')));
});

test('missing default variant is rejected', () => {
  const family = validFamily();
  family.defaultVariant = 'missing';
  const errors = validateProductCatalog([family], { en: validCopy(), zh: validCopy() },
    { publicDir: publicDir(), locales });
  assert.ok(errors.some((e) => e.includes('defaultVariant')));
});

test('missing locale content is rejected', () => {
  const errors = validateProductCatalog([validFamily()], { en: validCopy() },
    { publicDir: publicDir(), locales });
  assert.ok(errors.some((e) => e.includes('zh') && e.includes('content')));
});

test('old model names are rejected', () => {
  const family = validFamily();
  family.series = 'HT400 Series';
  const errors = validateProductCatalog([family], { en: validCopy(), zh: validCopy() },
    { publicDir: publicDir(), locales });
  assert.ok(errors.some((e) => e.includes('old model')));
});

test('missing image is rejected', () => {
  const family = validFamily();
  family.heroImage = '/images/products/demo/missing.webp';
  const errors = validateProductCatalog([family], { en: validCopy(), zh: validCopy() },
    { publicDir: publicDir(), locales });
  assert.ok(errors.some((e) => e.includes('image not found')));
});

test('duplicate spec group ids across shared and variant are rejected', () => {
  const family = validFamily();
  family.variants[0].specGroups[0].id = 'platform';
  const errors = validateProductCatalog([family], { en: validCopy(), zh: validCopy() },
    { publicDir: publicDir(), locales });
  assert.ok(errors.some((e) => e.includes('duplicate spec group id')));
});

test('unknown application solution is rejected', () => {
  const copy = validCopy();
  copy.demo.variants.standard.applications[0].solution = 'unknown';
  const errors = validateProductCatalog([validFamily()], { en: copy, zh: copy },
    { publicDir: publicDir(), locales });
  assert.ok(errors.some((e) => e.includes('invalid solution')));
});
