# TRAKNOVA 产品模块重构设计

日期：2026-11-05
状态：已确认（2026-11-05）
范围：产品数据层、产品总览页、产品详情页、首页产品区、导航/页脚产品入口

## 1. 背景与目标

当前站点有 12 个“旧目录”产品，结构性数据写死在 `src/data/products/base.ts`，
文案在 `src/i18n/content/{en,zh}/products.json`。旧分类是 Rugged PDA / RFID /
Industrial Tablet，与本次提供的产品素材不一致；根目录的 `PRODUCT_CATALOG.csv`
并没有被代码读取。

本次以“产品素材”目录中的三条产品线为准，完全替换旧产品：

1. **HT540 Series**：5.5 英寸 Android RFID 手持机，含 LF / HF / UHF 三个版本。
2. **HT550**：5.5 英寸长距离 UHF RFID 手持机。
3. **Y100 Series**：10.1 英寸加固平板平台，一个产品页 + 版本选择器。

### 目标

- 产品总览只呈现三条产品线；首页只呈现三张产品线卡片。
- 每个产品线一个详情页；HT540、Y100 通过版本选择器切换 LF/HF/UHF 或
  Standard/RFID/RTK/Fingerprint/5G。版本切换同步主图、关键参数、卖点、规格表。
- 产品结构性数据全部移到带类型的本地 JSON，页面不写死任何型号、参数或图片路径。
- 数据在构建时校验：字段缺失、版本引用错误、翻译键缺失、图片不存在都让构建失败。
- 中英文同步维护；产品型号名和规格表保持英文（沿用现有 i18n 决策）。
- 视觉向国际工业设备厂商靠拢：大留白、清晰的信息层级、技术参数摘要、
  克制的品牌色，不做电商式密集卡片。
- 保持现有询盘、联系、OEM/ODM 页面不受影响；解决方案页的行业结构、
  文案框架和剪影视觉保持不变，仅把设备引用同步到新产品线。

### 非目标

- 不做购物车、价格、库存、在线下单。
- 不接入 CMS 或数据库；不引入运行时 API。
- 不新增语言，不改变现有 `/` 与 `/zh/` 路由规则。
- 不重做解决方案页的行业内容和设备剪影；只替换其中引用的旧产品。`sol-device-*.svg`
  剪影继续使用。
- 不把国内市场的 Y100 身份证版、鸿蒙版纳入国际站。
- 不承诺未经验证的认证、测试报告或交期。

### 反目标（视为失败）

- 页面或组件里仍能搜到旧型号（HT400/HT510/HT520/HT530/HT800/Y70/A100/T120A）。
- 同一个产品版本被拆成多个重复卡片或多个独立页面。
- 改一个参数需要同时改 `.astro`、TS 和 JSON 多处。
- 版本切换只换标题不换图片/规格，或刷新后丢失版本。
- 产品图片仍引用外站 URL，或保留 LQVIS 品牌标识。
- 中文站产品区为空或中英混排。

## 2. 产品线、版本与命名

### 2.1 产品线

| 产品线 | slug | 定位 | 版本 |
| --- | --- | --- | --- |
| HT540 Series | `ht540-series` | Android RFID handheld | `lf` / `hf` / `uhf` |
| HT550 | `ht550` | Long-range UHF RFID handheld | 单一版本 `standard` |
| Y100 Series | `y100-series` | 10.1" rugged tablet platform | `standard` / `rfid` / `rtk` / `fingerprint` / `5g` |

三个 slug 在 en 与 zh 中保持一致。旧的产品 slug 全部删除。

### 2.2 版本要点（来自素材，作为数据录入依据）

**HT540 Series**（共用平台：MT6762 8 核 2.0 GHz、Android 10、5.5" 720×1440、
2 GB+16 GB 标准 / 4 GB+64 GB 可选、4900 mAh、IP65、1.2 m 跌落、4G、
Wi-Fi 5、BT 5.0、GPS、13 MP 后摄、Type-C）

