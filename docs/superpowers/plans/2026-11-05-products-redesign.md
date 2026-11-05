# 产品模块重构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用素材中的 HT540 Series、HT550、Y100 Series 三条产品线替换现有 12 个旧产品，产品数据外置为带校验的本地 JSON，并重做产品总览、详情、首页产品区和解决方案页的设备引用。

**Architecture:** Astro 静态站，构建时从 `src/data/products/*.json` 读取技术事实，从 `src/i18n/content/{en,zh}/products.json` 读取本地化营销文案；`src/data/products/catalog.ts` 合并、校验并暴露查询 API。产品详情页为单页多版本，全部版本面板服务端渲染，客户端仅切换可见性和 URL hash，无 JS 时全部可见。

**Tech Stack:** Astro 5、TypeScript strict、Node 22（原生 TS type stripping）、node:test、sharp（图片处理）、现有 CSS 设计系统。

**Spec:** `docs/superpowers/specs/2026-11-05-products-redesign-design.md`

## Global Constraints

- 只使用 HT540 Series、HT550、Y100 Series 三条产品线；旧型号 HT400/HT510/HT520/HT530/HT800/Y70/A100/T120A 不得出现在公开页面或数据里。
- 产品结构性数据只存在于 JSON；`.astro` 页面不得写死型号、规格值或图片路径。
- 英文与中文都构建；产品型号、规格标签、规格值保持英文，营销文案双语。
- 所有产品图片自托管为 WebP，路径以 `/images/products/` 开头；不得引用 `lqycit.com`，不得保留 LQVIS 标识。
- 不发布公开 datasheet PDF；统一用“Request the datasheet”走询盘。
- 规格冲突按 spec §2.4：规格表优先、Key features 只补充、冲突取保守值、未确认字段不发布。
- 产品详情页所有版本面板必须服务端输出；无 JS 时按顺序全部可见。
- 构建命令必须全部通过：`npm run build`、`npm test`、`npm run i18n:check`、`npm run check:dist`。
- 现有 `/website` base、双语路由、询盘弹窗、OEM/ODM、联系页行为不变。

## Review Focus

- **旧产品删除后的跨页引用**：解决方案页仍引用旧 slug 时，设备卡片会消失或链接 404；每个旧 slug 必须映射到新家族/版本，并由测试覆盖。
- **版本深链**：`#variant-rfid` 刷新、分享、未知 hash、无 JS 时必须落到正确版本或默认版本；测试 hash 解析与回退。
- **本地化键漂移**：某个产品线/版本缺少 en 或 zh 文案时，构建必须失败，不能生成半空页面；测试 validator。
- **共享规格与版本规格冲突**：共享组与版本组 id 重复会让规格表合并错误；测试重复 id。
- **图片路径失效**：JSON 指向不存在的图片或外站 URL 时，产品卡会破图；测试文件存在且为 WebP。

---

## File Map

**Create**

- `src/data/products/types.ts` — 产品数据类型。
- `src/data/products/validate.ts` — 纯校验函数。
- `src/data/products/catalog.ts` — 读取 JSON、合并文案、缓存、查询 API。
- `src/data/products/ht540.json`、`ht550.json`、`y100.json` — 三条产品线技术数据。
- `src/data/products/README.md` — 数据维护说明。
- `src/components/ProductFamilyCard.astro` — 首页/总览产品线卡片。
- `src/scripts/product-variants.mjs` — 版本 hash 与 DOM 切换。
- `scripts/prepare-product-images.mjs` — 素材图转 WebP。
- `tests/products.test.mjs` — validator 测试。
- `tests/product-images.test.mjs` — 图片产物测试。
- `tests/product-data-ht540.test.mjs`、`tests/product-data-ht550.test.mjs`、`tests/product-data-y100.test.mjs` — 三条产品线数据测试。
- `tests/product-catalog.test.mjs` — loader/查询 API 测试。
- `tests/product-variants.test.mjs` — 版本 hash 测试。
- `tests/solutions-devices.test.mjs` — 解决方案设备引用测试。
- `public/images/products/{ht540,ht550,y100}/*.webp` — 18 张产品图。

**Modify**

- `src/i18n/content/en/products.json`、`src/i18n/content/zh/products.json` — 新文案。
- `src/i18n/dictionaries/en.json`、`src/i18n/dictionaries/zh.json` — 产品页/首页/页脚字典。
- `src/views/ProductsIndexView.astro` — 三条产品线总览。
- `src/views/ProductDetailView.astro` — 单页多版本详情。
- `src/views/HomeView.astro` — 三张产品线卡片。
- `src/components/Footer.astro` — 三条产品线链接。
- `src/pages/products/[slug].astro`、`src/pages/[lang]/products/[slug].astro` — 新 slug。
- `src/data/solutions/index.ts`、`src/views/SolutionDetailView.astro`、`src/components/SolutionDeviceCard.astro` — 设备引用迁移。
- `src/i18n/content/en/solutions.json`、`src/i18n/content/zh/solutions.json` — 设备引用和旧型号文字。
- `src/styles/enterprise.css` — 新产品页样式与响应式。
- `scripts/check-i18n.mjs`、`scripts/check-dist.mjs` — 新页面/数据校验。
- `package.json` — 显式 `sharp` devDependency。

**Delete (Task 11)**

- `src/data/products/base.ts`、`src/data/products/index.ts` — 旧数据与 loader。
- `src/components/ProductCard.astro` — 旧产品卡。
- `PRODUCT_CATALOG.csv`、`PRODUCT_DATA_REVIEW.md` — 与真实数据源冲突的旧文档。
- 旧 `public/images/products/product-placeholder.svg` 引用（文件可保留给解决方案剪影之外的使用，但产品 JSON 不再引用）。

---

### Task 1: 产品数据类型与校验器

**Files:**
- Create: `src/data/products/types.ts`
- Create: `src/data/products/validate.ts`
- Test: `tests/products.test.mjs`

**Interfaces:**
- Produces: 类型 `ProductCategory`、`SolutionSlug`、`SpecItem`、`SpecGroup`、`OptionGroup`、`GalleryImage`、`ProductVariantBase`、`ProductComparison`、`VariantComparisonRow`、`ProductFamilyBase`、`ProductFamilyCopy`、`ProductVariant`、`ProductFamily`。
- Produces: `validateProductCatalog(catalog: ProductFamilyBase[], contents: Partial<Record<Locale, Record<string, ProductFamilyCopy>>>, options: { publicDir: string; locales: readonly Locale[] }): string[]`。

- [ ] **Step 1: 写失败测试**

在 `tests/products.test.mjs` 中建立最小合法 fixture，并覆盖以下断言：

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateProductCatalog } from '../src/data/products/validate.ts';

function publicDir() {
  const dir = mkdtempSync(join(tmpdir(), 'traknova-products-'));
  mkdirSync(join(dir, 'images/products/demo'), { recursive: true });
  for (const name of ['front.webp', 'angle.webp']) {
    writeFileSync(join(dir, `images/products/demo/${name}`), 'RIFFxxxxWEBP');
  }
  return dir;
}

