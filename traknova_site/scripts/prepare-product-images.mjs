import { execFileSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const sourceRoot = process.env.PRODUCT_ASSETS ?? join(process.cwd(), '..', '产品素材');
const outputRoot = join(process.cwd(), 'public', 'images', 'products');

const MAPPINGS = [
  {
    output: 'ht540/ht540-lf-front.webp',
    source: 'HT540/7-Android LF RFID Reader -HT540-LF/主图-7-Android LF RFID Reader -HT540-LF/主图1.jpg'
  },
  {
    output: 'ht540/ht540-lf-angle.webp',
    source: 'HT540/7-Android LF RFID Reader -HT540-LF/主图-7-Android LF RFID Reader -HT540-LF/主图2.jpg'
  },
  {
    output: 'ht540/ht540-hf-front.webp',
    source: 'HT540/8-Android HF RFID Reader -HT540-HF/主图-8-Android HF RFID Reader -HT540-HF/主图1.jpg'
  },
  {
    output: 'ht540/ht540-hf-angle.webp',
    source: 'HT540/8-Android HF RFID Reader -HT540-HF/主图-8-Android HF RFID Reader -HT540-HF/主图2.jpg'
  },
  {
    output: 'ht540/ht540-uhf-front.webp',
    source: 'HT540/9-uhf rfid pda-HT540/主图-9-uhf rfid pda-HT540/主图1.jpg'
  },
  {
    output: 'ht540/ht540-uhf-angle.webp',
    source: 'HT540/9-uhf rfid pda-HT540/主图-9-uhf rfid pda-HT540/主图2.jpg'
  },
  {
    output: 'ht550/ht550-front.webp',
    source: 'HT550/HT550-图片/主图1.jpg'
  },
  {
    output: 'ht550/ht550-angle.webp',
    source: 'HT550/HT550-图片/主图2.jpg'
  },
  {
    output: 'y100/y100-standard-front.webp',
    source: 'Y100 rugged tablet/Y100-平板-标准版-图片/Y100-主图-英/Y100主图白底3.jpg',
    cropTop: 80
  },
  {
    output: 'y100/y100-standard-angle.webp',
    source: 'Y100 rugged tablet/Y100-平板-标准版-图片/Y100-主图-英/Y100主图白底4.jpg',
    cropTop: 80
  },
  {
    output: 'y100/y100-rfid-front.webp',
    source: 'Y100 rugged tablet/Y100-Rugged RFID tablet/主图-11- rfid tablet-Y100-UHF/主图1.jpg'
  },
  {
    output: 'y100/y100-rfid-angle.webp',
    source: 'Y100 rugged tablet/Y100-Rugged RFID tablet/主图-11- rfid tablet-Y100-UHF/主图2.jpg'
  },
  {
    output: 'y100/y100-rtk-front.webp',
    source: 'Y100 rugged tablet/Y100-Rugged GNSS RTK Tablet/主图-20-  rtk tablet  -Y100-RTK/主图1.jpg'
  },
  {
    output: 'y100/y100-rtk-angle.webp',
    source: 'Y100 rugged tablet/Y100-Rugged GNSS RTK Tablet/主图-20-  rtk tablet  -Y100-RTK/主图3.jpg'
  },
  {
    output: 'y100/y100-fingerprint-front.webp',
    source: 'Y100 rugged tablet/Y100 Fingerprint Tablet/Y100-指纹平板-图片/Y100-指纹平板-主图-英/DSC01771_3.jpg'
  },
  {
    output: 'y100/y100-fingerprint-angle.webp',
    source: 'Y100 rugged tablet/Y100 Fingerprint Tablet/Y100-指纹平板-图片/Y100-指纹平板-主图-英/DSC01770_5.jpg'
  },
  {
    output: 'y100/y100-5g-front.webp',
    source: 'Y100 rugged tablet/Y100-5G rugged tablet/主图15- 5G rugged tablet -Y100-5G/主图1.jpg'
  },
  {
    output: 'y100/y100-5g-angle.webp',
    source: 'Y100 rugged tablet/Y100-5G rugged tablet/主图15- 5G rugged tablet -Y100-5G/主图2.jpg'
  },
  {
    output: 'ht600/ht600-front.webp',
    source: 'HT600 - 简化版/HT600-主图-英/HT600主图120260907.jpg',
    cropLeft: 210,
    cropTop: 70
  },
  {
    output: 'ht600/ht600-angle.webp',
    source: 'HT600 - 简化版/HT600-主图-英/DSC02084.jpg',
    cropTop: 330
  },
  {
    output: 'ht600/ht600-back.webp',
    source: 'HT600 - 简化版/HT600-主图-英/DSC02126.jpg',
    cropTop: 330
  }
];

const filter = process.env.PRODUCT_IMAGE_FILTER;
const mappings = filter
  ? MAPPINGS.filter((mapping) => mapping.output.startsWith(`${filter}/`))
  : MAPPINGS;

for (const mapping of mappings) {
  const sourcePath = join(sourceRoot, mapping.source);
  const outputPath = join(outputRoot, mapping.output);
  await mkdir(dirname(outputPath), { recursive: true });

  let image = sharp(sourcePath);
  if (mapping.cropLeft || mapping.cropTop) {
    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error(`Cannot read dimensions for ${sourcePath}`);
    }
    const left = mapping.cropLeft ?? 0;
    const top = mapping.cropTop ?? 0;
    image = image.extract({
      left,
      top,
      width: metadata.width - left,
      height: metadata.height - top
    });
  }

  await image
    .resize(1200, 1200, { fit: 'contain', background: '#ffffff' })
    .flatten({ background: '#ffffff' })
    .webp({ quality: 82 })
    .toFile(outputPath);

  console.log(`wrote ${mapping.output}`);
}

execFileSync(
  'python3',
  [
    join(process.cwd(), 'scripts/remove-product-backgrounds.py'),
    ...(filter ? [filter] : []),
    ...(process.env.PRODUCT_BG_THRESHOLD ? [process.env.PRODUCT_BG_THRESHOLD] : [])
  ],
  { stdio: 'inherit' }
);