| 版本 | RFID | 读距 | 其他 |
| --- | --- | --- | --- |
| `uhf` | UHF 865–868 / 902–928 / 920–925 MHz，EPC C1 Gen2 / ISO 18000-6C，3 dBi 陶瓷圆极化天线 | 1–3 m | 条码、NFC、PSAM 可选 |
| `hf` | 13.56 MHz，ISO 14443A/B、ISO 15693、NFC | 1–3 cm | 条码、PSAM 可选 |
| `lf` | 125 / 134.2 kHz，ISO 11784/11785 | ≤10 cm | 条码、NFC 可选 |

**HT550**（Android 13、8 核 2.0 GHz、3 GB+32 GB 标准 / 4 GB+64 GB 可选、
5.5" 720×1440、9600 mAh、IP67 主机、1.2 m 跌落、680 g、Impinj E 系列、
4 dBi 圆极化天线、860–960 MHz 区域频段、EPC C1 Gen2 / ISO 18000-6C、
1–20 m 模块标称、开阔环境 MR6 标签约 15 m、2000 标签/10 秒、
1D/2D 扫描可选、4G、Wi-Fi 5、BT 5.0、GPS/GLONASS/Galileo/BeiDou、
18 W 快充、-20~55 °C、±15 kV ESD）

**Y100 Series**

| 版本 | 平台 | 内存 | 显示 | 关键能力 |
| --- | --- | --- | --- | --- |
| `standard` | MT6789 8 核 2.2 GHz，Android 16 | 8+128 / 8+256 | 10.1" 800×1280 550 nits；可选 1920×1200 IPS 600 nits | 条码 / NFC / UHF RFID / 指纹可选 |
| `rfid` | 同上 | 8+128 | 同上 | Impinj E710/E510/R2000，860–960 MHz，10 m，150+ 标签/秒 |
| `rtk` | 同上 | 6+128 / 8+128 / 8+256 | 10.1" 800×1280 800 nits | 1408 通道 RTK，水平精度 2.5 cm，顶部天线口 |
| `fingerprint` | 同上 | 6+128 / 8+128 / 8+256 | 10.1" 800×1280 550 nits | FAP10 / FAP20 电容指纹模块 |
| `5g` | UNISOC 7885 8 核 2.7 GHz，Android 13 | 4+64 / 6+128 / 8+128 / 8+256 | 10.1" 800×1280 550 nits | 5G NR n1/n3/n5/n8/n28/n41/n78/n79 |

Y100 共用：10,000 mAh、30 W PD、IP67（Key features 另列 IP68 可选，
上线前由业务确认）、1.0 m 跌落（规格表口径）、4G 版本 Wi-Fi 5 / BT 5.0
（5G 版 BT 5.0）。
不同版本的电池、防护、认证描述以该版本规格书为准。

### 2.3 命名规则

- 产品线显示名：`HT540 Series`、`HT550`、`Y100 Series`。
- 版本显示名：`HT540-LF`、`HT540-HF`、`HT540-UHF`、`Y100 Standard`、
  `Y100 RFID`、`Y100 RTK`、`Y100 Fingerprint`、`Y100 5G`。
- 页面 H1 用产品线名；版本名出现在版本选择器和规格区，不重复做 H1。

### 2.4 规格事实来源与冲突处理

同一版本在素材里常有多个 docx/pdf，且存在互相矛盾的表述。为保证公开页
可追溯、可复核，采用以下规则：

1. **权威来源**：每个版本以该版本目录下最新的英文 `Product Specification`
   文档的表格为准（HT540 使用 `HT540-rfid pda.docx` 的规格表；HT550 使用
   `HT550-handheld rfid reader-Product Specification.docx`；Y100 各版本使用
   对应 `*-Specifications.docx` / `*Specification document.docx`）。
2. **Key features 只做补充**：营销类 `Key features` 文档用于补充可选模块、
   认证和卖点；与规格表冲突时不采用更强的数值。
