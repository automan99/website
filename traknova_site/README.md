# TRAKNOVA 全球官网
基于 Astro 的静态网站模板，用于部署到 GitHub Pages
## 1. 环境要求
- Node.js 20.3 及以上版本（推荐当前长期支持版 LTS）
- Git 工具以及 GitHub 账号

## 2. 本地运行
```bash
npm install
npm run dev
```

## 3. 修改品牌与联系信息配置
编辑文件 `src/data/site.ts`：
- 邮箱地址
- WhatsApp 号码（仅填写国际区号+数字）
- Facebook 主页链接
- Formspree 表单接口地址

## 4. 产品目录
当前产品目录分为三大类：加固型手持PDA、RFID设备、工业平板。
包含型号：HT400、HT510 系列、HT520、HT530、HT800、HT540、HT550、Y100 RFID、Y100 加固平板、Y70、A100、T120A。

编辑文件 `src/data/products.ts`。每个产品字段包含：
- 路由别名（slug）
- 产品名称
- 分类
- 型号
- 简介
- 图片路径
- 核心亮点
- 参数规格

将审核通过的产品图放到 `public/images/products/` 目录，并更新对应的 `image` 路径。部分预览卡片目前调用的是国内产品目录线上图片地址；上线前需要替换为本地存放的高清原图。数据源链接保留在配置中，供内部核对使用。

推荐产品图片命名规则：
`型号-front.webp`（正面）、`型号-back.webp`（背面）、`型号-side.webp`（侧面）、`型号-in-use.webp`（使用场景图）

## 5. 对接咨询表单
1. 在 Formspree 创建表单
2. 在 `src/data/site.ts` 填入 `formspreeEndpoint` 接口地址
3. 提交一条测试咨询，确认邮件可以正常收到

> 静态网站本身不会存储表单提交数据

## 6. GitHub Pages 部署
仓库根目录是 `website`，Astro 项目位于子目录 `traknova_site/`。部署工作流放在仓库根目录的 `.github/workflows/deploy.yml`（GitHub Actions 只读取仓库根目录下的工作流）。

1. 确认仓库为 **public**（免费账号的私有仓库不支持 Pages）
2. 将代码推送到 `main` 分支
3. 首次部署前，在 GitHub 后台：设置（Settings）→ Pages → 构建与部署（Build and deployment）→ 部署源选择：**GitHub Actions**
4. 之后每次推送到 `main` 都会自动构建并发布，也可以在 Actions 页面手动触发（workflow_dispatch）
5. 默认发布地址：`https://automan99.github.io/website/`
   - `astro.config.mjs` 已配置 `site: 'https://automan99.github.io'` 和 `base: '/website'`
   - 站内链接通过 `src/utils/paths.ts` 的 `withBase()` 自动加上 `/website` 前缀

如果使用独立自定义域名：
1. 将 `astro.config.mjs` 中的 `site` 改为 `https://你的域名.com`，并删除 `base` 配置
2. 在 `public/` 下添加 `CNAME` 文件，内容为你的域名
3. 在 GitHub Pages 设置中绑定域名，并按提示配置 DNS 解析记录

如果仓库名不是 `website`，同步修改 `astro.config.mjs` 中的 `site` 和 `base` 即可。

## 7. 上线核对清单（重点）
- 把示例型号名称、所有标注「待确认（To be confirmed）」的参数，替换为产品手册上的准确数值
- 占位产品图全部替换为审核定稿的产品实拍图
- 邮箱、WhatsApp、Facebook 占位信息替换为真实信息
- 对接 Formspree 表单并完成测试
- 公司地址、工厂介绍、资质证书、保修与售后政策，信息核实无误后再添加
- 如果开启统计/追踪脚本，必须补充隐私政策、Cookie与数据采集声明
- 上线前测试移动端适配、全部链接、咨询提交流程、页面元信息

## 8. 国际化（i18n）
当前启用语言：**English（默认，根路径）** 和 **简体中文（`/zh/`）**。
架构预留 8 种语言：`en`、`zh`、`hi`、`es`、`ru`、`de`、`fr`、`pt`。

### 文件结构
- `src/i18n/config.ts`：语言列表、默认语言、已启用语言、语言元信息
- `src/i18n/dictionaries/en.json`、`zh.json`：页面文案（纯文本，禁止 HTML）
- `src/i18n/content/<locale>/products.json`：产品名称、简介、亮点
- `src/i18n/content/<locale>/solutions.json`：行业解决方案内容
- `src/views/`：只写一份的页面模板，通过 `locale` prop 渲染
- `src/pages/`：英文根路由；`src/pages/[lang]/`：其他语言的本地化路由

### 新增一种语言
1. 在 `src/i18n/config.ts` 的 `LOCALE_META` 增加对应条目（母语名称、`htmlLang`、`ogLocale`、路径前缀）。
2. 复制 `src/i18n/dictionaries/en.json` 为 `<locale>.json`，逐键翻译，不增不减。
3. 新建 `src/i18n/content/<locale>/products.json` 和 `solutions.json`，结构镜像英文文件。
4. 在以下加载器中注册导入：
   - `src/i18n/index.ts`
   - `src/data/products/index.ts`
   - `src/data/solutions/index.ts`
