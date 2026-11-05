export type ProductCategory = 'Rugged PDA' | 'RFID' | 'Industrial Tablet';

export type ProductBase = {
  slug: string;
  category: ProductCategory;
  model: string;
  image: string;
  imageStatus: 'official-source-preview' | 'placeholder';
  sourceUrl: string;
  specs: Record<string, string>;
};

const confirm = 'Confirm exact configuration with the approved model datasheet';

// Structural product data only. Names, summaries and highlights live in
// src/i18n/content/<locale>/products.json.
export const productBase: ProductBase[] = [
  {
    slug: 'ht400-rugged-barcode-pda', category: 'Rugged PDA', model: 'HT400',
    image: 'https://www.lqycit.com/uploadfiles/2025/04/20250425163940849.jpg', imageStatus: 'official-source-preview',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_124_lcid_4.html',
    specs: { 'Product type': 'Rugged barcode PDA', 'Barcode engine': confirm, 'Operating system': confirm, 'Display': confirm, 'Memory & storage': confirm, 'Wireless connectivity': confirm, 'Ruggedness': confirm }
  },
  {
    slug: 'ht510-rugged-pda', category: 'Rugged PDA', model: 'HT510 / HT510 Grip / HT510 Medical',
    image: '/images/products/product-placeholder.svg', imageStatus: 'placeholder',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_92_lcid_4.html',
    specs: { 'Variants': 'Standard / pistol-grip / medical edition', 'Barcode engine': confirm, 'Operating system': confirm, 'Display': confirm, 'Memory & storage': confirm, 'Battery': confirm, 'Ruggedness': confirm }
  },
  {
    slug: 'ht520-multifunction-pda', category: 'Rugged PDA', model: 'HT520',
    image: '/images/products/product-placeholder.svg', imageStatus: 'placeholder',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_66_lcid_4.html',
    specs: { 'Product type': 'Multifunction PDA', 'Operating system': confirm, 'Processor': confirm, 'Display': confirm, 'Barcode / NFC options': confirm, 'Connectivity': confirm, 'Ruggedness': confirm }
  },
  {
    slug: 'ht530-document-id-pda', category: 'Rugged PDA', model: 'HT530',
    image: '/images/products/product-placeholder.svg', imageStatus: 'placeholder',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_76_lcid_4.html',
    specs: { 'Product type': 'Specialized PDA', 'Document / ID reader': confirm, 'Supported standards': 'Must be confirmed for target country', 'Operating system': confirm, 'Connectivity': confirm, 'Ruggedness': confirm }
  },
  {
    slug: 'ht800-scan-print-pda', category: 'Rugged PDA', model: 'HT800',
    image: '/images/products/product-placeholder.svg', imageStatus: 'placeholder',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_76_lcid_4.html',
    specs: { 'Product type': 'Scan & print PDA', 'Print method': confirm, 'Print width': confirm, 'Barcode engine': confirm, 'Operating system': confirm, 'Battery': confirm }
  },
  {
    slug: 'ht540-rfid-handheld', category: 'RFID', model: 'HT540',
    image: 'https://www.lqycit.com/uploadfiles/2024/08/20240813134916798.jpg', imageStatus: 'official-source-preview',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_71_lcid_14.html',
    specs: { 'Product type': 'Short-range RFID handheld', 'RFID technology': confirm, 'Frequency / standard': confirm, 'Read range': confirm, 'Operating system': confirm, 'Connectivity': confirm, 'Ruggedness': confirm }
  },
  {
    slug: 'ht550-uhf-rfid-handheld', category: 'RFID', model: 'HT550',
    image: 'https://www.lqycit.com/uploadfiles/2025/12/20251209151931550.jpg', imageStatus: 'official-source-preview',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_93_lcid_14.html',
    specs: { 'RFID chipset': 'Impinj E710 (source-listed)', 'Frequency': '860–960 MHz; regional band configuration required', 'Protocol': 'EPC C1 Gen2 / ISO 18000-6C', 'Read range': '1–20 m (source-listed; tag and environment dependent)', 'Operating system': 'Android 10 (source-listed)', 'Display': '5.5-inch (source-listed)', 'Memory & storage': '3 GB + 32 GB standard; 4 GB + 64 GB option (source-listed)', 'Battery': '10,700 mAh (source-listed)', 'Protection': 'IP67 stated; immersion claims require confirmation' }
  },
  {
    slug: 'y100-uhf-rfid-tablet', category: 'RFID', model: 'Y100 RFID',
    image: 'https://www.lqycit.com/uploadfiles/2026/06/20260624101755261.png', imageStatus: 'official-source-preview',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_137_lcid_14.html',
    specs: { 'Processor': 'Octa-core 2.2 GHz (source-listed)', 'Operating system': 'Android 13 (source-listed)', 'Memory & storage': '6 GB + 128 GB (source-listed)', 'Display': '10.1-inch (source-listed)', 'UHF RFID chipset': 'Impinj E710; E510 / R2000 options also listed', 'RFID frequency': 'Regional options: 902–928 MHz / 865–868 MHz / 920–925 MHz', 'RFID protocol': 'EPC Global UHF Class 1 Gen 2 / ISO 18000-6C', 'Read range': 'Up to 15 m in open outdoor conditions with specified tag (source-listed)', 'Battery': '10,000 mAh (source-listed)', 'NFC': 'ISO 14443 A/B; 1–3 cm stated on source page', 'Protection': 'IP67 in detailed specification; overview also says IP68 — verify before publication' }
  },
  {
    slug: 'y100-rugged-android-tablet', category: 'Industrial Tablet', model: 'Y100 Android',
    image: '/images/products/product-placeholder.svg', imageStatus: 'placeholder',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_76_lcid_17.html',
    specs: { 'Display': '10.1-inch family; exact resolution to confirm', 'Operating system': confirm, 'Processor': confirm, 'Memory & storage': confirm, 'Barcode / NFC / RFID': 'Optional modules; confirm by SKU', 'Battery': confirm, 'Protection': confirm }
  },
  {
    slug: 'y70-rugged-tablet', category: 'Industrial Tablet', model: 'Y70 Android / Y70 Windows',
    image: 'https://www.lqycit.com/uploadfiles/2025/11/20251110134948197.jpg', imageStatus: 'official-source-preview',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_135_lcid_17.html',
    specs: { 'Display': '7-inch (source catalogue)', 'Operating system': 'Android / Windows variants', 'Processor': confirm, 'Memory & storage': confirm, 'Connectivity': confirm, 'Battery': confirm, 'Protection': confirm }
  },
  {
    slug: 'a100-windows-rugged-tablet', category: 'Industrial Tablet', model: 'A100',
    image: 'https://www.lqycit.com/uploadfiles/2026/03/20260310170636811.jpg', imageStatus: 'official-source-preview',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_140_lcid_17.html',
    specs: { 'Display': '10.1-inch FHD, 1200 × 1920, 550 cd/m² (source-listed)', 'Operating system': 'Windows 10 / 11 Pro (source-listed)', 'Processor': 'Intel N5100 / N6000 / N100 / other options listed; confirm SKU', 'Memory & storage': '8+128 / 8+256 / 16+256 listed', 'I/O': 'Gigabit RJ45, configurable RS232 / RS485, mini HDMI, USB 3.0, Type-C data', 'Battery': '8,000 mAh / 7.6 V (source-listed)', 'Protection': 'IP67 stated; test report and exact configuration to confirm', 'Operating temperature': '-20°C to 60°C (source-listed)' }
  },
  {
    slug: 't120a-windows-industrial-tablet', category: 'Industrial Tablet', model: 'T120A',
    image: 'https://www.lqycit.com/uploadfiles/2026/03/20260303102358320.jpg', imageStatus: 'official-source-preview',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_139_lcid_17.html',
    specs: { 'Display': '12.6-inch (source catalogue)', 'Operating system': 'Windows variant', 'Processor': confirm, 'Memory & storage': confirm, 'I/O': confirm, 'Battery': confirm, 'Protection': confirm }
  }
];
