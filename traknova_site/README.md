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
