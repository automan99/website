# TRAKNOVA 网站国际化（i18n）设计

日期：2026-11-05
状态：待确认

## 1. 目标与背景

TRAKNOVA 官网目前是纯英文 Astro 静态站，所有文案直接写在页面和数据文件里。
业务目标市场为欧美、东南亚、印度和非洲。需要让不同市场的访问者用自己的语言浏览
营销内容，同时保持站点静态、可维护、可逐步扩展。

设计上支持 8 种语言：

| 代码 | 语言 | 说明 |
| --- | --- | --- |
| `en` | English | 默认语言，保持在根路径 |
| `zh` | 简体中文 | 首版实现 |
| `hi` | हिन्दी（印地语） | 后续启用 |
| `es` | Español | 后续启用 |
| `ru` | Русский | 后续启用 |
| `de` | Deutsch | 后续启用 |
| `fr` | Français | 后续启用 |
| `pt` | Português | 后续启用 |

首版只构建 `en` 和 `zh`。其余语言在配置中预留，内容确定后通过“添加字典 + 启用”
两步上线，不需要改页面模板或路由结构。

## 2. 目标 / 非目标

### 目标

- 英文保持现有 URL（`/`、`/products/`、`/products/<slug>/` 等），不破坏已有链接。
- 中文使用语言前缀（`/zh/`、`/zh/products/` 等），每种语言有独立可索引的页面。
- 页头提供语言切换器，切换后停留在当前页面对应的语言版本。
- 所有可翻译文案从页面中抽离，集中到按语言组织的字典/内容文件。
- 首页、产品总览、产品详情页文案、解决方案全文、OEM/ODM、关于、联系、页头页脚、
  询盘表单全部中英双语。
- SEO：正确的 `lang`、本地化 title/description、canonical、hreflang、sitemap 收录。
- 不引入第三方 i18n 依赖，继续使用 Astro 静态生成。

### 非目标

- 首版不启用印地语、西班牙语、俄语、德语、法语、葡萄牙语。
- 不翻译隐私政策和服务条款正文（法律文本以英文为准），但提供带本地语言提示的
  本地化路由，保证导航和语言切换一致。
- 不翻译产品型号名、参数表和参数值（`specs` 保留英文）。
- 不做浏览器语言自动跳转、不做 IP/地区定向。
- 不做 RTL 布局（8 种语言均为 LTR）。
- 不做本地化图片、货币、单位换算。
- 不接入翻译管理平台。

### 反目标（视为失败）

- 英文旧链接 404 或指向错误语言。
- 语言切换后跳到首页而不是当前页面。
- 页面里仍残留硬编码英文营销文案，导致中英混合。
- 为了 i18n 复制粘贴 8 套页面源码，后续改一处要改八处。
- 未翻译内容没有任何提示（例如中文页面的英文参数表没有说明）。

## 3. 语言与路由

### 3.1 配置

新增 `src/i18n/config.ts`：

```ts
export const LOCALES = ['en', 'zh', 'hi', 'es', 'ru', 'de', 'fr', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

// 首版只启用中英；后续上线其他语言时在此追加。
export const ENABLED_LOCALES: readonly Locale[] = ['en', 'zh'];

export const LOCALE_META: Record<Locale, {
  nativeName: string;   // 语言切换器显示的名字
  htmlLang: string;     // <html lang="...">
  ogLocale: string;     // og:locale
  pathPrefix: string;   // en -> ''，zh -> '/zh'
}> = { ... };
```

- `LOCALES` 是完整设计范围；`ENABLED_LOCALES` 决定实际生成和展示的语言。
- 新语言上线步骤：新增 `LOCALE_META` 条目 → 新增字典与内容 JSON → 加入
  `ENABLED_LOCALES`。
- 所有语言均为 `ltr`。

### 3.2 URL 规则

| 页面 | 英文 | 中文 |
| --- | --- | --- |
| 首页 | `/` | `/zh/` |
| 关于 | `/about/` | `/zh/about/` |
| 联系 | `/contact/` | `/zh/contact/` |
| OEM / ODM | `/oem-odm/` | `/zh/oem-odm/` |
| 产品总览 | `/products/` | `/zh/products/` |
| 产品详情 | `/products/<slug>/` | `/zh/products/<slug>/` |
| 解决方案 | `/solutions/` | `/zh/solutions/` |
| 隐私政策 | `/privacy/` | `/zh/privacy/`（英文正文 + 中文提示） |
| 服务条款 | `/terms/` | `/zh/terms/`（英文正文 + 中文提示） |

- 产品 slug 在所有语言中保持一致（基于型号，如 `ht400-rugged-barcode-pda`）。
- 页面内锚点 id 在所有语言中保持一致（如 `#logistics`），保证切换语言时锚点可用。
- 带 `/website` base 的部署路径继续生效：所有站内链接通过统一的
  `localizedPath(locale, path)` 生成，静态资源继续使用 `withBase()`。

### 3.3 实现方式

