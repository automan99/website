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
import { hasHtmlLanguage, hasAlternateLanguage } from './lib/html-checks.mjs';

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
  const expectedLanguage = isZh ? 'zh-CN' : 'en';

  if (!hasHtmlLanguage(html, expectedLanguage)) {
    errors.push(`${rel}: missing <html lang="${expectedLanguage}">`);
  }

  for (const language of ['en', 'zh-CN', 'x-default']) {
    if (!hasAlternateLanguage(html, language)) {
      errors.push(`${rel}: missing <link rel="alternate" hreflang="${language}">`);
    }
  }

  for (const language of disabledLanguages) {
    if (hasAlternateLanguage(html, language)) {
      errors.push(`${rel}: disabled language alternate hreflang="${language}" is present`);
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
  'solutions/index.html',
  'solutions/logistics/index.html',
  'solutions/manufacturing/index.html',
  'solutions/retail/index.html',
  'solutions/field-service/index.html',
  'zh/solutions/index.html',
  'zh/solutions/logistics/index.html',
  'zh/solutions/manufacturing/index.html',
  'zh/solutions/retail/index.html',
  'zh/solutions/field-service/index.html',
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

const zhHomePath = join(dist, 'zh/index.html');
if (existsSync(zhHomePath)) {
  const html = readFileSync(zhHomePath, 'utf8');
  if (html.includes('>BARCODE<') || html.includes('>INDUSTRIAL IoT<')) {
    errors.push('zh/index.html: the trust strip still contains English terms');
  }
  if (!html.includes('>条码<')) {
    errors.push('zh/index.html: the trust strip is missing the Chinese barcode label');
  }
}

const contactPath = join(dist, 'contact/index.html');
if (existsSync(contactPath) && !readFileSync(contactPath, 'utf8').includes('only to respond to this inquiry')) {
  errors.push('contact/index.html: privacy sentence no longer says "only to respond"');
}

const aboutPath = join(dist, 'about/index.html');
if (existsSync(aboutPath) && readFileSync(aboutPath, 'utf8').includes('Let&#39;s find the right')) {
  errors.push('about/index.html: closing CTA band should be removed');
}

const aboutZhPath = join(dist, 'zh/about/index.html');
if (existsSync(aboutZhPath) && readFileSync(aboutZhPath, 'utf8').includes('让我们一起找到')) {
  errors.push('zh/about/index.html: closing CTA band should be removed');
}

for (const [page, marker, description] of [
  ['about/index.html', 'A Shenzhen-based', 'company profile heading'],
  ['about/index.html', '15+ years', 'experience fact'],
  ['about/index.html', 'Companies served worldwide', 'companies served fact'],
  ['about/index.html', '/website/images/about-warehouse.webp', 'warehouse photo'],
  ['about/index.html', '/website/images/about-engineering.webp', 'engineering photo'],
  ['zh/about/index.html', '扎根深圳的', 'company profile heading'],
  ['zh/about/index.html', '15+ 年', 'experience fact'],
  ['zh/about/index.html', '1,000+ 家', 'companies served fact'],
  ['zh/about/index.html', '/website/images/about-warehouse.webp', 'warehouse photo'],
  ['zh/about/index.html', '/website/images/about-engineering.webp', 'engineering photo']
]) {
  const path = join(dist, page);
  if (existsSync(path) && !readFileSync(path, 'utf8').includes(marker)) {
    errors.push(`${page}: missing ${description}`);
  }
}

for (const asset of ['images/about-warehouse.webp', 'images/about-engineering.webp']) {
  if (!existsSync(join(dist, asset))) errors.push(`about image is missing from dist: ${asset}`);
}

for (const [page, marker, description] of [
  ['oem-odm/index.html', '/website/images/oem-production.webp', 'OEM production photo'],
  ['oem-odm/index.html', '/website/images/oem-testing.webp', 'OEM testing photo'],
  ['zh/oem-odm/index.html', '/website/images/oem-production.webp', 'OEM production photo'],
  ['zh/oem-odm/index.html', '/website/images/oem-testing.webp', 'OEM testing photo']
]) {
  const path = join(dist, page);
  if (existsSync(path) && !readFileSync(path, 'utf8').includes(marker)) {
    errors.push(`${page}: missing ${description}`);
  }
}

for (const asset of ['images/oem-production.webp', 'images/oem-testing.webp']) {
  if (!existsSync(join(dist, asset))) errors.push(`OEM image is missing from dist: ${asset}`);
}

for (const asset of [
  'images/solutions/hero-logistics-2000.webp',
  'images/solutions/logistics-2000.webp',
  'images/solutions/manufacturing-2000.webp',
  'images/solutions/retail-2000.webp',
  'images/solutions/field-service-2000.webp',
  'images/products/device-pda.svg',
  'images/products/device-rfid.svg',
  'images/products/device-tablet.svg'
]) {
  if (!existsSync(join(dist, asset))) errors.push(`solutions image is missing from dist: ${asset}`);
}

for (const page of [
  'solutions/logistics/index.html',
  'solutions/manufacturing/index.html',
  'solutions/retail/index.html',
  'solutions/field-service/index.html',
  'zh/solutions/logistics/index.html',
  'zh/solutions/manufacturing/index.html',
  'zh/solutions/retail/index.html',
  'zh/solutions/field-service/index.html'
]) {
  const path = join(dist, page);
  if (!existsSync(path)) continue;
  const html = readFileSync(path, 'utf8');
  if (!html.includes('property="og:image"')) errors.push(`${page}: missing og:image`);
  if (!html.includes('"@type":"BreadcrumbList"')) errors.push(`${page}: missing BreadcrumbList schema`);
  if (html.includes('/solutions/#')) errors.push(`${page}: still contains a legacy solution anchor link`);
}

const contactExpectations = [
  ['contact/index.html', 'Shenzhen Yiliya', 'company name in English'],
  ['contact/index.html', 'Shenzhen, China', 'location'],
  ['zh/contact/index.html', '深圳市伊莉亚有限公司', 'company name in Chinese'],
  ['zh/contact/index.html', '中国深圳', 'location']
];
for (const [page, marker, description] of contactExpectations) {
  const path = join(dist, page);
  if (existsSync(path) && !readFileSync(path, 'utf8').includes(marker)) {
    errors.push(`${page}: missing ${description}`);
  }
}

for (const [page, marker] of [
  ['contact/index.html', 'HOW WE SUPPORT YOU'],
  ['zh/contact/index.html', '我们的支持']
]) {
  const path = join(dist, page);
  if (existsSync(path) && readFileSync(path, 'utf8').includes(marker)) {
    errors.push(`${page}: trust strip should be removed`);
  }
}

for (const page of ['contact/index.html', 'zh/contact/index.html']) {
  const path = join(dist, page);
  if (existsSync(path) && readFileSync(path, 'utf8').includes('contact-team.svg')) {
    errors.push(`${page}: decorative contact illustration is still referenced`);
  }
}

if (existsSync(join(dist, 'images/contact-team.svg'))) {
  errors.push('decorative contact illustration is still built');
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