3. **冲突值**：

   | 项目 | 采用值 | 说明 |
   | --- | --- | --- |
   | HT550 电池 | 9,600 mAh | 规格表与 Key features 一致 |
   | HT550 读距 | 开阔环境 MR6 标签约 15 m；模块标称 1–20 m | 两个口径同时保留，不合并成单一承诺 |
   | HT550 群读 | 最高 200 标签/秒（2,000/10 秒） | 规格表口径；Key features 的 150+/秒为保守值 |
   | HT550 存储扩展 | microSD 最大 256 GB | 规格表口径；Key features 的 512 GB 不采用 |
   | HT540 内存 | 2 GB+16 GB 标准，4 GB+64 GB 可选 | 以规格表为准；不同营销稿的 3+32/4+64 不采用 |
   | Y100 系统 | Standard/RFID/RTK/Fingerprint 为 Android 16；5G 版 Android 13 | 按版本区分 |
   | Y100 跌落 | 1.0 m（规格表） | Key features 的 1.2 m/MIL-STD-810H 仅作为可选认证说明，不作为默认承诺 |
   | Y100 防护 | IP67 标准；IP68 可选 | Key features 将 IP68 列为可选；不把 IP68 写成标配 |
   | Y100 RFID 读距 | RFID 版 10 m；Standard 可选 UHF 15 m | 按版本文档分别展示 |
   | Y100 亮度 | Standard/RFID/Fingerprint/5G 550 nits；RTK 800 nits | 按版本区分 |
   | 认证 | 仅在素材明确列出时展示，并写“per configuration; certificates on request” | 不写证书编号，不承诺未列出的市场准入 |

4. **不发布的值**：素材没有写、或同一版本两份文档无法收敛的字段，不进入
   `keySpecs`/`specGroups`；不用占位文案填充。
5. **不发布带 LQVIS/LQYCIT 品牌的 PDF**：v1 不提供公开 datasheet 下载，
   详情页统一用 `Request the datasheet` 引导到询盘表单。
6. 所有公开规格底部加 fine print，说明配置与批次可能变化，以确认后的
   数据表为准；上线前由业务复核冲突表和认证表述。

## 3. 数据层设计

### 3.1 文件结构

```text
src/data/products/
  index.ts          # 类型、加载、校验、查询函数
  ht540.json        # 产品线 + 版本 + 规格（英文技术事实）
  ht550.json
  y100.json
src/i18n/content/en/products.json   # 英文营销文案，按产品线/版本 id 索引
src/i18n/content/zh/products.json   # 中文营销文案
```

产品 JSON 只放“技术事实”：id、slug、型号、分类、图片路径、标签、关键参数、
规格分组、可选配置、数据表下载路径。名称、定位语、摘要、卖点、特性说明、
应用场景放语言内容 JSON。

这样开发者改参数只动一个 JSON；翻译只动语言 JSON；页面模板完全数据驱动。

### 3.2 产品线 JSON 形状

```jsonc
{
  "id": "y100",
  "order": 3,
  "slug": "y100-series",
  "series": "Y100 Series",
  "category": "rugged-tablet",
  "formFactor": "10.1-inch rugged tablet",
  "tags": ["10.1\"", "Android 16", "IP67"],
  "defaultVariant": "standard",
  "heroImage": "/images/products/y100/y100-standard-front.webp",
  "kpis": [
    { "label": "Display", "value": "10.1 in" },
    { "label": "Battery", "value": "10,000 mAh" },
    { "label": "Protection", "value": "IP67" }
  ],
  "comparison": {
    "formFactor": "10.1-inch tablet",
    "rfid": "UHF optional / dedicated RFID version",
    "os": "Android 16",
    "battery": "10,000 mAh",
    "protection": "IP67",
    "bestFor": "Inventory, field service, inspection, surveying"
  },
  "variantComparison": [
    {
      "label": "RFID",
      "values": {
        "standard": "Optional UHF module",
        "rfid": "Impinj E-series, up to 10 m",
        "rtk": "—",
        "fingerprint": "—",
        "5g": "Optional UHF module"
      }
    }
  ],
  "sharedSpecGroups": [
    {
      "id": "platform",
      "label": "Platform",
      "items": [
        { "label": "Display", "value": "10.1 in, 800 × 1280, 550 nits" },
        { "label": "Battery", "value": "10,000 mAh, 30 W PD" }
      ]
    }
  ],
  "variants": [
    {
      "id": "standard",
      "model": "Y100 Standard",
      "image": "/images/products/y100/y100-standard-front.webp",
      "gallery": [
        { "src": "/images/products/y100/y100-standard-front.webp", "view": "front" },
        { "src": "/images/products/y100/y100-standard-angle.webp", "view": "angle" }
      ],
      "keySpecs": [
        { "label": "Display", "value": "10.1 in · 800 × 1280 · 550 nits" },
        { "label": "OS", "value": "Android 16" },
        { "label": "Battery", "value": "10,000 mAh · 30 W PD" },
        { "label": "Protection", "value": "IP67 · 1.0 m drop" }
      ],
      "specGroups": [
        {
          "id": "system",
          "label": "System",
          "items": [
            { "label": "Processor", "value": "MT6789, 8-core up to 2.2 GHz" },
            { "label": "Memory / storage", "value": "8 GB + 128 GB; 8 GB + 256 GB optional" }
          ]
        }
      ],
      "options": [
        { "label": "Optional modules", "items": ["1D/2D scanner", "NFC", "UHF RFID", "Fingerprint"] }
      ]
    }
  ]
}
```

