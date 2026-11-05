import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Locale } from '../../i18n/config';
import type {
  ProductFamilyBase,
  ProductFamilyCopy,
  SpecGroup
} from './types';
import { CATEGORY_IDS } from './categories.ts';

export type ValidateOptions = {
  publicDir: string;
  locales: readonly Locale[];
};

const CATEGORIES = CATEGORY_IDS;
const SOLUTIONS = new Set(['logistics', 'manufacturing', 'retail', 'field-service']);
const COMPARISON_FIELDS = [
  'formFactor',
  'capture',
  'os',
  'battery',
  'protection',
  'bestFor'
] as const;
const OLD_MODEL = /\b(HT400|HT510|HT520|HT530|HT800|Y70|A100|T120A)\b/;

function nonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function checkImage(
  path: string,
  label: string,
  publicDir: string,
  errors: string[]
): void {
  if (!nonEmpty(path)) {
    errors.push(`${label}: image path is empty`);
    return;
  }
  if (!path.startsWith('/images/products/')) {
    errors.push(`${label}: image path must start with /images/products/ (${path})`);
    return;
  }
  if (!existsSync(join(publicDir, path.replace(/^\//, '')))) {
    errors.push(`${label}: image not found (${path})`);
  }
}

function checkGroups(
  groups: SpecGroup[],
  label: string,
  ids: Set<string>,
  errors: string[]
): void {
  for (const group of groups) {
    if (!nonEmpty(group.id) || !nonEmpty(group.label)) {
      errors.push(`${label}: spec group id and label are required`);
      continue;
    }
    if (ids.has(group.id)) {
      errors.push(`${label}: duplicate spec group id "${group.id}"`);
    }
    ids.add(group.id);
    if (!Array.isArray(group.items) || group.items.length === 0) {
      errors.push(`${label}: spec group "${group.id}" has no items`);
    }
    for (const item of group.items ?? []) {
      if (!nonEmpty(item.label) || !nonEmpty(item.value)) {
        errors.push(`${label}: spec group "${group.id}" has an empty item`);
      }
    }
  }
}

export function validateProductCatalog(
  catalog: ProductFamilyBase[],
  contents: Partial<Record<Locale, Record<string, ProductFamilyCopy>>>,
  options: ValidateOptions
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(catalog) || catalog.length === 0) {
    return ['catalog is empty'];
  }

  const ids = new Set<string>();
  const slugs = new Set<string>();
  const orders = new Set<number>();

  for (const family of catalog) {
    const label = `product "${family.id || 'unknown'}"`;

    if (!nonEmpty(family.id) || !nonEmpty(family.slug) || !nonEmpty(family.series)) {
      errors.push(`${label}: id, slug and series are required`);
    }
    if (ids.has(family.id)) errors.push(`${label}: duplicate product id "${family.id}"`);
    if (slugs.has(family.slug)) errors.push(`${label}: duplicate product slug "${family.slug}"`);
    if (orders.has(family.order)) errors.push(`${label}: duplicate product order ${family.order}`);
    ids.add(family.id);
    slugs.add(family.slug);
    orders.add(family.order);

    if (!CATEGORIES.has(family.category)) {
      errors.push(`${label}: invalid category "${family.category}"`);
    }
    if (!Array.isArray(family.tags) || family.tags.length !== 3) {
      errors.push(`${label}: tags must contain exactly 3 items`);
    }
    if (!Array.isArray(family.kpis) || family.kpis.length !== 3) {
      errors.push(`${label}: kpis must contain exactly 3 items`);
    }
    for (const field of COMPARISON_FIELDS) {
      if (!nonEmpty(family.comparison?.[field])) {
        errors.push(`${label}: comparison.${field} is required`);
      }
    }

    checkImage(family.heroImage, `${label} heroImage`, options.publicDir, errors);

    const variantIds = new Set<string>();
    for (const variant of family.variants ?? []) {
      if (!nonEmpty(variant.id)) {
        errors.push(`${label}: variant id is required`);
        continue;
      }
      if (variantIds.has(variant.id)) {
        errors.push(`${label}: duplicate variant id "${variant.id}"`);
      }
      variantIds.add(variant.id);

      if (!nonEmpty(variant.model)) {
        errors.push(`${label} variant "${variant.id}": model is required`);
      }
      checkImage(variant.image, `${label} variant "${variant.id}" image`, options.publicDir, errors);
      if (!Array.isArray(variant.gallery) || variant.gallery.length < 2) {
        errors.push(`${label} variant "${variant.id}": gallery needs at least 2 images`);
      }
      for (const image of variant.gallery ?? []) {
        checkImage(
          image.src,
          `${label} variant "${variant.id}" gallery image`,
          options.publicDir,
          errors
        );
      }
      if (!Array.isArray(variant.keySpecs) || variant.keySpecs.length !== 4) {
        errors.push(`${label} variant "${variant.id}": keySpecs must contain exactly 4 items`);
      }
      for (const item of variant.keySpecs ?? []) {
        if (!nonEmpty(item.label) || !nonEmpty(item.value)) {
          errors.push(`${label} variant "${variant.id}": keySpecs contain an empty item`);
        }
      }

      const groupIds = new Set<string>();
      const groupCount =
        (family.sharedSpecGroups?.length ?? 0) + (variant.specGroups?.length ?? 0);
      if (groupCount < 2) {
        errors.push(`${label} variant "${variant.id}": needs at least 2 spec groups in total`);
      }
      checkGroups(family.sharedSpecGroups ?? [], label, groupIds, errors);
      checkGroups(variant.specGroups ?? [], `${label} variant "${variant.id}"`, groupIds, errors);
    }

    if (!variantIds.has(family.defaultVariant)) {
      errors.push(`${label}: defaultVariant "${family.defaultVariant}" does not exist`);
    }

    const comparisonRows = family.variantComparison ?? [];
    if (variantIds.size > 1 && comparisonRows.length < 3) {
      errors.push(`${label}: multi-variant products need at least 3 variantComparison rows`);
    }
    for (const row of comparisonRows) {
      if (!nonEmpty(row.label)) {
        errors.push(`${label}: variantComparison row label is required`);
      }
      for (const variantId of variantIds) {
        if (!nonEmpty(row.values?.[variantId])) {
          errors.push(
            `${label}: variantComparison "${row.label}" is missing value for "${variantId}"`
          );
        }
      }
    }

    for (const locale of options.locales) {
      const localeContent = contents[locale]?.[family.id];
      if (!localeContent) {
        errors.push(`${label}: missing ${locale} content`);
        continue;
      }
      if (
        !nonEmpty(localeContent.name) ||
        !nonEmpty(localeContent.eyebrow) ||
        !nonEmpty(localeContent.tagline) ||
        !nonEmpty(localeContent.summary)
      ) {
        errors.push(`${label} (${locale}): name, eyebrow, tagline and summary are required`);
      }
      if (!Array.isArray(localeContent.overview) || localeContent.overview.length !== 2) {
        errors.push(`${label} (${locale}): overview must contain exactly 2 paragraphs`);
      }

      const copyVariants = localeContent.variants ?? {};
      for (const variantId of variantIds) {
        const copy = copyVariants[variantId];
        if (!copy) {
          errors.push(`${label} (${locale}): missing variant content "${variantId}"`);
          continue;
        }
        if (!nonEmpty(copy.label) || !nonEmpty(copy.name) || !nonEmpty(copy.summary)) {
          errors.push(
            `${label} (${locale}) variant "${variantId}": label, name and summary are required`
          );
        }
        if (!Array.isArray(copy.highlights) || copy.highlights.length === 0) {
          errors.push(`${label} (${locale}) variant "${variantId}": highlights are required`);
        }
        if (
          !Array.isArray(copy.features) ||
          copy.features.length < 3 ||
          copy.features.length > 5
        ) {
          errors.push(
            `${label} (${locale}) variant "${variantId}": features must contain 3-5 items`
          );
        }
        if (!Array.isArray(copy.applications) || copy.applications.length !== 4) {
          errors.push(
            `${label} (${locale}) variant "${variantId}": applications must contain 4 items`
          );
        }
        for (const application of copy.applications ?? []) {
          if (!SOLUTIONS.has(application.solution)) {
            errors.push(
              `${label} (${locale}) variant "${variantId}": invalid solution "${application.solution}"`
            );
          }
        }
      }
      for (const variantId of Object.keys(copyVariants)) {
        if (!variantIds.has(variantId)) {
          errors.push(
            `${label} (${locale}): extra variant content "${variantId}" has no variant`
          );
        }
      }
    }
  }

  if (OLD_MODEL.test(JSON.stringify(catalog))) {
    errors.push('old model name found in product catalog');
  }
  for (const locale of options.locales) {
    for (const family of catalog) {
      const copy = contents[locale]?.[family.id];
      if (copy && OLD_MODEL.test(JSON.stringify(copy))) {
        errors.push(`old model name found in ${locale} content for "${family.id}"`);
      }
    }
  }

  return errors;
}