function validFamily() {
  return {
    id: 'demo', order: 1, slug: 'demo-series', series: 'Demo Series',
    category: 'rugged-tablet', formFactor: '10-inch tablet',
    tags: ['10.1"', 'Android 16', 'IP67'], defaultVariant: 'standard',
    heroImage: '/images/products/demo/front.webp',
    kpis: [
      { label: 'Display', value: '10.1 in' },
      { label: 'Battery', value: '10,000 mAh' },
      { label: 'Protection', value: 'IP67' }
    ],
    comparison: {
      formFactor: 'tablet', rfid: 'optional', os: 'Android 16',
      battery: '10,000 mAh', protection: 'IP67', bestFor: 'inventory'
    },
    variantComparison: [{ label: 'OS', values: { standard: 'Android 16' } }],
    sharedSpecGroups: [{
      id: 'platform', label: 'Platform',
      items: [{ label: 'Display', value: '10.1 in' }]
    }],
    variants: [{
      id: 'standard', model: 'Demo Standard',
      image: '/images/products/demo/front.webp',
      gallery: [
        { src: '/images/products/demo/front.webp', view: 'front' },
        { src: '/images/products/demo/angle.webp', view: 'angle' }
      ],
      keySpecs: [
        { label: 'Display', value: '10.1 in' },
        { label: 'OS', value: 'Android 16' },
        { label: 'Battery', value: '10,000 mAh' },
        { label: 'Protection', value: 'IP67' }
      ],
      specGroups: [{
        id: 'system', label: 'System',
        items: [{ label: 'Processor', value: 'Demo CPU' }]
      }],
      options: []
    }]
  };
}

function validCopy() {
  return {
    demo: {
      name: 'Demo Series', eyebrow: 'Demo platform', tagline: 'Demo tagline',
      summary: 'Demo summary', overview: ['One.', 'Two.'],
      variants: {
        standard: {
          label: 'Standard', name: 'Demo Standard', summary: 'Demo variant',
          highlights: ['A', 'B', 'C'],
          features: [
            { title: 'A', body: 'A' }, { title: 'B', body: 'B' }, { title: 'C', body: 'C' }
          ],
          applications: [
            { label: 'Warehouse', solution: 'logistics' },
            { label: 'Production', solution: 'manufacturing' },
            { label: 'Retail', solution: 'retail' },
            { label: 'Field', solution: 'field-service' }
          ]
        }
      }
    }
  };
}

const locales = ['en', 'zh'];

test('valid catalog returns no errors', () => {
  assert.deepEqual(
    validateProductCatalog([validFamily()], { en: validCopy(), zh: validCopy() },
      { publicDir: publicDir(), locales }),
    []
  );
});

test('duplicate variant ids are rejected', () => {
  const family = validFamily();
  family.variants.push(structuredClone(family.variants[0]));
  const errors = validateProductCatalog([family], { en: validCopy(), zh: validCopy() },
    { publicDir: publicDir(), locales });
  assert.ok(errors.some((e) => e.includes('duplicate variant id')));
});

test('missing default variant is rejected', () => {
  const family = validFamily();
  family.defaultVariant = 'missing';
  const errors = validateProductCatalog([family], { en: validCopy(), zh: validCopy() },
    { publicDir: publicDir(), locales });
  assert.ok(errors.some((e) => e.includes('defaultVariant')));
});

test('missing locale content is rejected', () => {
  const errors = validateProductCatalog([validFamily()], { en: validCopy() },
    { publicDir: publicDir(), locales });
  assert.ok(errors.some((e) => e.includes('zh') && e.includes('content')));
});

test('old model names are rejected', () => {
  const family = validFamily();
  family.series = 'HT400 Series';
  const errors = validateProductCatalog([family], { en: validCopy(), zh: validCopy() },
    { publicDir: publicDir(), locales });
  assert.ok(errors.some((e) => e.includes('old model')));
});

test('missing image is rejected', () => {
  const family = validFamily();
  family.heroImage = '/images/products/demo/missing.webp';
  const errors = validateProductCatalog([family], { en: validCopy(), zh: validCopy() },
    { publicDir: publicDir(), locales });
  assert.ok(errors.some((e) => e.includes('image not found')));
});

test('duplicate spec group ids across shared and variant are rejected', () => {
  const family = validFamily();
  family.variants[0].specGroups[0].id = 'platform';
  const errors = validateProductCatalog([family], { en: validCopy(), zh: validCopy() },
    { publicDir: publicDir(), locales });
  assert.ok(errors.some((e) => e.includes('duplicate spec group id')));
});