约束：

- `category` 只允许 `rfid-handheld` 或 `rugged-tablet`。
- `tags` 固定 3 条，用于首页产品线卡片。
- `kpis` 固定 3 条，用于总览页产品线区块。
- `comparison` 固定 6 个字段，用于总览页对比表；每条产品线只出现一行。
- `variantComparison` 用于详情页的版本对比表；每行 `values` 必须覆盖该
  产品线所有版本 id。单版本产品线设为 `[]`，多版本产品线至少 3 行。
- `variants[].id` 在产品线内唯一；`defaultVariant` 必须存在。
- `keySpecs` 固定 4 条，用于详情页顶部参数条。
- `sharedSpecGroups` 放所有版本共用的规格；`variants[].specGroups` 只放
  该版本特有或需要覆盖的规格。页面先渲染共享组，再渲染版本组；同一
  `id` 在共享组和版本组中不得重复，避免合并歧义。
- `options` 单独渲染，不混进规格表。
- `datasheet` 字段本版不启用；不发布公开 PDF。
- 不使用 `Confirm exact configuration` 这类占位值。未确认的事实不写入公开数据。

### 3.3 语言内容 JSON 形状

```jsonc
{
  "y100": {
    "name": "Y100 Series",
    "eyebrow": "10.1-inch rugged tablet platform",
    "tagline": "One platform. Five field configurations.",
    "summary": "A 10.1-inch Android rugged tablet platform built around ...",
    "overview": [
      "Paragraph one: platform positioning and shared engineering.",
      "Paragraph two: which field tasks the platform is designed for."
    ],
    "variants": {
      "standard": {
        "label": "Standard",
        "name": "Y100 Standard",
        "summary": "The base 10.1-inch Android 16 configuration ...",
        "highlights": ["...", "...", "..."],
        "features": [
          { "title": "Field-ready endurance", "body": "..." },
          { "title": "Modular data capture", "body": "..." }
        ],
        "applications": [
          { "label": "Warehouse operations", "solution": "logistics" },
          { "label": "Production and quality", "solution": "manufacturing" },
          { "label": "Retail and store operations", "solution": "retail" },
          { "label": "Field inspection", "solution": "field-service" }
        ]
      }
    }
  }
}
```

- `overview` 固定 2 段，用于详情页 Overview 区块。
- `features` 每版本 3–5 条；`applications` 固定 4 条。
- `applications[].solution` 只允许 `logistics` / `manufacturing` /
  `retail` / `field-service`，构建时校验，并由模板生成
  `/solutions/<solution>/` 链接。
- 中文文件键结构与英文完全一致，由 `npm run i18n:check` 校验。
- 页面文案（标题、CTA、标签、深色区块）继续放
  `src/i18n/dictionaries/{en,zh}.json`，不写进产品 JSON。

### 3.4 加载与校验

`src/data/products/index.ts` 暴露：

```ts
getProductFamilies(locale): ProductFamily[]
getProductFamily(locale, slug): ProductFamily | undefined
getCategoryLabel(locale, category): string
```

