import en from '../../i18n/content/en/solutions.json';
import zh from '../../i18n/content/zh/solutions.json';
import type { Locale } from '../../i18n/config';

export type DeviceRef = {
  slug: string;
  variant?: string;
};

export type Scenario = {
  title: string;
  situation: string;
  workflow: string[];
  devices: DeviceRef[];
  outcomes: string[];
  note?: string;
};

export type IndustryImage = {
  base: string;
  alt: string;
};

export type SeoCopy = {
  title: string;
  description: string;
};

export type Challenge = {
  title: string;
  body: string;
  points: string[];
};

export type SnapshotItem = {
  label: string;
  value: string;
};

export type Snapshot = {
  title: string;
  items: SnapshotItem[];
};

export type Industry = {
  id: string;
  slug: string;
  index: string;
  eyebrow: string;
  name: string;
  summary: string;
  intro: string;
  valueLine: string;
  image: IndustryImage;
  seo: SeoCopy;
  challenge: Challenge;
  scenarios: Scenario[];
  snapshot: Snapshot;
  outcomes: string[];
  scope: string[];
};

export type SolutionLayer = {
  num: string;
  title: string;
  body: string;
  tags: string[];
};

export type SpecializedWorkflow = {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  devices: DeviceRef[];
};

export type SolutionMatrixRow = {
  industry: string;
  tasks: string;
  devices: string;
  capture: string;
};

export type DeploymentStep = {
  title: string;
  body: string;
};

export type DetailLabels = {
  breadcrumbHome: string;
  breadcrumbSolutions: string;
  challengeEyebrow: string;
  scenariosEyebrow: string;
  devicesEyebrow: string;
  devicesBody: string;
  outcomesEyebrow: string;
  snapshotEyebrow: string;
  scopeEyebrow: string;
  scopeTitle: string;
  scopeBody: string;
  briefCta: string;
  contactCta: string;
  viewProduct: string;
  deploymentEyebrow: string;
  oemEyebrow: string;
  oemTitle: string;
  oemBody: string;
  oemCta: string;
  otherIndustries: string;
};

export type OverviewContent = {
  proofStats: Array<{ value: string; label: string }>;
  industriesEyebrow: string;
  industriesTitleLine1: string;
  industriesTitleLine2: string;
  industriesBody: string;
  exploreLabel: string;
  exploreIndustries: string;
  oemEyebrow: string;
  oemTitleLine1: string;
  oemTitleLine2: string;
  oemBody: string;
  oemPoints: string[];
  oemCta: string;
};

export type SolutionsContent = {
  solutionLayers: SolutionLayer[];
  industries: Industry[];
  specializedWorkflows: SpecializedWorkflow[];
  solutionMatrix: SolutionMatrixRow[];
  deploymentSteps: DeploymentStep[];
  detail: DetailLabels;
  overview: OverviewContent;
};

const contentByLocale: Partial<Record<Locale, SolutionsContent>> = {
  en,
  zh
};

export function getSolutions(locale: Locale): SolutionsContent {
  const content = contentByLocale[locale];
  if (!content) throw new Error(`Missing solution content for locale "${locale}"`);
  return content;
}

export function getIndustry(locale: Locale, slug: string): Industry | undefined {
  return getSolutions(locale).industries.find((industry) => industry.slug === slug);
}

export function getIndustrySlugs(locale: Locale): string[] {
  return getSolutions(locale).industries.map((industry) => industry.slug);
}