- 页面模板只写一份，放在 `src/views/`（如 `HomeView.astro`、`ProductsView.astro`），
  接收 `locale` prop。
- 现有 `src/pages/*.astro` 改为薄封装：英文路由渲染 `locale="en"`。
- 新增 `src/pages/[lang]/...` 动态路由，`getStaticPaths()` 只为
  `ENABLED_LOCALES` 中非默认语言生成页面。
- Astro 静态路由优先于动态路由，英文路由不会和 `[lang]` 冲突。
- 404 页面保持英文（GitHub Pages 只使用根级 `404.html`）。

## 4. 文案组织

### 4.1 页面文案：JSON 字典

```
src/i18n/
  config.ts
  dictionaries/
    en.json
    zh.json
  content/
    en/
      products.json
      solutions.json
    zh/
      products.json
      solutions.json
  types.ts
  index.ts        // 加载与类型转换
```

- JSON 便于非开发者编辑和后续交给译者；Astro/Vite 原生支持 JSON import。
- `en.json` 是唯一事实来源。`types.ts` 定义 `Dictionary` 类型，
  `index.ts` 用 `as Dictionary` 加载并导出 `getDictionary(locale)`。
- 字典键按页面/区域分组：`site`、`common`、`header`、`footer`、`home`、
  `products`、`productDetail`、`solutions`、`about`、`oem`、`contact`、
  `inquiry`、`legal`、`notFound`。
- 所有面向用户的可翻译字符串必须来自字典或本地化内容文件；模板中只允许保留
  品牌名、型号、数字、符号和语言无关的结构标记。

### 4.2 结构化内容

产品：

- `src/data/products/base.ts`：结构字段（`slug`、`model`、`category` key、
  `image`、`imageStatus`、`sourceUrl`、英文 `specs`）。
- `src/i18n/content/<locale>/products.json`：按 slug 提供
  `name`、`summary`、`highlights`。
- `src/data/products/index.ts`：`getProducts(locale)` 合并结构数据与本地化文案。
- 产品名称可翻译，但型号代码（HT400、Y100 等）保持不变。
- `specs` 的键和值保持英文；产品详情页在非英文语言下显示一条本地化提示：
  “规格参数以英文版本为准”。

解决方案：

- 翻译内容同样使用 JSON：`src/i18n/content/<locale>/solutions.json`，
  与页面字典保持同一种编辑方式。
- 类型和加载逻辑放在 `src/data/solutions/index.ts`：导出
  `getSolutions(locale)`，把 JSON 转为 `SolutionLayer[]`、`Industry[]` 等类型。
- 行业 `id`、场景顺序、设备 `slug` 在所有语言中一致。
- 场景中的设备引用**只存 `slug`**，显示名称由
  `getProducts(locale)` 解析，避免在解决方案内容里重复维护产品译名。
- `solutionLayers`、`industries`、`specializedWorkflows`、`solutionMatrix`、
  `deploymentSteps` 全部翻译（属于营销内容）。

### 4.4 富文本与内联标记

- 字典和内容 JSON 中只允许**纯文本**，不写 HTML。
- 换行、强调和链接由模板负责：
  - `<br />` 拆成多个标题/段落键（如 `hero.titleLine1`、`hero.titleLine2`）。
  - `<em>` 由模板决定强调哪一段，字典提供对应的纯文本片段。
  - 内联链接拆成“前缀 + 链接文字 + 后缀”多个键，模板负责拼接 `<a>`。
    例如询盘表单的隐私提示：
    `inquiry.privacyPrefix`、`inquiry.privacyLinkLabel`、
    `inquiry.privacySuffix`。
- 这样译者不需要接触 HTML，也避免 `set:html` 带来的注入风险。

### 4.5 法律页面

隐私政策和服务条款正文保留英文，处理方式：

- 英文正文放在独立的英文模块（`src/data/legal/en.ts`），两种语言路由共用。
- `/zh/privacy/`、`/zh/terms/` 本地化的部分：`<title>`、meta description、
  页面 eyebrow、H1、导语、更新日期标签和页面顶部提示。
- 提示文案示例：“本页为法律条款的英文正式版本；如有歧义，以英文版本为准。”
- 英文正文容器标记 `lang="en"`，便于屏幕阅读器和浏览器正确处理语言切换。
- 正文不进入 `en.json` / `zh.json`，因此 `i18n:check` 的键一致性校验不受影响。

### 4.6 翻译基线

- 中文按当前英文稿翻译。`CONTENT_TODO.md` 中仍待核实的英文信息（公司资料、
  法律事实、产品参数说明）不在首版翻译范围内。
- 英文营销文案后续修改时，必须同步更新中文译文；这是已知的维护成本，
  在 README 的维护说明中写明。

### 4.3 站点元信息

- `site` 字典包含每种语言的 `tagline`、`description`、品牌副标题。
- 邮箱、WhatsApp、Facebook、Formspree 端点等与语言无关，继续放在
  `src/data/site.ts`。
- Organization JSON-LD 的 `availableLanguage` 使用已启用语言。