构建时校验（抛错即构建失败）：

- id / slug / variant id 唯一；`defaultVariant` 存在。
- `tags`、`kpis` 各 3 条；`comparison` 6 个字段齐全。
- `variantComparison` 每行的 `values` 覆盖全部版本 id；多版本产品线至少 3 行。
- 每个版本至少 4 条 keySpecs；共享规格组 + 版本规格组合计至少 2 组。
- 共享规格组与版本规格组的 `id` 不重复；每个组至少 1 条规格。
- 图片路径以 `/images/products/` 开头，文件在 `public/` 中存在。
- `applications[].solution` 必须属于四个已知行业页。
- 语言内容必须覆盖每个产品线和版本，不得有额外键；`overview` 必须 2 段。
- 禁止出现旧型号字符串（见第 8 节清理清单），检查范围包括 `src/` 全部源码
  和 `src/i18n/content/{en,zh}/solutions.json`。

同时新增 `tests/products.test.mjs`，覆盖加载、版本查询、默认版本和缺失键报错。

## 4. 页面设计

### 4.1 产品总览 `/products/`、`/zh/products/`

信息架构从“12 张卡片 + 任务选择器”改为“三条产品线 + 一条对比”。

1. **Hero**： eyebrow `PRODUCT RANGE`；H1 两行，强调“三条平台覆盖现场数据采集”；
   右侧用三张产品图组成的设备阵容（纯图片组合，不做 3D 渲染）。
2. **Series rail**：吸顶的 3 个产品线锚点 + `Compare`，移动端横向滚动。
3. **Choose by work**：3 张场景卡（批量盘库 / 近距离 RFID / 现场计算），
   每张指向一个产品线或版本，替代旧的 task-selector。
4. **三条产品线区块**：交替左右布局。每块包含：
   - 序号 01/02/03；
   - 产品大图（默认版本）；
   - 产品线名、定位语、摘要；
   - 3 个 KPI（来自 `kpis`）；
   - 版本标签（来自 `variants[].model` 或内容 `label`）；
   - `Explore <series>` 链接。
5. **Comparison table**：行=三条产品线，列=形态、RFID、系统、电池、防护、
   最适合的任务，全部来自各产品线的 `comparison` 字段，不在页面写死。
6. **Modules / quality / FAQ / CTA**：保留结构，文案改为围绕三条线；
   删除旧 comparison 行和旧 family 卡片。
7. **不再保留**：旧的 `Rugged PDA / RFID / Industrial Tablet` 筛选按钮。

### 4.2 产品详情 `/products/<slug>/`、`/zh/products/<slug>/`

1. **Breadcrumb + Hero**
   - 左：主图 + 缩略图（版本切换时整组替换）。
   - 右：产品线名、定位语、摘要、版本选择器、4 个 keySpecs、
     `Request a quote` / `Talk to sales`；不提供公开 PDF 下载，
     用 `Request the datasheet` 走询盘。
2. **Sticky jump nav**：Overview · Variants · Key features · Specifications ·
   Applications；滚动时高亮当前区块。
3. **Overview**：渲染内容 JSON 的 `overview` 两段，不重复规格。
4. **Variant selector**
   - 胶囊式 tab，显示 `label`；当前版本使用深色底。
   - 切换时更新：主图/缩略图、4 个 keySpecs、卖点、特性、规格表、应用场景。
   - URL 使用 hash 深链：`#variant-rfid`；刷新/分享后保持版本。
   - 键盘：左右方向键切换，`aria-selected`、`role=tablist/tab/tabpanel`。
   - 无 JS 时所有版本面板顺序展示，不隐藏内容。
5. **Variant comparison**（仅多版本产品线）：关键属性 × 版本对比表，
   当前版本列高亮；点击表头切换版本。
6. **Key features**：3–5 个图标卡片，两列/三列；不使用带文字的营销长图。
7. **Specifications**：先渲染 `sharedSpecGroups`，再渲染当前版本的
   `specGroups`；`options` 单独列出；底部 fine print：
   “Specifications are for the listed configuration and may change without notice.
   Confirm the approved datasheet before ordering.”
