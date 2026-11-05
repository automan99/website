import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Locale } from '../../i18n/config';
import type {
  ProductCategory,
  ProductFamily,
  ProductFamilyBase,
  ProductFamilyCopy,
  ProductVariant
} from './types';
import { validateProductCatalog } from './validate.ts';

type ProductDictionary = {
  common: {
    categories: Record<string, string>;
  };
};

const catalogFiles = ['ht540.json', 'ht550.json', 'y100.json'] as const;
const supportedLocales: readonly Locale[] = ['en', 'zh'];
const projectRoot = process.cwd();

function readJson<T>(relativePath: string): T {
  return JSON.parse(readFileSync(join(projectRoot, relativePath), 'utf8')) as T;
}

const catalog = catalogFiles.map((file) =>
  readJson<ProductFamilyBase>(`src/data/products/${file}`)
);

const contents: Partial<Record<Locale, Record<string, ProductFamilyCopy>>> = {
  en: readJson('src/i18n/content/en/products.json'),
  zh: readJson('src/i18n/content/zh/products.json')
};

const errors = validateProductCatalog(catalog, contents, {
  publicDir: join(projectRoot, 'public'),
  locales: supportedLocales
});

if (errors.length > 0) {
  throw new Error(`Product data invalid:\n- ${errors.join('\n- ')}`);
}

const familyCache = new Map<Locale, ProductFamily[]>();
const dictionaryCache = new Map<Locale, ProductDictionary>();

function buildFamilies(locale: Locale): ProductFamily[] {
  const localeContent = contents[locale];
  if (!localeContent) {
    throw new Error(`Missing product content for locale "${locale}"`);
  }

  return [...catalog]
    .sort((a, b) => a.order - b.order)
    .map((base) => {
      const copy = localeContent[base.id];
      if (!copy) {
        throw new Error(`Missing product content for "${base.id}" (${locale})`);
      }
      const variants: ProductVariant[] = base.variants.map((variant) => {
        const variantCopy = copy.variants[variant.id];
        if (!variantCopy) {
          throw new Error(
            `Missing variant content for "${base.id}#${variant.id}" (${locale})`
          );
        }
        return { ...variant, ...variantCopy };
      });
      return { ...base, ...copy, variants };
    });
}

export function getProductFamilies(locale: Locale): ProductFamily[] {
  const cached = familyCache.get(locale);
  if (cached) return cached;
  const families = buildFamilies(locale);
  familyCache.set(locale, families);
  return families;
}

export function getProductFamily(
  locale: Locale,
  slug: string
): ProductFamily | undefined {
  return getProductFamilies(locale).find((family) => family.slug === slug);
}

export function getProductVariant(
  family: ProductFamily,
  variantId: string
): ProductVariant | undefined {
  return family.variants.find((variant) => variant.id === variantId);
}

export function getCategoryLabel(locale: Locale, category: ProductCategory): string {
  let dictionary = dictionaryCache.get(locale);
  if (!dictionary) {
    dictionary = readJson<ProductDictionary>(`src/i18n/dictionaries/${locale}.json`);
    dictionaryCache.set(locale, dictionary);
  }
  const key = category === 'rfid-handheld' ? 'rfidHandheld' : 'ruggedTablet';
  return dictionary.common.categories[key] ?? category;
}

export function getProductHref(
  family: ProductFamily,
  variantId?: string
): string {
  const path = `/products/${family.slug}/`;
  if (!variantId || family.variants.length <= 1) return path;
  return `${path}#variant-${variantId}`;
}
