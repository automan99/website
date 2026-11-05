#!/usr/bin/env node
/**
 * Validates that every locale's translation files mirror the English source.
 *
 * - Every dictionary must have exactly the same key paths as en.json.
 * - No dictionary string may contain HTML tags (plain text only).
 * - Product content must cover the same product-line ids in every locale.
 * - Solution content must have the same top-level keys, industry ids and
 *   scenario counts in every locale.
 *
 * Exits non-zero on any mismatch, listing every offending path.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dictDir = join(root, 'src/i18n/dictionaries');
const contentDir = join(root, 'src/i18n/content');
const enDictPath = join(dictDir, 'en.json');

const errors = [];

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`Cannot read ${path}: ${error.message}`);
    return null;
  }
}

function collectPaths(value, prefix = '', out = []) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      out.push(`${prefix}[]`);
    } else {
      value.forEach((item, index) => collectPaths(item, `${prefix}[${index}]`, out));
    }
  } else if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) {
      out.push(`${prefix}{}`);
    } else {
      for (const key of keys) {
        collectPaths(value[key], prefix ? `${prefix}.${key}` : key, out);
      }
    }
  } else {
    out.push(prefix);
  }
  return out;
}

function collectHtmlValues(value, prefix = '', out = []) {
  if (typeof value === 'string') {
    if (/[<>]/.test(value)) out.push(prefix);
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => collectHtmlValues(item, `${prefix}[${index}]`, out));
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      collectHtmlValues(child, prefix ? `${prefix}.${key}` : key, out);
    }
  }
  return out;
}

function compareKeys(locale, enPaths, localePaths) {
  const enSet = new Set(enPaths);
  const localeSet = new Set(localePaths);
  for (const path of enPaths) {
    if (!localeSet.has(path)) errors.push(`${locale}: missing key "${path}"`);
  }
  for (const path of localePaths) {
    if (!enSet.has(path)) errors.push(`${locale}: extra key "${path}"`);
  }
}

// ---- dictionaries ----
if (!existsSync(enDictPath)) {
  console.error('en.json is missing: src/i18n/dictionaries/en.json');
  process.exit(1);
}

const en = readJson(enDictPath);
if (!en) {
  console.error(errors.join('\n'));
  process.exit(1);
}
const enPaths = collectPaths(en);

for (const path of collectHtmlValues(en, '')) {
  errors.push(`en: HTML tag in string value "${path}" (use plain text)`);
}

const localeFiles = existsSync(dictDir)
  ? readdirSync(dictDir).filter((name) => name.endsWith('.json') && name !== 'en.json').sort()
  : [];

for (const file of localeFiles) {
  const locale = file.replace(/\.json$/, '');
  const data = readJson(join(dictDir, file));
  if (!data) continue;
  compareKeys(locale, enPaths, collectPaths(data));
  for (const path of collectHtmlValues(data, '')) {
    errors.push(`${locale}: HTML tag in string value "${path}" (use plain text)`);
  }
}

// ---- product content ----
const productDataDir = join(root, 'src/data/products');
const EXPECTED_SLUGS = readdirSync(productDataDir)
  .filter((name) => name.endsWith('.json'))
  .map((name) => readJson(join(productDataDir, name))?.id)
  .filter(Boolean);

function contentLocales(subdir) {
  const dir = join(contentDir, subdir);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(dir, entry.name, 'products.json')))
    .map((entry) => entry.name)
    .sort();
}

const productLocales = contentLocales('.');
const enProductsPath = join(contentDir, 'en/products.json');
let enProducts = null;
if (!existsSync(enProductsPath)) {
  errors.push('src/i18n/content/en/products.json is missing');
} else {
  enProducts = readJson(enProductsPath);
}

if (enProducts) {
  const enSlugs = Object.keys(enProducts).sort();
  for (const slug of EXPECTED_SLUGS) {
    if (!enSlugs.includes(slug)) errors.push(`en products: missing slug "${slug}"`);
  }
  for (const slug of enSlugs) {
    if (!EXPECTED_SLUGS.includes(slug)) errors.push(`en products: extra slug "${slug}"`);
  }
  for (const locale of productLocales.filter((name) => name !== 'en')) {
    const data = readJson(join(contentDir, locale, 'products.json'));
    if (!data) continue;
    const slugs = Object.keys(data).sort();
    for (const slug of enSlugs) {
      if (!slugs.includes(slug)) errors.push(`${locale} products: missing slug "${slug}"`);
    }
    for (const slug of slugs) {
      if (!enSlugs.includes(slug)) errors.push(`${locale} products: extra slug "${slug}"`);
    }
    for (const path of collectHtmlValues(data, '')) {
      errors.push(`${locale} products: HTML tag in string value "${path}"`);
    }
  }
}

// ---- solution content ----
function solutionLocales() {
  const dir = join(contentDir);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(dir, entry.name, 'solutions.json')))
    .map((entry) => entry.name)
    .sort();
}

const solutionLocaleNames = solutionLocales();
const enSolutionsPath = join(contentDir, 'en/solutions.json');
let enSolutions = null;
if (!existsSync(enSolutionsPath)) {
  errors.push('src/i18n/content/en/solutions.json is missing');
} else {
  enSolutions = readJson(enSolutionsPath);
}

if (enSolutions) {
  const enTopKeys = Object.keys(enSolutions).sort();
  for (const locale of solutionLocaleNames.filter((name) => name !== 'en')) {
    const data = readJson(join(contentDir, locale, 'solutions.json'));
    if (!data) continue;
    const keys = Object.keys(data).sort();
    for (const key of enTopKeys) {
      if (!keys.includes(key)) errors.push(`${locale} solutions: missing top-level key "${key}"`);
    }
    for (const key of keys) {
      if (!enTopKeys.includes(key)) errors.push(`${locale} solutions: extra top-level key "${key}"`);
    }
    const enIds = (enSolutions.industries ?? []).map((industry) => industry.id);
    const ids = (data.industries ?? []).map((industry) => industry.id);
    if (JSON.stringify(ids) !== JSON.stringify(enIds)) {
      errors.push(`${locale} solutions: industry ids differ (${ids.join(', ')})`);
    }
    const enCounts = (enSolutions.industries ?? []).map((industry) => industry.scenarios?.length ?? 0);
    const counts = (data.industries ?? []).map((industry) => industry.scenarios?.length ?? 0);
    if (JSON.stringify(counts) !== JSON.stringify(enCounts)) {
      errors.push(`${locale} solutions: scenario counts differ (${counts.join(', ')})`);
    }
    for (const path of collectHtmlValues(data, '')) {
      errors.push(`${locale} solutions: HTML tag in string value "${path}"`);
    }
  }
}

if (errors.length > 0) {
  console.error(`i18n check failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const localeCount = 1 + localeFiles.length;
console.log(`i18n check OK (${localeCount} locale${localeCount === 1 ? '' : 's'}: en${localeFiles.length ? ', ' + localeFiles.map((f) => f.replace(/\.json$/, '')).join(', ') : ''})`);
