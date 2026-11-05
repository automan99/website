import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getProductFamily } from '../src/data/products/catalog.ts';

const locales = ['en', 'zh'];
const OLD = /\b(HT400|HT510|HT520|HT530|HT800|Y70|A100|T120A)\b/;

for (const locale of locales) {
  const content = JSON.parse(
    readFileSync(new URL(`../src/i18n/content/${locale}/solutions.json`, import.meta.url), 'utf8')
  );

  test(`${locale}: every device resolves to a family and variant`, () => {
    const refs = [
      ...content.industries.flatMap((industry) =>
        industry.scenarios.flatMap((scenario) => scenario.devices)
      ),
      ...content.specializedWorkflows.flatMap((workflow) => workflow.devices)
    ];
    for (const ref of refs) {
      const family = getProductFamily(locale, ref.slug);
      assert.ok(family, `${locale}: unknown family ${ref.slug}`);
      assert.ok(
        family.variants.some((variant) => variant.id === (ref.variant ?? family.defaultVariant)),
        `${locale}: unknown variant ${ref.slug}#${ref.variant}`
      );
    }
  });

  test(`${locale}: no old model names remain`, () => {
    assert.equal(OLD.test(JSON.stringify(content)), false);
  });
}