test('unknown application solution is rejected', () => {
  const copy = validCopy();
  copy.demo.variants.standard.applications[0].solution = 'unknown';
  const errors = validateProductCatalog([validFamily()], { en: copy, zh: copy },
    { publicDir: publicDir(), locales });
  assert.ok(errors.some((e) => e.includes('invalid solution')));
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/products.test.mjs`
Expected: FAIL，`Cannot find module .../src/data/products/validate.ts`。

- [ ] **Step 3: 实现类型与校验器**

`src/data/products/types.ts` 定义本任务 Interfaces 中的全部类型。`ProductFamilyCopy.overview` 为 `[string, string]`；`ProductApplication.solution` 为 `SolutionSlug`。

`src/data/products/validate.ts` 用 `node:fs.existsSync` 和 `node:path.join` 检查图片。错误信息必须包含测试中的关键词。校验顺序建议：

1. catalog 非空；`id`、`slug`、`order` 唯一。
2. 每个 family 的 `category`、`tags.length === 3`、`kpis.length === 3`、`comparison` 六字段。
3. `defaultVariant` 存在；variant id 唯一。
4. 每 variant 的 `keySpecs.length === 4`、gallery >= 2；`sharedSpecGroups.length + variant.specGroups.length >= 2`。
5. 共享组与版本组 id 不重复；每组 items 非空。
6. 每个图片路径以 `/images/products/` 开头且文件存在。
7. 多版本时 `variantComparison.length >= 3`，每行 values 覆盖全部 variant id；单版本允许 `[]`。
8. 每个 locale 有该 family 的 copy；variant copy 覆盖全部 variant id，不得有额外 variant key。
9. `overview.length === 2`、`features.length` 3–5、`applications.length === 4` 且 solution 合法。
10. 对 `JSON.stringify(catalog)` 和每个 catalog family 对应的 `contents[locale][family.id]` 跑旧型号正则：`\b(HT400|HT510|HT520|HT530|HT800|Y70|A100|T120A)\b`。只扫描当前 catalog 的 family，避免迁移期旧文案误报。
11. 迁移期允许 `contents` 存在额外顶层 family 键；Task 11 由 `check-i18n` 收紧为完全一致。

- [ ] **Step 4: 运行测试确认通过**

Run: `node --test tests/products.test.mjs`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/data/products/types.ts src/data/products/validate.ts tests/products.test.mjs
git commit -m "feat(products): add product data types and validator"
```

---

### Task 2: 产品图片处理

**Files:**
- Create: `scripts/prepare-product-images.mjs`
- Create: `tests/product-images.test.mjs`
- Create: `public/images/products/ht540/*.webp`、`.../ht550/*.webp`、`.../y100/*.webp`
- Modify: `package.json`（devDependencies 增加 `sharp`）

**Interfaces:**
- Produces: 18 张 1200×1200 以内、白底、WebP 产品图，路径见下表。

**源文件 → 输出路径映射**

| 输出 | 源文件 | 裁剪 |
| --- | --- | --- |
| `ht540/ht540-lf-front.webp` | `产品素材/HT540/7-Android LF RFID Reader -HT540-LF/主图-7-Android LF RFID Reader -HT540-LF/主图1.jpg` | — |
| `ht540/ht540-lf-angle.webp` | 同目录 `主图2.jpg` | — |
| `ht540/ht540-hf-front.webp` | `.../8-Android HF RFID Reader -HT540-HF/主图-8-Android HF RFID Reader -HT540-HF/主图1.jpg` | — |
| `ht540/ht540-hf-angle.webp` | 同目录 `主图2.jpg` | — |
| `ht540/ht540-uhf-front.webp` | `.../9-uhf rfid pda-HT540/主图-9-uhf rfid pda-HT540/主图1.jpg` | — |
| `ht540/ht540-uhf-angle.webp` | 同目录 `主图2.jpg` | — |
| `ht550/ht550-front.webp` | `产品素材/HT550/HT550-图片/主图1.jpg` | — |
| `ht550/ht550-angle.webp` | 同目录 `主图2.jpg` | — |
| `y100/y100-standard-front.webp` | `Y100 rugged tablet/Y100-平板-标准版-图片/Y100-主图-英/Y100主图白底3.jpg` | 顶部裁 80 px 去 LQVIS |
| `y100/y100-standard-angle.webp` | 同目录 `Y100主图白底4.jpg` | 顶部裁 80 px |
| `y100/y100-rfid-front.webp` | `Y100 rugged tablet/Y100-Rugged RFID tablet/主图-11- rfid tablet-Y100-UHF/主图1.jpg` | — |
| `y100/y100-rfid-angle.webp` | 同目录 `主图2.jpg` | — |
| `y100/y100-rtk-front.webp` | `Y100 rugged tablet/Y100-Rugged GNSS RTK Tablet/主图-20-  rtk tablet  -Y100-RTK/主图1.jpg` | — |
| `y100/y100-rtk-angle.webp` | 同目录 `主图3.jpg` | — |
| `y100/y100-fingerprint-front.webp` | `Y100 rugged tablet/Y100 Fingerprint Tablet/Y100-指纹平板-图片/Y100-指纹平板-主图-英/DSC01771_3.jpg` | — |
| `y100/y100-fingerprint-angle.webp` | 同目录 `DSC01770_5.jpg` | — |
| `y100/y100-5g-front.webp` | `Y100 rugged tablet/Y100-5G rugged tablet/主图15- 5G rugged tablet -Y100-5G/主图1.jpg` | — |
| `y100/y100-5g-angle.webp` | 同目录 `主图2.jpg` | — |

- [ ] **Step 1: 写失败测试**

`tests/product-images.test.mjs` 断言 18 个文件存在，且文件头为 WebP：

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const publicDir = join(process.cwd(), 'public');
const files = [
  'images/products/ht540/ht540-lf-front.webp',
  'images/products/ht540/ht540-lf-angle.webp',
  'images/products/ht540/ht540-hf-front.webp',
  'images/products/ht540/ht540-hf-angle.webp',
  'images/products/ht540/ht540-uhf-front.webp',
  'images/products/ht540/ht540-uhf-angle.webp',
  'images/products/ht550/ht550-front.webp',
  'images/products/ht550/ht550-angle.webp',
  'images/products/y100/y100-standard-front.webp',
  'images/products/y100/y100-standard-angle.webp',
  'images/products/y100/y100-rfid-front.webp',
  'images/products/y100/y100-rfid-angle.webp',
  'images/products/y100/y100-rtk-front.webp',
  'images/products/y100/y100-rtk-angle.webp',
  'images/products/y100/y100-fingerprint-front.webp',
  'images/products/y100/y100-fingerprint-angle.webp',
  'images/products/y100/y100-5g-front.webp',
  'images/products/y100/y100-5g-angle.webp'
];

test('product images exist and are WebP', () => {
  for (const file of files) {
    const path = join(publicDir, file);
    assert.ok(existsSync(path), `missing ${file}`);
    const buf = readFileSync(path);
    assert.equal(buf.subarray(0, 4).toString(), 'RIFF', `${file} is not RIFF`);
    assert.equal(buf.subarray(8, 12).toString(), 'WEBP', `${file} is not WebP`);
  }
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/product-images.test.mjs`
Expected: FAIL，`missing images/products/...`。

- [ ] **Step 3: 实现图片脚本并生成产物**

Run: `npm install -D sharp@^0.34.5`

`scripts/prepare-product-images.mjs` 用 `sharp`：

- 源根目录：`const sourceRoot = process.env.PRODUCT_ASSETS ?? join(process.cwd(), '..', '产品素材');`（脚本从 `traknova_site/` 运行）。
- 读 `MAPPINGS`（上表）。
- 若 `cropTop > 0`，先 `extract({ left: 0, top: cropTop, width: metadata.width, height: metadata.height - cropTop })`。
- 再 `resize(1200, 1200, { fit: 'contain', background: '#ffffff' })`。
- 输出 `.webp({ quality: 82 })` 到 `public/images/products/...`，自动建目录。

Run: `node scripts/prepare-product-images.mjs`
Expected: 18 个文件生成。

- [ ] **Step 4: 运行测试确认通过**

Run: `node --test tests/product-images.test.mjs`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json scripts/prepare-product-images.mjs tests/product-images.test.mjs public/images/products
git commit -m "feat(products): add processed product imagery"
```

---

### Task 3: HT540 Series 数据与文案

**Files:**
- Create: `src/data/products/ht540.json`
- Modify: `src/i18n/content/en/products.json`
- Modify: `src/i18n/content/zh/products.json`
- Test: `tests/product-data-ht540.test.mjs`

**Interfaces:**
- Consumes: Task 1 的 `validateProductCatalog`。
- Produces: 产品线 id `ht540`、slug `ht540-series`、版本 `lf`/`hf`/`uhf`，默认 `uhf`。

**必须编码的值**

- `tags`: `["5.5\"", "Android 10", "IP65"]`
- `kpis`: RFID `LF / HF / UHF`；Read range `Up to 3 m UHF`；Protection `IP65`
- `comparison`: formFactor `5.5-inch handheld`；rfid `LF, HF or UHF version`；os `Android 10`；battery `4,900 mAh, replaceable`；protection `IP65, 1.2 m drop`；bestFor `Close-range RFID, stock counts and field data capture`
- `variantComparison` 至少 4 行：RFID band、Read range、Protocol、Typical use。
- `sharedSpecGroups`：
  - `platform`：Display 5.5 in 720×1440；Processor MT6762 8-core 2.0 GHz；OS Android 10；Memory 2 GB+16 GB standard, 4 GB+64 GB optional；Storage microSD up to 256 GB；Rear camera 13 MP；Front camera 5 MP optional；Battery 4,900 mAh replaceable；Connectivity 4G, Wi-Fi 5, BT 5.0, GPS/GLONASS/Galileo/BeiDou；Interface USB Type-C with OTG。
  - `durability`：IP65；1.2 m drop；Operating temperature -20 to 55 °C。
- 版本 `specGroups`：
  - `lf`：RFID 125/134.2 kHz；Protocol ISO 11784/11785；Read range ≤10 cm。
  - `hf`：RFID 13.56 MHz；Protocol ISO 14443A/B, ISO 15693, NFC；Read range 1–3 cm。
  - `uhf`：RFID 865–868 / 902–928 / 920–925 MHz；Protocol EPC C1 Gen2 / ISO 18000-6C；Antenna 3 dBi circular ceramic；Read range 1–3 m。
- 版本 `keySpecs` 固定 4 条，分别突出 RFID、read range、OS、protection。
- 每个版本 `options` 列出条码扫描、NFC、PSAM 中该版本实际支持的项。
- 图片：
  - `lf`：`/images/products/ht540/ht540-lf-front.webp` + `ht540-lf-angle.webp`
  - `hf`：`ht540-hf-front.webp` + `ht540-hf-angle.webp`
  - `uhf`：`ht540-uhf-front.webp` + `ht540-uhf-angle.webp`

**文案要求**

- `name`: `HT540 Series`；`eyebrow`: `Android RFID handheld`；`tagline` 强调一个平台覆盖 LF/HF/UHF。
- `overview` 两段：平台定位 + 三种频段如何选。
- 每个版本：`label`（LF/HF/UHF）、`name`（HT540-LF 等）、`summary`、3 条 `highlights`、4 条 `features`、4 个 `applications`，solution 只用 `logistics`/`manufacturing`/`retail`/`field-service`。
- 中文文案语义对应，型号和规格值保持英文。

- [ ] **Step 1: 写失败测试**

`tests/product-data-ht540.test.mjs` 读取 `ht540.json` 与 en/zh products 内容，调用 validator，断言无错误；再断言：

```js
assert.equal(family.id, 'ht540');
assert.equal(family.variants.length, 3);
assert.deepEqual(family.variants.map((v) => v.id), ['lf', 'hf', 'uhf']);
assert.equal(family.defaultVariant, 'uhf');
assert.ok(JSON.stringify(family).includes('IP65'));
assert.ok(JSON.stringify(family).includes('Android 10'));
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/product-data-ht540.test.mjs`
Expected: FAIL，`ENOENT` 或缺少 `ht540`。

- [ ] **Step 3: 写数据与中英文案**

创建 JSON 并在 en/zh `products.json` 增加顶层 `ht540` 键。不要删除旧键（旧页面仍在用）。

- [ ] **Step 4: 运行测试确认通过**

Run: `node --test tests/product-data-ht540.test.mjs`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/data/products/ht540.json src/i18n/content/en/products.json src/i18n/content/zh/products.json tests/product-data-ht540.test.mjs
git commit -m "feat(products): add HT540 series data"
```

---

### Task 4: HT550 数据与文案

**Files:**
- Create: `src/data/products/ht550.json`
- Modify: `src/i18n/content/en/products.json`
- Modify: `src/i18n/content/zh/products.json`
- Test: `tests/product-data-ht550.test.mjs`

**Interfaces:**
- Produces: 产品线 id `ht550`、slug `ht550`、单版本 `standard`，默认 `standard`。

**必须编码的值**

- `tags`: `["UHF RFID", "1–20 m", "9,600 mAh"]`
- `kpis`: Read range `Up to 15 m (MR6 tag)`；Battery `9,600 mAh`；Protection `IP67`
- `comparison`: formFactor `5.5-inch handheld`；rfid `UHF 860–960 MHz, Impinj E-series`；os `Android 13`；battery `9,600 mAh, 18 W charging`；protection `IP67, 1.2 m drop`；bestFor `Bulk inventory, asset tracking and long-range counting`
- `variantComparison`: `[]`
- `sharedSpecGroups`：
  - `platform`：CPU 8-core 4×A53 2.0 GHz + 4×A53 1.5 GHz；OS Android 13；Memory 3 GB+32 GB / 4 GB+64 GB；Storage microSD up to 256 GB；Display 5.5 in 720×1440；Rear camera 16 MP；Front camera 5 MP optional；Battery 9,600 mAh；Charging 18 W, Type-C 5V/2A；Connectivity 4G, Wi-Fi 5, BT 5.0, GPS/GLONASS/Galileo/BeiDou；Dimensions 171×88×138 mm；Weight 680 g。
  - `environment`：IP67 host only；1.2 m drop；Operating -20 to 55 °C；Storage -40 to 70 °C；Humidity 0–95%；ESD ±15 kV air / ±8 kV contact。
  - `rfid`：Impinj E-series；860–960 MHz with regional bands (China 920–925, US 902–928, others customizable)；EPC C1 Gen2 / ISO 18000-6C；GJB7377.1A-2018 optional；4 dBi circular antenna；1–20 m module rating, 15 m with Impinj MR6 tag in open outdoor conditions；2,000 tags / 10 s。
- 版本 `keySpecs`：RFID `UHF 860–960 MHz`；Read range `1–20 m`；OS `Android 13`；Protection `IP67`。
- `options`：1D/2D barcode scanner、front camera、charging dock。
- 图片：`/images/products/ht550/ht550-front.webp` + `ht550-angle.webp`。

**文案要求**

- `name`: `HT550`；`eyebrow`: `Long-range UHF RFID handheld`；`tagline` 强调长距离和全天续航。
- `overview` 两段。
- 3 条 `highlights`、4 条 `features`、4 个 `applications`。
- 中文同步。

- [ ] **Step 1: 写失败测试**

`tests/product-data-ht550.test.mjs` 断言 validator 无错误，且：

```js
assert.equal(family.id, 'ht550');
assert.equal(family.variants.length, 1);
assert.equal(family.defaultVariant, 'standard');
assert.ok(JSON.stringify(family).includes('9,600 mAh'));
assert.ok(JSON.stringify(family).includes('IP67'));
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/product-data-ht550.test.mjs`
Expected: FAIL。

- [ ] **Step 3: 写数据与中英文案**

- [ ] **Step 4: 运行测试确认通过**

Run: `node --test tests/product-data-ht550.test.mjs`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/data/products/ht550.json src/i18n/content/en/products.json src/i18n/content/zh/products.json tests/product-data-ht550.test.mjs
git commit -m "feat(products): add HT550 data"
```

---

### Task 5: Y100 Series 数据与文案

**Files:**
- Create: `src/data/products/y100.json`
- Modify: `src/i18n/content/en/products.json`
- Modify: `src/i18n/content/zh/products.json`
- Test: `tests/product-data-y100.test.mjs`

**Interfaces:**
- Produces: 产品线 id `y100`、slug `y100-series`、版本 `standard`/`rfid`/`rtk`/`fingerprint`/`5g`，默认 `standard`。

**必须编码的值**

- `tags`: `["10.1\"", "Android 16", "IP67"]`
- `kpis`: Display `10.1 in`；Battery `10,000 mAh`；Protection `IP67`
- `comparison`: formFactor `10.1-inch tablet`；rfid `UHF optional or dedicated RFID version`；os `Android 16 (5G: Android 13)`；battery `10,000 mAh, 30 W PD`；protection `IP67`；bestFor `Inventory, inspection, field service and surveying`
- `variantComparison` 至少 6 行：OS、Processor、Memory、RFID、RTK、5G；每行 values 覆盖 5 个版本（无能力写 `—`）。
- `sharedSpecGroups`：
  - `power`：Battery 10,000 mAh；Charging 30 W PD；Standby >350 h；Working >10 h。
  - `body`：Display 10.1 in; capacitive multi-touch with glove mode；Rear camera 16 MP；Front camera 5 MP optional；Dimensions 290.6×182.5×18.5 mm；Weight 980 g；IP67；1.0 m drop；Operating -20 to 55 °C；Storage -40 to 70 °C；Humidity 0–95%；ESD ±15 kV air / ±8 kV contact。
  - `connectivity`：4G LTE, Wi-Fi 5, BT 5.0, GPS/GLONASS/Galileo/BeiDou；USB-A 2.0 ×1, Type-C 2.0 ×1 (OTG/charge/data)；2 nano SIM or 1 nano SIM + TF。
  - `compliance`：CE (NB), FCC, CCC, RoHS, MIL-STD-810H, UN38.3, MSDS, IEC 62133 — `Per configuration; certificates available on request.`（仅在素材列出的范围内展示，不写证书编号）
- 版本 `specGroups`：
  - `standard`：MT6789 8-core 2.2 GHz；Android 16；8+128 / 8+256；microSD up to 1 TB；display 800×1280 550 nits, optional 1920×1200 IPS 600 nits；options barcode/NFC/UHF RFID/fingerprint。
  - `rfid`：MT6789；Android 16；8+128；Impinj E710/E510/R2000；860–960 MHz regional；EPC C1 Gen2 / ISO 18000-6C；4 dBi circular；up to 10 m；150+ tags/s。
  - `rtk`：MT6789；Android 16；6+128 / 8+128 / 8+256；display 800 nits；1408 channels；GPS L1C/A, L2C, L5 and other constellations；2.5 cm horizontal RTK accuracy；RTK antenna port。
  - `fingerprint`：MT6789；Android 16；6+128 / 8+128 / 8+256；FAP10/FAP20 capacitive fingerprint；550 nits。
  - `5g`：UNISOC 7885 2.7 GHz；Android 13；4+64 / 6+128 / 8+128 / 8+256；microSD up to 512 GB；5G NR n1/n3/n5/n8/n28/n41/n78/n79；550 nits；BT 5.0；working >12 h。
- 版本 `keySpecs` 固定 4 条，突出该版本差异（RFID/RTK/指纹/5G）。
- 图片：`/images/products/y100/y100-<variant>-front.webp` + `-angle.webp`。

**文案要求**

- `name`: `Y100 Series`；`eyebrow`: `10.1-inch rugged tablet platform`；`tagline` 强调一个平台五种现场配置。
- `overview` 两段。
- 每个版本：3 条 `highlights`、4 条 `features`、4 个 `applications`。
- 中文同步。

- [ ] **Step 1: 写失败测试**

`tests/product-data-y100.test.mjs` 断言 validator 无错误，且：

```js
assert.equal(family.id, 'y100');
assert.deepEqual(family.variants.map((v) => v.id),
  ['standard', 'rfid', 'rtk', 'fingerprint', '5g']);
assert.equal(family.defaultVariant, 'standard');
assert.ok(JSON.stringify(family).includes('Android 16'));
assert.ok(JSON.stringify(family).includes('Android 13'));
assert.ok(JSON.stringify(family).includes('10,000 mAh'));
assert.ok(JSON.stringify(family).includes('IP67'));
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/product-data-y100.test.mjs`
Expected: FAIL。

- [ ] **Step 3: 写数据与中英文案**

- [ ] **Step 4: 运行测试确认通过**

Run: `node --test tests/product-data-y100.test.mjs`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/data/products/y100.json src/i18n/content/en/products.json src/i18n/content/zh/products.json tests/product-data-y100.test.mjs
git commit -m "feat(products): add Y100 series data"
```

---

### Task 6: 产品目录 loader 与查询 API

**Files:**
- Create: `src/data/products/catalog.ts`
- Test: `tests/product-catalog.test.mjs`

**Interfaces:**
- Consumes: Task 1 类型与 validator；Task 3–5 JSON 与文案。
- Produces:
  - `getProductFamilies(locale: Locale): ProductFamily[]`
  - `getProductFamily(locale: Locale, slug: string): ProductFamily | undefined`
  - `getProductVariant(family: ProductFamily, variantId: string): ProductVariant | undefined`
  - `getCategoryLabel(locale: Locale, category: ProductCategory): string`
  - `getProductHref(family: ProductFamily, variantId?: string): string`（返回 locale-neutral 的 `/products/<slug>/#variant-<id>`；调用方再用 `localizedPath(locale, ...)` 加语言前缀和 `/website` base）
  - `getProductFamilies` 按 `order` 升序返回。

实现要点：

- 用 `readFileSync(new URL('./ht540.json', import.meta.url), 'utf8')` 读取三个 JSON，不直接 `import` JSON，保证 Node 测试和 Astro 构建都能运行。
- 读取 `../../i18n/content/en/products.json` 和 `zh/products.json`。
- 用 `readFileSync` + `JSON.parse` 读取 `../../i18n/dictionaries/{en,zh}.json` 供 `getCategoryLabel` 使用；不要导入 `getDictionary`，因为 Node 22 不能直接导入 JSON 模块。
- **不要**在 `catalog.ts` 中导入 `src/utils/paths.ts`；`import.meta.env.BASE_URL` 在纯 Node 测试中不存在。路径前缀由视图层处理。
- `publicDir` 用 `fileURLToPath(new URL('../../../public/', import.meta.url))`。
- 模块加载时调用 `validateProductCatalog`；有错误时抛 `Error('Product data invalid:\n- ...')`。
- 缓存每个 locale 的合并结果。
- 合并时把 variant 基础数据与 `copy.variants[variant.id]` 合并，并保留 family 上的 `id`/`slug`。
- `getCategoryLabel` 读字典 `common.categories.rfidHandheld` / `ruggedTablet`。
- `getProductHref` 多版本时返回 `/products/<slug>/#variant-<id>`，单版本返回 `/products/<slug>/`。

- [ ] **Step 1: 写失败测试**

`tests/product-catalog.test.mjs`：

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getProductFamilies, getProductFamily, getProductVariant, getProductHref
} from '../src/data/products/catalog.ts';

test('returns three families in order', () => {
  const families = getProductFamilies('en');
  assert.deepEqual(families.map((f) => f.id), ['ht540', 'ht550', 'y100']);
  assert.deepEqual(families.map((f) => f.order), [1, 2, 3]);
});

test('merges localized variant copy', () => {
  const family = getProductFamily('zh', 'y100-series');
  assert.equal(family.name, 'Y100 Series');
  assert.equal(family.variants.length, 5);
  assert.ok(family.variants[0].summary.length > 0);
});

test('resolves variants by id', () => {
  const family = getProductFamily('en', 'ht540-series');
  assert.equal(getProductVariant(family, 'uhf').model, 'HT540-UHF');
  assert.equal(getProductVariant(family, 'missing'), undefined);
});

test('builds variant deep links', () => {
  const family = getProductFamily('en', 'y100-series');
  assert.equal(getProductHref(family, 'rfid'), '/products/y100-series/#variant-rfid');
  assert.equal(getProductHref(family), '/products/y100-series/');
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/product-catalog.test.mjs`
Expected: FAIL，模块不存在。

- [ ] **Step 3: 实现 catalog.ts**

- [ ] **Step 4: 运行测试确认通过**

Run: `node --test tests/product-catalog.test.mjs`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/data/products/catalog.ts tests/product-catalog.test.mjs
git commit -m "feat(products): add product catalog loader"
```

---

### Task 7: 产品总览与详情页切换

**Files:**
- Create: `src/components/ProductFamilyCard.astro`
- Create: `src/scripts/product-variants.mjs`
- Modify: `src/views/ProductsIndexView.astro`
- Modify: `src/views/ProductDetailView.astro`
- Modify: `src/pages/products/[slug].astro`
- Modify: `src/pages/[lang]/products/[slug].astro`
- Modify: `src/i18n/dictionaries/en.json`
- Modify: `src/i18n/dictionaries/zh.json`
- Test: `tests/product-variants.test.mjs`

**Interfaces:**
- Consumes: Task 6 的 `getProductFamilies`、`getProductFamily`、`getProductHref`。
- Produces: `ProductFamilyCard` props `{ family: ProductFamily; locale: Locale; compact?: boolean }`。
- Produces: 字典 `products.*` 与 `productDetail.*` 新结构、`common.categories.rfidHandheld` / `ruggedTablet`。
- Produces: `parseVariantHash(hash: string, variantIds: string[]): string | null`
- Produces: `buildVariantHash(variantId: string): string`
- Produces: `getInitialVariant(variantIds: string[], defaultId: string, hash: string): string`
- Produces: `enhanceVariantSelector(root: HTMLElement): void`

**页面结构**

产品总览 `ProductsIndexView.astro`：

1. Hero：eyebrow、两行标题、说明；右侧三张产品图组合（用 `heroImage`）。
2. Anchor chips：三条产品线 + `#compare`。
3. `Choose by work`：3 张场景卡（批量盘库 / 近距离 RFID / 现场计算），链接到产品线详情。
4. 三条产品线区块：序号、大图、名称、定位语、摘要、3 个 KPI、版本标签、`Explore` 链接；左右交替。
5. 对比表：`comparison` 六列 + 产品线名。
6. 保留 modules/FAQ/CTA 区块；文案从字典读取。
7. 不渲染旧 task selector、family cards、12 卡片、筛选按钮。

产品详情 `ProductDetailView.astro`：

1. Breadcrumb + 产品线 Hero。
2. `role="tablist"` 版本选择器（多版本时）；单版本隐藏。
3. 每个版本一个 `role="tabpanel"`，包含：图库、摘要、4 个 keySpecs、特性、规格表、应用、CTA。
4. 版本对比表（使用 `variantComparison`），表头按钮可切换版本。
5. Sticky jump nav：Overview · Variants · Key features · Specifications · Applications。
6. 共享规格 + 版本规格按顺序渲染；`options` 单独列表。
7. Related series：另外两条产品线卡片。
8. fine print 固定英文：`Specifications are for the listed configuration and may change without notice. Confirm the approved datasheet before ordering.`
9. JSON-LD：每个产品线输出 `ProductGroup`，`hasVariant` 为每个版本一个 `Product` 节点；名称、摘要、图片、SKU 从数据读取。

DOM 约定：

```html
<div data-product-variants data-default-variant="uhf">
  <div class="variant-tabs" role="tablist">
    <button role="tab" data-variant-tab="uhf" aria-controls="variant-panel-uhf" aria-selected="true">UHF</button>
  </div>
  <div class="variant-panels">
    <section id="variant-panel-uhf" role="tabpanel" data-variant-panel="uhf">...</section>
  </div>
</div>
```

图片 `alt` 由 `variant.name` + `gallery[].view` 生成（如 `Y100 RFID — front`），不得把营销长文案塞进 alt。

`product-variants.mjs` 行为：

- `parseVariantHash('#variant-rfid', ids)` 只接受已知 id，否则 `null`。
- `getInitialVariant` 优先 hash，其次 default，最后 `variantIds[0]`。
- `enhanceVariantSelector` 设置 `data-enhanced`，隐藏非当前面板；点击/左右方向键切换；`history.replaceState` 写 hash；更新 `aria-selected` 与 `tabindex`。
- 无 JS 时 CSS 不加 `data-enhanced`，所有面板可见。

- [ ] **Step 1: 写版本 hash 失败测试**

`tests/product-variants.test.mjs`：

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseVariantHash, buildVariantHash, getInitialVariant } from '../src/scripts/product-variants.mjs';

test('parses a known variant hash', () => {
  assert.equal(parseVariantHash('#variant-rfid', ['standard', 'rfid']), 'rfid');
});
test('rejects an unknown variant hash', () => {
  assert.equal(parseVariantHash('#variant-missing', ['standard', 'rfid']), null);
  assert.equal(parseVariantHash('', ['standard']), null);
});
test('builds a variant hash', () => {
  assert.equal(buildVariantHash('5g'), '#variant-5g');
});
test('prefers hash, then default, then first variant', () => {
  assert.equal(getInitialVariant(['a', 'b'], 'a', '#variant-b'), 'b');
  assert.equal(getInitialVariant(['a', 'b'], 'b', '#variant-missing'), 'b');
  assert.equal(getInitialVariant(['a', 'b'], 'missing', ''), 'a');
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/product-variants.test.mjs`
Expected: FAIL，模块不存在。

- [ ] **Step 3: 添加产品页字典**

在 en/zh `dictionaries` 中同步重写：

- `common.categories.rfidHandheld` / `ruggedTablet`；保留旧分类键到 Task 11。
- `products`: hero、anchors、work（3 张场景卡）、comparison headers、modules、faq、cta；删除旧 taskSelector/families/sections/旧 comparison rows。
- `productDetail`: breadcrumb、hero CTAs、sticky nav labels、overview、variants、features、specs（含 fineprint）、applications、related、cta；删除旧 whereItFits/configuration。
- 中文按英文语义翻译；规格值不进入字典。

- [ ] **Step 4: 实现 ProductFamilyCard、ProductsIndexView、routes**

路由 `getStaticPaths()` 改为：

```ts
import { getProductFamilies } from '../../data/products/catalog';
export function getStaticPaths() {
  return getProductFamilies('en').map((family) => ({
    params: { slug: family.slug }, props: { family }
  }));
}
```

`[lang]` 版本对每种 locale 生成。详情页 props 改为 `{ family }`。

- [ ] **Step 5: 实现 ProductDetailView 与版本脚本**

- [ ] **Step 6: 运行测试与构建**

Run: `node --test tests/product-variants.test.mjs`
Expected: PASS。

Run: `npm run build`
Expected: 成功；`dist/products/ht540-series/`、`ht550/`、`y100-series/` 及 `dist/zh/...` 存在。

- [ ] **Step 7: Commit**

```bash
git add src/components/ProductFamilyCard.astro src/scripts/product-variants.mjs src/views/ProductsIndexView.astro src/views/ProductDetailView.astro src/pages/products/[slug].astro src/pages/[lang]/products/[slug].astro src/i18n/dictionaries/en.json src/i18n/dictionaries/zh.json tests/product-variants.test.mjs
git commit -m "feat(products): rebuild product index and variant detail pages"
```

---

### Task 8: 产品页样式与响应式

**Files:**
- Modify: `src/styles/enterprise.css`

**Interfaces:**
- Consumes: Task 7 的 DOM 类名：`.family-showcase`、`.family-index`、`.kpi-row`、`.kpi`、`.variant-tags`、`.compare-table`、`.product-hero`、`.product-gallery`、`.gallery-thumbs`、`.variant-tabs`、`.variant-tab`、`.variant-panels`、`.variant-panel`、`.key-spec-grid`、`.feature-grid`、`.feature-card`、`.application-grid`、`.application-card`、`.product-sticky-nav`。

- [ ] **Step 1: 添加基础样式**

在 `enterprise.css` 的产品区新增：12 列栅格、80–96 px section 间距、1 px 细线、圆角 12–14 px、产品图浅灰渐变底、KPI 行、版本 tab 深色激活态、规格表两列表、feature/application 卡片网格。

同时覆盖首页/总览的 `.product-grid` 为 3 列（产品线卡片），窄屏 1 列；不要沿用旧的 4 列产品卡规则。

- [ ] **Step 2: 添加版本切换兜底**

```css
[data-product-variants][data-enhanced] .variant-panel[hidden] { display: none; }
[data-product-variants]:not([data-enhanced]) .variant-panel { display: block; }
```

- [ ] **Step 3: 响应式**

- `max-width: 1100px`：产品线区块单列，对比表横向滚动。
- `max-width: 900px`：feature/application 两列变一列，KPI 两列。
- `max-width: 650px`：版本 tab 横向滚动，图库缩略图横向滚动，规格表字号缩小，sticky 底部 CTA。

- [ ] **Step 4: 构建并目视检查**

Run: `npm run build && npm run preview`
Expected: 桌面与移动宽度无横向溢出；版本 tab 可点击；无 JS 时所有版本面板可见。

- [ ] **Step 5: Commit**

```bash
git add src/styles/enterprise.css
git commit -m "style(products): add international product page styling"
```

---

### Task 9: 首页、页脚与字典

**Files:**
- Modify: `src/views/HomeView.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/i18n/dictionaries/en.json`
- Modify: `src/i18n/dictionaries/zh.json`

**Interfaces:**
- Consumes: `ProductFamilyCard`、`getProductFamilies`。
- Produces: 字典 `footer.columns.productsAll`、新的 `home.portfolio` 结构。

- [ ] **Step 1: 更新首页产品区**

把旧 `products.map(ProductCard)` + filter 替换为：

```astro
<div class="product-grid">
  {families.map((family) => <ProductFamilyCard family={family} locale={locale} compact />)}
</div>
```

`const families = getProductFamilies(locale);`，删除 `ProductCard` 与旧 `getProducts` 导入。区块标题使用 `home.portfolio`。

- [ ] **Step 2: 更新页脚**

三个产品链接改为 `families` 驱动：

```astro
{families.map((family) => (
  <a href={localizedPath(locale, `/products/${family.slug}/`)}>{family.name}</a>
))}
<a href={localizedPath(locale, '/products/')}>{dict.footer.columns.productsAll}</a>
```

- [ ] **Step 3: 更新首页与页脚字典**

en/zh 同步替换：

- `footer.columns`: 删除旧产品分类键，保留 `productsAll`；三条产品线链接直接用 `family.name` 渲染，不写死名称。
- `home.portfolio`: 三平台标题/说明；`viewAll` 指向全部产品。

中文按英文语义翻译。

- [ ] **Step 4: 更新 i18n 校验的产品期望**

`scripts/check-i18n.mjs` 的 `EXPECTED_SLUGS` 改为从 `src/data/products/*.json` 读取 `id`，并要求 en/zh 都包含这些顶层键；暂时允许旧键存在（Task 11 收尾）。

- [ ] **Step 5: 构建与检查**

Run: `npm run build && npm run i18n:check`
Expected: 成功。

- [ ] **Step 6: Commit**

```bash
git add src/views/HomeView.astro src/components/Footer.astro src/i18n/dictionaries/en.json src/i18n/dictionaries/zh.json scripts/check-i18n.mjs
git commit -m "feat(products): update home and footer product entries"
```

---

### Task 10: 解决方案页设备引用迁移

**Files:**
- Modify: `src/data/solutions/index.ts`
- Modify: `src/views/SolutionDetailView.astro`
- Modify: `src/components/SolutionDeviceCard.astro`
- Modify: `src/i18n/content/en/solutions.json`
- Modify: `src/i18n/content/zh/solutions.json`
- Test: `tests/solutions-devices.test.mjs`

**Interfaces:**
- `DeviceRef` 改为 `{ slug: string; variant?: string }`。
- `SolutionDeviceCard` props 改为 `{ family: ProductFamily; variant: ProductVariant; locale: Locale; label: string }`。
- `SolutionDetailView` 用 `getProductFamily` 解析设备；链接用 `getProductHref`。

**旧 slug → 新产品线/版本映射**

| 旧 slug | 新 slug | variant |
| --- | --- | --- |
| `ht400-rugged-barcode-pda` | `ht540-series` | `uhf` |
| `ht510-rugged-pda` | `ht540-series` | `uhf` |
| `ht520-multifunction-pda` | `ht540-series` | `uhf` |
| `ht530-document-id-pda` | `y100-series` | `standard` |
| `ht800-scan-print-pda` | `y100-series` | `standard` |
| `ht540-rfid-handheld` | `ht540-series` | `uhf` |
| `ht550-uhf-rfid-handheld` | `ht550` | `standard` |
| `y100-uhf-rfid-tablet` | `y100-series` | `rfid` |
| `y100-rugged-android-tablet` | `y100-series` | `standard` |
| `y70-rugged-tablet` | `y100-series` | `standard` |
| `a100-windows-rugged-tablet` | `y100-series` | `standard` |
| `t120a-windows-industrial-tablet` | `y100-series` | `5g` |

同时：

- 把 en/zh `solutions.json` 中所有 `devices` 数组改成 `{ slug, variant }`。
- 替换 `solutionMatrix` 的 devices 文案：
  - `HT540 Series · HT550 · Y100 Series`
  - `HT540 Series · Y100 Series`
  - `HT540 Series · HT550 · Y100 Series`
  - `HT540 Series · HT550 · Y100 Series`
- 把 `specializedWorkflows` 中 `HT510 Medical edition` 改为 `HT540 Series RFID handheld`，`HT530 Document & ID Capture` 改为 `Y100 Series rugged tablet`；相关 body/note 同步改写。
- 所有 note 中的旧型号（HT800、A100、HT530、HT510）改成新家族或通用“configured device / compatible printer”。
- `SolutionDeviceCard` 剪影映射：`rfid-handheld → device-rfid.svg`，`rugged-tablet → device-tablet.svg`。
- `SolutionDeviceCard` 的 `getCategoryLabel` 改为从 `src/data/products/catalog` 导入，不再从旧 `../data/products` 导入。
- 去重 key 用 `${slug}#${variant}`。

- [ ] **Step 1: 写失败测试**

`tests/solutions-devices.test.mjs`：

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getProductFamily } from '../src/data/products/catalog.ts';

const locales = ['en', 'zh'];
const OLD = /\b(HT400|HT510|HT520|HT530|HT800|Y70|A100|T120A)\b/;

for (const locale of locales) {
  const content = JSON.parse(readFileSync(
    new URL(`../src/i18n/content/${locale}/solutions.json`, import.meta.url), 'utf8'));

  test(`${locale}: every device resolves to a family and variant`, () => {
    const refs = [
      ...content.industries.flatMap((i) => i.scenarios.flatMap((s) => s.devices)),
      ...content.specializedWorkflows.flatMap((w) => w.devices)
    ];
    for (const ref of refs) {
      const family = getProductFamily(locale, ref.slug);
      assert.ok(family, `${locale}: unknown family ${ref.slug}`);
      assert.ok(
        family.variants.some((v) => v.id === (ref.variant ?? family.defaultVariant)),
        `${locale}: unknown variant ${ref.slug}#${ref.variant}`
      );
    }
  });

  test(`${locale}: no old model names remain`, () => {
    assert.equal(OLD.test(JSON.stringify(content)), false);
  });
}
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test tests/solutions-devices.test.mjs`
Expected: FAIL，旧型号或未知 family。

- [ ] **Step 3: 更新 solutions 数据与视图**

- [ ] **Step 4: 运行测试与构建**

Run: `node --test tests/solutions-devices.test.mjs && npm run build`
Expected: PASS；解决方案页设备卡片指向新详情页。

- [ ] **Step 5: Commit**

```bash
git add src/data/solutions/index.ts src/views/SolutionDetailView.astro src/components/SolutionDeviceCard.astro src/i18n/content/en/solutions.json src/i18n/content/zh/solutions.json tests/solutions-devices.test.mjs
git commit -m "feat(solutions): remap device references to new product lines"
```

---

### Task 11: 清理旧产品与最终校验

**Files:**
- Delete: `src/data/products/base.ts`、`src/data/products/index.ts`、`src/components/ProductCard.astro`
- Delete: `PRODUCT_CATALOG.csv`、`PRODUCT_DATA_REVIEW.md`
- Modify: `src/i18n/content/en/products.json`、`src/i18n/content/zh/products.json`（删旧键）
- Modify: `scripts/check-i18n.mjs`、`scripts/check-dist.mjs`
- Create: `src/data/products/README.md`
- Modify: `CONTENT_TODO.md`

**Interfaces:**
- Produces: 公开页面与源码中不再有旧型号；构建校验锁定新页面。

- [ ] **Step 1: 删除旧数据与组件**

确认无引用后删除：

```bash
grep -R "data/products'\|data/products/index\|ProductCard" src --include=*.astro --include=*.ts
```

预期只剩新 `catalog.ts`、`ProductFamilyCard` 和 solutions 的新引用。删除旧文件。

- [ ] **Step 2: 删除旧 products 内容键**

从 en/zh `products.json` 删除 12 个旧 slug（`ht400-...` 到 `t120a-...`），只保留 `ht540`、`ht550`、`y100`。

同时删除字典中已无引用的旧分类键 `common.categories.ruggedPda` / `rfid` / `industrialTablet*` 和旧 footer 产品键（若仍存在）。删除前运行：

```bash
grep -R "ruggedPda\|industrialTablet\|categories.rfid\|productsRuggedPda\|productsRfid\|productsTablets" src --include=*.astro --include=*.ts
```

确认无结果。

- [ ] **Step 3: 收紧 check-i18n**

- `EXPECTED_SLUGS` 改为读取三个产品 JSON 的 `id`。
- en/zh products 的顶层键必须与这三个 id 完全一致（不允许额外键）。
- 保留现有 dictionary key 对比。

- [ ] **Step 4: 更新 check-dist**

- `requiredPages` 删除 `zh/products/ht400-rugged-barcode-pda/index.html`。
- 新增：
  - `products/ht540-series/index.html`
  - `products/ht550/index.html`
  - `products/y100-series/index.html`
  - `zh/products/ht540-series/index.html`
  - `zh/products/ht550/index.html`
  - `zh/products/y100-series/index.html`
- `sentinels` 中 `zh/products/index.html` 的旧英文 `Start with the task` 改为新产品总览的中文 hero 文案（例如 `三条产品线`）；`zh/index.html` 的首页产品区标题如变化也同步。
- 检查每个产品页包含 `data-product-variants`、`HT540 Series`/`HT550`/`Y100 Series` 中对应名称。
- 检查旧产品页不存在（8 个旧 slug）。
- 检查解决方案页的设备链接不包含旧 slug。

- [ ] **Step 5: 写维护说明并清理旧文档**

`src/data/products/README.md` 说明：

- 新增产品线：复制一个 JSON，保证 id/slug/order 唯一；在 en/zh products.json 增加同名键。
- 新增版本：加 `variants[]`、`variantComparison` 值、文案 `variants.<id>`。
- 图片放 `public/images/products/<line>/`，路径写入 JSON。
- 规格值保持英文；不要写占位文案；构建会校验。
- 运行 `npm test && npm run build`。

删除 `PRODUCT_CATALOG.csv`、`PRODUCT_DATA_REVIEW.md`。更新 `CONTENT_TODO.md` 的产品段落为“已由 src/data/products 接管；上线前复核 spec §2.4 冲突表与认证表述”。

- [ ] **Step 6: 全量搜索旧型号**

Run:

```bash
grep -RInE "HT400|HT510|HT520|HT530|HT800|Y70|A100|T120A|lqycit|lqvis" src public scripts --exclude-dir=dist
```

Expected: 无结果。设计/计划文档中的历史型号说明不在此范围。

- [ ] **Step 7: 运行完整校验**

Run:

```bash
npm test
npm run build
npm run i18n:check
npm run check:dist
```

Expected: 全部 PASS；`dist` 中只有 6 个新产品详情页（en/zh × 3），没有旧产品页。

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor(products): remove legacy catalog and finalize product migration"
```

---

## Self-Review

- **Spec coverage:** 产品线/版本、数据 JSON、共享规格、版本对比、图片、总览、详情、版本切换、首页、页脚、解决方案迁移、旧数据清理、构建校验均有对应任务。
- **Type consistency:** `ProductFamily`/`ProductVariant`/`ProductFamilyCopy` 在 Task 1 定义，Task 6 产出，Task 7/10 消费；`DeviceRef` 在 Task 10 扩展。
- **Review Focus tests:** 旧引用 → Task 10；版本 hash → Task 7；本地化键 → Task 1/9/11；共享规格冲突 → Task 1；图片 → Task 1/2。
- **Proportion:** 数据值与文案规则放在 spec 和任务表里，未逐字抄写完整 JSON。
