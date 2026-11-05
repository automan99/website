import type { ProductCategory } from './types';

export type CategoryLabelKey =
  | 'rfidHandheld'
  | 'barcodeHandheld'
  | 'ruggedTablet';

export type ProductCategoryDefinition = {
  id: ProductCategory;
  order: number;
  labelKey: CategoryLabelKey;
  memberIds: readonly string[];
  representativeId: string;
};

export const PRODUCT_CATEGORIES: readonly ProductCategoryDefinition[] = [
  {
    id: 'rfid-handheld',
    order: 1,
    labelKey: 'rfidHandheld',
    memberIds: ['rfid-handhelds'],
    representativeId: 'rfid-handhelds'
  },
  {
    id: 'barcode-handheld',
    order: 2,
    labelKey: 'barcodeHandheld',
    memberIds: ['ht600'],
    representativeId: 'ht600'
  },
  {
    id: 'rugged-tablet',
    order: 3,
    labelKey: 'ruggedTablet',
    memberIds: ['y100'],
    representativeId: 'y100'
  }
];

export const CATEGORY_IDS = new Set<ProductCategory>(
  PRODUCT_CATEGORIES.map((category) => category.id)
);

export function getCategoryDefinition(
  id: ProductCategory
): ProductCategoryDefinition {
  const definition = PRODUCT_CATEGORIES.find((category) => category.id === id);
  if (!definition) {
    throw new Error(`Unknown product category "${id}"`);
  }
  return definition;
}

export function getCategoryForFamily(
  familyId: string
): ProductCategoryDefinition | undefined {
  return PRODUCT_CATEGORIES.find((category) =>
    category.memberIds.includes(familyId)
  );
}

export function categoryAnchor(id: ProductCategory): string {
  return `category-${id}`;
}
