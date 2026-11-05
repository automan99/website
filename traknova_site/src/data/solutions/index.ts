import en from '../../i18n/content/en/solutions.json';
import zh from '../../i18n/content/zh/solutions.json';
import type { Locale } from '../../i18n/config';

export type DeviceRef = {
  slug: string;
};

export type Scenario = {
  title: string;
  situation: string;
  workflow: string[];
  devices: DeviceRef[];
  outcomes: string[];
  note?: string;
};

export type Industry = {
  id: string;
  index: string;
  eyebrow: string;
  name: string;
  intro: string;
  scenarios: Scenario[];
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

export type SolutionsContent = {
  solutionLayers: SolutionLayer[];
  industries: Industry[];
  specializedWorkflows: SpecializedWorkflow[];
  solutionMatrix: SolutionMatrixRow[];
  deploymentSteps: DeploymentStep[];
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
