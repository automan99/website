#!/usr/bin/env node
/**
 * Validates the built site for i18n correctness:
 * - language attributes and hreflang coverage for enabled locales
 * - no hreflang or pages for disabled locales
 * - every root-relative link keeps the /website deployment base
 * - Chinese marketing pages no longer contain English sentinel copy
 * - Chinese legal pages keep the English body and show the notice
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const errors = [];

if (!existsSync(dist)) {
  console.error('dist is missing; run npm run build first');
  process.exit(1);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const htmlFiles = walk(dist).filter((file) => file.endsWith('.html'));
const zh = JSON.parse(readFileSync(join(root, 'src/i18n/dictionaries/zh.json'), 'utf8'));
const notice = zh.legal.englishVersionNotice;
const disabledLanguages = ['hi', 'es', 'ru', 'de', 'fr', 'pt'];

for (const file of htmlFiles) {
  const rel = relative(dist, file).split(sep).join('/');
  const html = readFileSync(file, 'utf8');
  const isZh = rel.startsWith('zh/');
  const expectedLanguage = isZh ? 'lang="zh-CN"' : 'lang="en"';

  if (!html.includes(expectedLanguage)) {
    errors.push(`${rel}: missing ${expectedLanguage}`);
  }

  for (const language of ['en', 'zh-CN', 'x-default']) {
    if (!html.includes(`hreflang="${language}"`)) {
      errors.push(`${rel}: missing hreflang="${language}"`);
    }
  }

  for (const language of disabledLanguages) {
    if (html.includes(`hreflang="${language}"`)) {
      errors.push(`${rel}: disabled language hreflang="${language}" is present`);
    }
  }

  for (const attribute of ['href', 'src']) {
    const pattern = new RegExp(`\\b${attribute}="(\\/[^"]*)"`, 'g');
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const value = match[1];
      if (value.startsWith('/') && !value.startsWith('/website/')) {
        errors.push(`${rel}: ${attribute}="${value}" is missing the /website base`);
      }
    }
  }
}

const requiredPages = [
  'index.html',
  'zh/index.html',
  'zh/about/index.html',
  'zh/contact/index.html',
  'zh/oem-odm/index.html',
  'zh/products/index.html',
  'zh/products/ht400-rugged-barcode-pda/index.html',
  'zh/solutions/index.html',
  'zh/privacy/index.html',
  'zh/terms/index.html',
  'zh/404/index.html'
];
for (const page of requiredPages) {
  if (!existsSync(join(dist, page))) errors.push(`missing page: ${page}`);
}

const sentinels = [
  ['zh/index.html', 'Move Data.'],
  ['zh/products/index.html', 'Start with the task'],
  ['zh/solutions/index.html', 'Built around the work.']
];
for (const [page, text] of sentinels) {
  const path = join(dist, page);
  if (existsSync(path) && readFileSync(path, 'utf8').includes(text)) {
    errors.push(`${page}: still contains English marketing copy "${text}"`);
  }
}

for (const page of ['zh/privacy/index.html', 'zh/terms/index.html']) {
  const path = join(dist, page);
  if (!existsSync(path)) continue;
  const html = readFileSync(path, 'utf8');
  if (!html.includes('<div lang="en">')) errors.push(`${page}: English legal body is not marked lang="en"`);
  if (!notice || !html.includes(notice)) errors.push(`${page}: localized English-version notice is missing`);
}

for (const language of disabledLanguages) {
  if (existsSync(join(dist, language))) errors.push(`disabled locale output exists: ${language}/`);
}

const sitemapPath = join(dist, 'sitemap-0.xml');
if (!existsSync(sitemapPath)) {
  errors.push('sitemap-0.xml is missing');
} else if (!readFileSync(sitemapPath, 'utf8').includes('hreflang="zh-CN"')) {
  errors.push('sitemap does not include zh-CN alternates');
}

if (errors.length > 0) {
  console.error(`dist check failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`dist check OK (${htmlFiles.length} HTML pages, en + zh, base-prefixed links)`);