8. **Applications**：4 个场景卡，来自内容 JSON 的 `applications`，
   通过 `solution` 字段链到现有 `/solutions/logistics/`、
   `/solutions/manufacturing/`、`/solutions/retail/`、
   `/solutions/field-service/` 四个行业页。
9. **Related series**：另外两条产品线的卡片。
10. **CTA band**：沿用现有询盘 CTA。

单版本产品线（HT550）隐藏版本选择器和对比表，页面结构保持一致。

### 4.3 首页产品区

- 删除 12 张产品卡和旧筛选按钮。
- 改为 3 张产品线卡：大图、产品线名、3 个标签、`Explore` 链接。
- 区块标题改为“三条平台，覆盖现场数据采集”，链路指向 `/products/`。
- 首页不再承担产品对比，对比只在产品总览页出现。

### 4.4 导航与页脚

- Header 的 `Products` 链接不变：`/products/`。
- Footer 产品列改为：
  - HT540 Series → `/products/ht540-series/`
  - HT550 → `/products/ht550/`
  - Y100 Series → `/products/y100-series/`
  - All products → `/products/`
- 字典中旧键 `productsRuggedPda` / `productsRfid` / `productsTablets` 删除或替换；
  新增 `productsHt540` / `productsHt550` / `productsY100`。

## 5. 视觉方向

参考同类国际厂商的产品页结构（Zebra、Honeywell、Chainway、Getac、Urovo），
但沿用 TRAKNOVA 现有品牌资产：

- **色彩**：继续使用 `--navy #101c2d`、`--blue #2563eb`、`--orange #f59e0b`；
  产品页以白/浅灰为主，深色只用于 hero、对比条和 CTA。
- **字体**：Manrope 标题 + DM Sans 正文；参数值用 Manrope 600，微标签用
  10–11 px 大写、字距 `.12em`。
- **布局**：12 列栅格、8 px 间距基准；section 间距 80–96 px；
  产品图区域 1:1，浅灰渐变底，不加边框阴影堆叠。
- **信息密度**：每个产品线首屏只保留 4 个参数；完整规格放折叠区或下方表格。
- **组件语言**：1 px 细线、圆角 12–14 px、克制的 hover 提升；
  不使用彩色渐变卡片、玻璃拟态或大面积装饰图。
- **国际化细节**：英文标题避免全大写长句；数字与单位之间留空格；
  中文版行高和字距单独微调（沿用现有 `:lang(zh)` 规则）。
- **响应式**：
  - ≥1100 px：产品线左右交替、版本对比表完整显示；
  - 720–1099 px：产品线单列，对比表横向滚动；
  - <720 px：版本选择器横向滚动、sticky 底部询盘按钮、
    规格表改为标签/值两行式。

## 6. 图片处理

- 源文件来自 `产品素材/` 的主图目录，每版本选 2–3 张：
  正面、45°、细节/接口。
- 输出目录：
  ```text
  public/images/products/ht540/ht540-lf-front.webp
  public/images/products/ht540/ht540-hf-front.webp
  public/images/products/ht540/ht540-uhf-front.webp
  public/images/products/ht550/ht550-front.webp
  public/images/products/y100/y100-standard-front.webp
  public/images/products/y100/y100-rfid-front.webp
  public/images/products/y100/y100-rtk-front.webp
  public/images/products/y100/y100-fingerprint-front.webp
  public/images/products/y100/y100-5g-front.webp
  ```
- 统一处理：裁成 1:1，最长边 1200 px，WebP 质量 82，白底保留；
  移除素材中的 LQVIS logo 和残留文字（Y100 标准版白底图左上角有 logo）。
- 图片全部自托管，不使用外站 URL；删除旧 `public/images/products/product-placeholder.svg`
  引用。
- `alt` 由产品名 + 视图生成（如 `Y100 RFID — front view`），不把营销文案塞进 alt。
- 解决方案页继续使用现有 `device-*.svg` 剪影，不在本次替换范围内。

## 7. 本地化

- 英文、中文各维护一套 `products.json` 内容文件。
- 产品型号、规格标签、规格值保持英文；中文页面的规格表沿用英文，
  与现有 i18n 设计一致。
