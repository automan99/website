export type ProductCategory = 'rfid-handheld' | 'rugged-tablet';

export type SolutionSlug = 'logistics' | 'manufacturing' | 'retail' | 'field-service';

export type SpecItem = {
  label: string;
  value: string;
};

export type SpecGroup = {
  id: string;
  label: string;
  items: SpecItem[];
};

export type OptionGroup = {
  label: string;
  items: string[];
};

export type GalleryImage = {
  src: string;
  view: string;
};

export type ProductVariantBase = {
  id: string;
  model: string;
  image: string;
  gallery: GalleryImage[];
  keySpecs: SpecItem[];
  specGroups: SpecGroup[];
  options: OptionGroup[];
};

export type ProductComparison = {
  formFactor: string;
  rfid: string;
  os: string;
  battery: string;
  protection: string;
  bestFor: string;
};

export type VariantComparisonRow = {
  label: string;
  values: Record<string, string>;
};

export type ProductFamilyBase = {
  id: string;
  order: number;
  slug: string;
  series: string;
  category: ProductCategory;
  formFactor: string;
  tags: string[];
  defaultVariant: string;
  heroImage: string;
  kpis: SpecItem[];
  comparison: ProductComparison;
  variantComparison: VariantComparisonRow[];
  sharedSpecGroups: SpecGroup[];
  variants: ProductVariantBase[];
};

export type ProductFeature = {
  title: string;
  body: string;
};

export type ProductApplication = {
  label: string;
  solution: SolutionSlug;
};

export type ProductVariantCopy = {
  label: string;
  name: string;
  summary: string;
  highlights: string[];
  features: ProductFeature[];
  applications: ProductApplication[];
};

export type ProductFamilyCopy = {
  name: string;
  eyebrow: string;
  tagline: string;
  summary: string;
  overview: [string, string];
  variants: Record<string, ProductVariantCopy>;
};

export type ProductVariant = ProductVariantBase & ProductVariantCopy;

export type ProductFamily = Omit<ProductFamilyBase, 'variants'> &
  Omit<ProductFamilyCopy, 'variants'> & {
    variants: ProductVariant[];
  };
