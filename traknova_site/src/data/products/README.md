# 产品数据维护

产品页面从本目录的 JSON 读取技术事实，从 `src/i18n/content/{en,zh}/products.json`
读取营销文案。页面模板不写死型号、规格或图片路径。

## 文件

| 文件 | 内容 |
| --- | --- |
| `rfid-handhelds.json` | RFID Handheld Series，版本 `lf` / `hf` / `uhf` / `ht550`，默认 `uhf` |
| `ht600.json` | HT600，单版本 `standard`，条码手持终端 |
| `y100.json` | Y100 Series，版本 `standard` / `rfid` / `rtk` / `fingerprint` / `5g` |
| `types.ts` | 数据类型 |
| `validate.ts` | 构建期校验 |
| `catalog.ts` | 读取、合并、查询 API |

## 新增产品线

1. 复制一个现有 JSON，修改 `id`、`slug`、`order`、`series`、`category`。
2. 在 `src/i18n/content/en/products.json` 和 `zh/products.json` 增加同名顶层键。
3. 在 `catalog.ts` 的 `catalogFiles` 增加文件名。
4. 运行 `npm test && npm run build`。

> `legacy/` 目录保留合并前的 HT540 / HT550 原始数据，仅供追溯；不要加入 `catalogFiles`。

## 新增版本

1. 在对应产品线的 `variants[]` 增加版本对象。
2. 在 `variantComparison` 每一行的 `values` 增加该版本的显示值；无能力写 `—`。
3. 在 en/zh 的 `products.json` 的 `variants.<id>` 增加文案（label、name、summary、
   3 条 highlights、3–5 条 features、4 个 applications）。
4. 图片放入 `public/images/products/<line>/`，并在 JSON 写 `/images/products/...` 路径。

## 规则

- 规格标签和规格值保持英文；营销文案中英双语。
- 不要写 `Confirm exact configuration` 等占位值；未确认的字段不要发布。
- 共享规格放 `sharedSpecGroups`，版本特有规格放 `specGroups`，同一 `id` 不得重复。
- 每个版本 4 条 `keySpecs`；每个产品线 3 条 `tags` 和 3 条 `kpis`。
- 每个版本至少 2 张 gallery 图片。
- 认证只写素材明确列出的范围，并保留“per configuration; certificates available on request”。

## 图片

源素材通过 `scripts/prepare-product-images.mjs` 处理为 WebP，并调用
`scripts/remove-product-backgrounds.py` 去除纯色背景、裁切透明边距。

```bash
python3 scripts/remove-product-backgrounds.py   # 仅重新处理已有 WebP
python3 scripts/remove-product-backgrounds.py ht600 160  # 仅处理 ht600，使用更高阈值
node scripts/prepare-product-images.mjs         # 从 产品素材/ 重新生成
PRODUCT_IMAGE_FILTER=ht600 PRODUCT_BG_THRESHOLD=160 node scripts/prepare-product-images.mjs
```

HT600 的源图与裁切：

- 正面 `HT600 - 简化版/HT600-主图-英/HT600主图120260907.jpg`：`cropLeft: 210` + `cropTop: 70`，去除左上角 LQVIS logo。
- 角度 `DSC02084.jpg`、背面 `DSC02126.jpg`：`cropTop: 330`，去除顶部色带与 logo。
- `产品素材/首页/HT600-抠图.png` 是打印版 PDA，不用于标准 HT600。

重新生成需要 `sharp`（npm devDependency）和 Python Pillow。