- 中文文案从英文素材翻译，保留技术名词（UHF、RFID、RTK、IP67、Android 等）。
- 页面级文案（hero、CTA、对比表列名、fine print）放字典文件，中英同步。
- `npm run i18n:check` 校验：产品线/版本键一致、无 HTML 标签、无旧 slug。

## 8. 旧产品清理

删除或替换：

- `src/data/products/base.ts`（旧 12 个型号）。
- `src/data/products/index.ts` 中旧类型、`CATEGORY_KEYS`、旧 loader。
- `src/i18n/content/{en,zh}/products.json` 中的 12 个旧 slug 文案。
- `src/views/ProductsIndexView.astro` 的旧 task selector、family cards、
  12 产品网格、旧 comparison 表。
- `src/views/ProductDetailView.astro` 的旧分类分支与“配置确认”占位逻辑。
- `src/views/HomeView.astro` 的产品筛选和 12 卡片。
- `src/components/ProductCard.astro`：改为产品线卡片，或替换为
  `ProductFamilyCard.astro`。
- `src/components/Footer.astro` 的旧分类锚点。
- 字典中的 `ruggedPda` / `industrialTablet` / `industrialTabletPlural` 等旧分类键
  （先确认其他页面无引用再删）。
- `scripts/check-i18n.mjs` 的 12 个 `EXPECTED_SLUGS`。
- `scripts/check-dist.mjs` 的旧产品页检查、旧 sentinel 文案。
- 旧产品图片和外部源图 URL。
- 根目录 `PRODUCT_CATALOG.csv`、`PRODUCT_DATA_REVIEW.md`：
  更新为指向新数据源的说明，或删除，避免与真实数据源冲突。

### 8.1 解决方案页的设备引用迁移

`solutions.json` 与 `SolutionDetailView.astro` 目前通过 `getProduct()` 解析
11 个旧 slug，并直接链接到 `/products/<old-slug>/`。旧产品删除后必须同步迁移，
否则行业页的设备卡片会消失或 404。

数据形状改为“产品线 + 可选版本”：

```jsonc
"devices": [
  { "slug": "ht540-series", "variant": "uhf" },
  { "slug": "ht550" },
  { "slug": "y100-series", "variant": "rfid" }
]
```

旧型号到新产品线的映射：

| 旧 slug | 新产品线 | 默认版本 | 说明 |
| --- | --- | --- | --- |
| `ht400-rugged-barcode-pda` | `ht540-series` | `uhf` | 条码 PDA 工作流由 HT540 + 可选扫描头承接 |
| `ht510-rugged-pda` | `ht540-series` | `uhf` | 手持数据采集 |
| `ht520-multifunction-pda` | `ht540-series` | `uhf` | 多功能手持 |
| `ht530-document-id-pda` | `y100-series` | `standard` | 大屏 + 可选模块承接证件/文档类流程 |
| `ht800-scan-print-pda` | `y100-series` | `standard` | 扫描为主；不再承诺打印能力 |
| `ht540-rfid-handheld` | `ht540-series` | `uhf` | 同系列 |
| `ht550-uhf-rfid-handheld` | `ht550` | `standard` | 同型号 |
| `y100-uhf-rfid-tablet` | `y100-series` | `rfid` | 同系列 RFID 版本 |
| `y100-rugged-android-tablet` | `y100-series` | `standard` | 同系列标准版 |
| `y70-rugged-tablet` | `y100-series` | `standard` | 无 7 英寸对应型号，升级到 10.1 英寸 |
| `a100-windows-rugged-tablet` | `y100-series` | `standard` | 不再提供 Windows 版本 |
| `t120a-windows-industrial-tablet` | `y100-series` | `5g` | 大屏工业工作流由 5G 版本承接 |

同时：

- `solutions.json` 中 `"HT400 · HT550 · HT800 · Y100 RFID"` 这类摘要字符串
  改为新名称（如 `HT540 Series · HT550 · Y100 Series`）。
