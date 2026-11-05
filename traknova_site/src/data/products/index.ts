import enProducts from '../../i18n/content/en/products.json';
import zhProducts from '../../i18n/content/zh/products.json';
import { getDictionary } from '../../i18n';
import type { Locale } from '../../i18n/config';
import { productBase, type ProductBase, type ProductCategory } from './base';

export type { ProductBase, ProductCategory };

export type ProductCopy = {
  name: string;
  summary: string;
  highlights: string[];
};

export type Product = ProductBase & ProductCopy;

const copyByLocale: Partial<Record<Locale, Record<string, ProductCopy>>> = {
  en: enProducts,
  zh: zhProducts
};

export function getProducts(locale: Locale): Product[] {
  const copy = copyByLocale[locale];
  if (!copy) throw new Error(`Missing product copy for locale "${locale}"`);

  return productBase.map((base) => {
    const localized = copy[base.slug];
    if (!localized) {
      throw new Error(`Missing product copy for slug "${base.slug}" (${locale})`);
    }
    return { ...base, ...localized };
  });
}

export function getProduct(locale: Locale, slug: string): Product | undefined {
  return getProducts(locale).find((product) => product.slug === slug);
}

const CATEGORY_KEYS: Record<ProductCategory, 'ruggedPda' | 'rfid' | 'industrialTablet'> = {
  'Rugged PDA': 'ruggedPda',
  RFID: 'rfid',
  'Industrial Tablet': 'industrialTablet'
};

export function getCategoryLabel(locale: Locale, category: ProductCategory): string {
  return getDictionary(locale).common.categories[CATEGORY_KEYS[category]];
}