5. 把语言加入 `ENABLED_LOCALES`。
6. 在 `astro.config.mjs` 的 sitemap `i18n.locales` 中追加对应的语言标签。
7. 运行校验：
   ```bash
   npm run i18n:check
   npm run build
   npm run check:dist
   ```

### 翻译约定
- 字典和内容文件只写纯文本；换行、强调和链接由 Astro 模板负责组合。
- 产品型号（HT400、Y100 等）、参数表键值、法律条款正文保持英文。
- 英文营销文案修改后，必须同步更新中文译文。
- 中文页面中的参数表会显示“规格参数以英文版本为准”。

常用术语统一如下：

| English | 中文 |
| --- | --- |
| Rugged PDA | 加固型 PDA |
| Industrial Tablet | 工业平板 |
| Warehouse & Logistics | 仓储与物流 |
| Manufacturing | 制造 |
| Retail & Commerce | 零售与商业 |
| Field Service & Asset Tracking | 现场服务与资产追踪 |
| barcode | 条码 |
| UHF RFID | UHF RFID |
| workflow | 工作流程 |
| capture | 采集 |
| deployment / rollout | 部署 / 上线 |
| datasheet | 数据手册 |
| inquiry | 询盘 |
| private label | 贴牌 |
| configured product | 定制配置产品 |
| pilot | 试点 |
| spare parts | 备件 |

### 校验命令
- `npm run i18n:check`：检查所有语言字典键结构、产品/解决方案内容覆盖，并禁止 HTML 标签
- `npm run check:dist`：构建后检查 `lang`、hreflang、`/website` 链接前缀、中文页面翻译完整性、
  法律页英文正文标注和未启用语言是否误生成

## 9. 付费广告、Cookie 同意与转化追踪（新增）

### 9.1 开启 Google Ads 标签
编辑 `src/data/site.ts`：

- `googleAds.tagId`：Google Ads 标签 ID，例如 `AW-1234567890`。为空时不加载任何 Google 标签。
- `googleAds.conversionLabel`：Google Ads 转化操作的标签，例如 `AbC-D_efGhIjKlMn`。为空时不发送转化事件。
- `consent.enabled`：是否显示 Cookie 同意横幅和页脚「Cookie 设置」入口，默认 `true`。

填入后：

1. 页面头部会先设置 Consent Mode v2 默认值（默认 denied），再加载 Google tag。
2. 用户点击「全部接受」后，`ad_storage`、`ad_user_data`、`ad_personalization`、`analytics_storage` 更新为 granted；拒绝则保持 denied。
3. 同意状态保存在 `localStorage` 的 `traknova-consent-v1`，页脚可随时重新打开设置。
4. `/thank-you/` 页面会在已同意广告衡量的情况下发送 `conversion` 事件；同一会话只发一次。

> 注意：这是轻量级第一方 CMP + Consent Mode v2。投放 EEA/UK 前建议让法务复核；如果 Google 或合作方要求 Google 认证 CMP，可替换为 Cookiebot、Usercentrics 等，并保持同样的 consent 更新逻辑。

### 9.2 表单跳转
`InquiryForm.astro` 和 `InquiryDialog.astro` 已给 Formspree 表单增加隐藏字段 `_next`，提交成功后跳转到 `/thank-you/`（中文为 `/zh/thank-you/`）。上线前请用真实 Formspree endpoint 提交一次，确认跳转和邮件都正常。

### 9.3 字体
DM Sans 和 Manrope 已从 Google Fonts 改为自托管，文件在 `public/fonts/`，不再请求 `fonts.googleapis.com`。如果以后更换字体，更新 `public/fonts/fonts.css` 即可。

### 9.4 验证命令
```bash
npm run i18n:check
npm test            # 包含 consent 逻辑测试
npm run build
npm run check:dist  # 检查 _next、thank-you noindex、sitemap 排除
```

## 当前项目状态
这是一份扩展开发版本，已录入选定产品线，部分参数取自原始资料。
不少产品目前还是占位数据，因为爬取的国内产品页面没有公开完整的型号专属参数。**发布前所有参数、频段、认证、防护等级、选配项，都必须和官方产品手册二次核对。**
其中 Y100 RFID 原始页面存在 IP67 / IP68 描述冲突；HT550 的防护说明也需要再次确认。
本项目已在当前环境完成生产构建测试（`npm run build`），但仍需在发布前按要求核对产品参数、图片与联系方式。

---
### 术语备注（方便你技术沟通）
- Rugged PDA：加固手持终端 / 工业PDA
- Industrial Tablet：工业平板
- Formspree：第三方表单托管服务（静态站常用，用来收表单邮件）
- slug：页面路由标识
- Astro：前端静态站点框架
- GitHub Pages：Github 静态网页托管服务
- LTS：Node.js 长期支持版本