- `SolutionDetailView.astro` 用 `getProductFamily()` 解析 slug；
  `SolutionDeviceCard.astro` 接收产品线 + 版本，显示版本名或产品线名。
- `SolutionDeviceCard` 的分类→剪影映射从旧三类改为
  `rfid-handheld → device-rfid.svg`、`rugged-tablet → device-tablet.svg`。
- 行业页的行业文案、场景步骤、部署规模等内容不改；只改设备引用和必要的
  型号文字。
- 构建校验的旧型号扫描范围包括 `src/i18n/content/{en,zh}/solutions.json`。

保留：

- 询盘弹窗、联系表单、OEM/ODM 页面。
- 解决方案页的行业内容、场景步骤和视觉结构；仅设备引用按 8.1 迁移。
- 产品详情页的 SEO `Product` JSON-LD，改为 `ProductGroup` + `hasVariant`，
  每个版本一个 `Product` 节点。

## 9. 构建、测试与验收

### 9.1 构建命令

```bash
npm run build        # Astro 构建；产品数据校验失败会中断
npm run test         # 产品数据加载与校验测试
npm run i18n:check   # 中英产品内容键一致、无旧 slug
npm run check:dist   # 3 个产品页存在、无旧产品页、链接带 base
```

### 9.2 验收标准

- `/products/` 只出现 HT540 Series、HT550、Y100 Series 三条线，无旧型号。
- `/products/ht540-series/`、`/products/ht550/`、`/products/y100-series/`
  三页可访问，中英文各一份。
- HT540 的 LF/HF/UHF、Y100 的 5 个版本可在页内切换；
  切换后主图、4 个 keySpecs、卖点、规格表、应用场景同步变化；
  `#variant-rfid` 深链刷新后仍选中对应版本。
- 页面源码中没有任何产品型号/参数/图片路径硬编码；全部来自 JSON。
- `grep -R "HT400\|HT510\|HT520\|HT530\|HT800\|Y70\|A100\|T120A" src`
  无结果，包括 `solutions.json` 和字典文件。
- 解决方案页的设备卡片显示新产品线/版本，链接指向新详情页且不 404。
- 产品图片全部本地 WebP，无 `lqycit.com` 外链，无 LQVIS 标识。
- 中文页产品区完整，语言切换停留在当前产品页。
- 移动端无横向溢出；版本 tab 可键盘操作；图片有 alt。
- `npm run build && npm run test && npm run i18n:check && npm run check:dist`
  全部通过。

## 10. 实施顺序

1. **数据**：从素材整理三个产品线 JSON、图片处理、类型与 loader、测试。
2. **页面**：产品线卡片、产品总览、产品详情（含版本切换脚本）、首页产品区。
3. **导航与文案**：字典、页脚、en/zh 产品内容、SEO/JSON-LD。
4. **清理**：删除旧数据、旧组件引用、旧图片、旧校验常量。
5. **验证**：构建、测试、i18n、dist 检查、桌面/移动截图检查。

## 11. 已做的判断（可供纠正）

- 三条产品线 = HT540 / HT550 / Y100，而不是按“PDA / RFID / 平板”重新分类。
- Y100 只纳入国际站版本：Standard / RFID / RTK / Fingerprint / 5G；
  国内身份证版、鸿蒙版不纳入。
- HT540 的 LF/HF/UHF 作为同一产品页的版本，而不是三张独立产品卡。
- HT550 作为单版本产品，但沿用同一套数据结构，后续加版本无需改模板。
- 产品规格保持英文；仅营销文案中英双语。
- 规格冲突按 2.4 的规则处理：规格表优先、营销稿只补充、冲突取保守值、
  未确认字段不发布。
- 认证只在素材明确列出时展示，并写“以最终配置为准、证书可应要求提供”；
  不写证书编号。
- v1 不发布公开 datasheet PDF，统一走询盘索取。
- 多版本产品线使用家族级 `sharedSpecGroups` + 版本级 `specGroups`，
  避免共享参数在多个版本重复。
- 解决方案页的旧设备引用按 8.1 映射到新产品线/版本；行业文案和视觉不改。
- 旧产品 URL 不保留重定向；如上线后已有外链，需要另加静态跳转页。