## 5. 组件改造

### BaseLayout

- 新增 `locale` prop。
- `<html lang={LOCALE_META[locale].htmlLang}>`。
- 使用本地化 title/description，并生成：
  - 当前页 canonical（含语言前缀）
  - 每个已启用语言的 `<link rel="alternate" hreflang="...">`
  - `x-default` 指向英文版本
  - `og:locale` 与 `og:locale:alternate`
- 页面级 title/description 通过字典传入。

### Header

- 导航、CTA、utility 文案来自字典。
- 新增语言切换器，放在 utility 栏，移动端在移动导航内同时提供。
- 切换器只显示 `ENABLED_LOCALES`，使用各语言母语名称。
- 链接指向当前页面的对应语言版本；客户端脚本把 `location.hash` 附加到切换链接，
  以保留解决方案页锚点。
- 语言选择写入 `localStorage`，但**不做自动跳转**。

### Footer

- 分组标题、链接文案、说明文字、版权文字来自字典。
- 非英文语言下，隐私/条款链接指向本地化路由。

### InquiryDialog

- 标题、说明、所有字段标签、下拉选项、提示、提交按钮来自字典。
- 新增隐藏字段 `_language`，值为当前 locale，便于销售团队判断来源语言。
- 选项的 `value` 保持英文稳定值（便于 Formspree 统计），显示文本本地化。

### ProductCard

- 分类、简介、链接文案本地化。
- 产品名来自本地化产品数据。

### 产品筛选器

- 筛选按钮的显示文本本地化；`data-filter` 仍使用稳定英文分类值
  （`all` / `Rugged PDA` / `RFID` / `Industrial Tablet`），避免改脚本逻辑。

## 6. 样式

- 现有字体 DM Sans / Manrope 不含中文字形，中文会回退到系统字体。
  在 `enterprise.css` 为 `:lang(zh)` 增加中文字体栈：
  `"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`。
- 不加载大型 CJK WebFont，避免拖慢首屏。
- 新增语言切换器样式，沿用现有 utility/导航视觉风格。
- 中文标题长度可能不同，检查首页 hero、按钮、导航在桌面和移动端的换行与溢出。

## 7. SEO

- 每个语言版本页面有独立 title/description。
- hreflang 只在已启用语言之间互指；不要为未生成的语言输出 hreflang。
- `@astrojs/sitemap` 配置 i18n 时只传入已启用语言；新增语言时同步更新。
- canonical 指向自身语言页面。
- 英文根路径不变，保留既有搜索引擎收录。

## 8. 维护与校验

- 新增 `npm run i18n:check`：用 Node 脚本递归比较 `en.json` 与所有已启用语言
  字典的键集合，缺少或多出键时以非零状态退出并列出路径。
- 同样校验 `<locale>/products.json` 是否覆盖所有产品 slug，
  `<locale>/solutions.json` 是否覆盖所有行业/场景。
- README 增加“如何新增一种语言”的步骤说明。
- 翻译稿由实现者生成；印地语、俄语、德语、法语、葡萄牙语上线前必须由母语者复核。

## 9. 实施顺序（概要）

1. 建立 i18n 配置、类型、加载器和字典骨架；把英文文案迁入 `en.json`。
2. 将页面拆为 `src/views/` 模板，英文路由改为薄封装，确认现有功能与 URL 不变。
3. 建立中文字典与中文内容，加入 `/zh/` 路由。
4. 改造 BaseLayout、Header、Footer、InquiryDialog、ProductCard 支持 locale。
5. 添加语言切换器、hreflang、sitemap 配置和 CJK 字体栈。
6. 添加 `i18n:check` 脚本和 README 说明。
7. 构建并用浏览器逐页验证中英文版本、语言切换、锚点和表单展示。

## 10. 验收标准

- `npm run build` 成功，输出包含完整英文页面和 `/zh/` 页面。
- 英文既有路径全部保持可访问；中文页面无 404。
- 中文页面除型号、参数表和法律正文外，不出现硬编码英文营销文案。
- 页头语言切换器在中英文页面都可用，切换到当前页面的对应版本并保留锚点。
- 每个页面输出正确的 `lang`、canonical、hreflang；未启用语言不出现。
- 询盘表单中英文均显示本地化标签，并提交 `_language` 字段。
- `npm run i18n:check` 通过。
- 移动端导航和语言切换器布局正常。
- 未来加语言只需改配置、加 JSON、加入启用列表，无需改模板。

## 11. 留给实现者的决定

- 语言切换器的具体控件形态（下拉菜单 vs 展开列表）在符合现有视觉风格的前提下
  由实现者决定。
- 字典键的具体命名与分组细节由实现者决定，只要覆盖全部页面且结构一致。
- 中文产品名的具体译法、术语统一（如 “Rugged PDA”“Industrial Tablet”）
  由实现者在翻译时确定，并在字典中保持一致；建议建立术语表放在 README。
- 是否在中文页面为英文参数表增加视觉标识（如“EN”徽标）由实现者决定。
