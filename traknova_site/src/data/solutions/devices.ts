import type { Locale } from '../../i18n/config';
import {
  getProductFamily,
  type ProductFamily,
  type ProductVariant
} from '../products/catalog.ts';
import type { DeviceRef } from './index';

export type ResolvedDevice = {
  family: ProductFamily;
  variant: ProductVariant;
};

export function resolveDeviceRef(locale: Locale, ref: DeviceRef): ResolvedDevice {
  const family = getProductFamily(locale, ref.slug);
  if (!family) {
    throw new Error(`unknown product family "${ref.slug}" (${locale})`);
  }

  const variantId = ref.variant ?? family.defaultVariant;
  const variant = family.variants.find((item) => item.id === variantId);
  if (!variant) {
    throw new Error(`unknown product variant "${ref.slug}#${variantId}" (${locale})`);
  }

  return { family, variant };
}
