export type Product = {
  slug: string;
  name: string;
  category: 'Rugged PDA' | 'RFID' | 'Industrial Tablet';
  model: string;
  summary: string;
  image: string;
  imageStatus: 'official-source-preview' | 'placeholder';
  sourceUrl: string;
  highlights: string[];
  specs: Record<string, string>;
};

const confirm = 'Confirm exact configuration with the approved model datasheet';

// Product scope is intentionally limited to PDA, RFID and rugged industrial tablets.
// Model families are taken from the domestic catalogue. Only published specifications
// with a clear source are populated; options and conflicting protection claims are flagged.
export const products: Product[] = [
  {
    slug: 'ht400-rugged-barcode-pda', name: 'HT400 Rugged Barcode PDA', category: 'Rugged PDA', model: 'HT400',
    summary: 'Compact Android mobile computer for barcode-based receiving, picking, stocktaking and field data capture.',
    image: 'https://www.lqycit.com/uploadfiles/2025/04/20250425163940849.jpg', imageStatus: 'official-source-preview',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_124_lcid_4.html',
    highlights: ['1D / 2D barcode capture configuration', 'Portable handheld form factor', 'For logistics, retail and field operations'],
    specs: { 'Product type': 'Rugged barcode PDA', 'Barcode engine': confirm, 'Operating system': confirm, 'Display': confirm, 'Memory & storage': confirm, 'Wireless connectivity': confirm, 'Ruggedness': confirm }
  },
  {
    slug: 'ht510-rugged-pda', name: 'HT510 Rugged PDA', category: 'Rugged PDA', model: 'HT510 / HT510 Grip / HT510 Medical',
    summary: 'A configurable handheld terminal family with standard, pistol-grip and healthcare-oriented variants.',
    image: '/images/products/product-placeholder.svg', imageStatus: 'placeholder',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_92_lcid_4.html',
    highlights: ['Multiple form-factor variants', 'Barcode data capture configuration', 'Variant-specific accessories and workflows'],
    specs: { 'Variants': 'Standard / pistol-grip / medical edition', 'Barcode engine': confirm, 'Operating system': confirm, 'Display': confirm, 'Memory & storage': confirm, 'Battery': confirm, 'Ruggedness': confirm }
  },
  {
    slug: 'ht520-multifunction-pda', name: 'HT520 Multifunction PDA', category: 'Rugged PDA', model: 'HT520',
    summary: 'Multifunction enterprise handheld for mobile data collection and operational workflows.',
    image: '/images/products/product-placeholder.svg', imageStatus: 'placeholder',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_66_lcid_4.html',
    highlights: ['Multifunction mobile terminal platform', 'Barcode / data-capture options to confirm', 'Suitable for enterprise application integration'],
    specs: { 'Product type': 'Multifunction PDA', 'Operating system': confirm, 'Processor': confirm, 'Display': confirm, 'Barcode / NFC options': confirm, 'Connectivity': confirm, 'Ruggedness': confirm }
  },
  {
    slug: 'ht530-document-id-pda', name: 'HT530 Document & ID Capture PDA', category: 'Rugged PDA', model: 'HT530',
    summary: 'A specialized handheld terminal listed for ID-card-related workflows. Regional document-reading compatibility must be confirmed per project.',
    image: '/images/products/product-placeholder.svg', imageStatus: 'placeholder',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_76_lcid_4.html',
    highlights: ['Specialized document / ID workflow positioning', 'Reader module and supported standards require project confirmation', 'For controlled enterprise and public-service deployments'],
    specs: { 'Product type': 'Specialized PDA', 'Document / ID reader': confirm, 'Supported standards': 'Must be confirmed for target country', 'Operating system': confirm, 'Connectivity': confirm, 'Ruggedness': confirm }
  },
  {
    slug: 'ht800-scan-print-pda', name: 'HT800 Scan & Print PDA', category: 'Rugged PDA', model: 'HT800',
    summary: 'Integrated mobile data capture and printing concept for on-the-go labeling and transaction workflows.',
    image: '/images/products/product-placeholder.svg', imageStatus: 'placeholder',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_76_lcid_4.html',
    highlights: ['Scanning and mobile printing in one device', 'For delivery, retail and field operations', 'Print width, media and engine details to confirm'],
    specs: { 'Product type': 'Scan & print PDA', 'Print method': confirm, 'Print width': confirm, 'Barcode engine': confirm, 'Operating system': confirm, 'Battery': confirm }
  },
  {
    slug: 'ht540-rfid-handheld', name: 'HT540 RFID Handheld', category: 'RFID', model: 'HT540',
    summary: 'Short-range RFID handheld terminal for close-proximity identification and data collection.',
    image: 'https://www.lqycit.com/uploadfiles/2024/08/20240813134916798.jpg', imageStatus: 'official-source-preview',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_71_lcid_14.html',
    highlights: ['Short-range RFID reader category', 'For identification and item-level workflows', 'RFID standard, read range and supported tags to confirm'],
    specs: { 'Product type': 'Short-range RFID handheld', 'RFID technology': confirm, 'Frequency / standard': confirm, 'Read range': confirm, 'Operating system': confirm, 'Connectivity': confirm, 'Ruggedness': confirm }
  },
  {
    slug: 'ht550-uhf-rfid-handheld', name: 'HT550 UHF RFID Handheld', category: 'RFID', model: 'HT550',
    summary: 'Long-range UHF RFID handheld for bulk inventory, asset tracking, warehouse operations and field identification.',
    image: 'https://www.lqycit.com/uploadfiles/2025/12/20251209151931550.jpg', imageStatus: 'official-source-preview',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_93_lcid_14.html',
    highlights: ['Impinj E710 UHF RFID module stated on source page', 'Published read range: 1–20 m, dependent on tag and environment', 'Android 10; 5.5-inch display; 10,700 mAh battery stated on source page'],
    specs: { 'RFID chipset': 'Impinj E710 (source-listed)', 'Frequency': '860–960 MHz; regional band configuration required', 'Protocol': 'EPC C1 Gen2 / ISO 18000-6C', 'Read range': '1–20 m (source-listed; tag and environment dependent)', 'Operating system': 'Android 10 (source-listed)', 'Display': '5.5-inch (source-listed)', 'Memory & storage': '3 GB + 32 GB standard; 4 GB + 64 GB option (source-listed)', 'Battery': '10,700 mAh (source-listed)', 'Protection': 'IP67 stated; immersion claims require confirmation' }
  },
  {
    slug: 'y100-uhf-rfid-tablet', name: 'Y100 UHF RFID Rugged Tablet', category: 'RFID', model: 'Y100 RFID',
    summary: 'A 10.1-inch rugged Android tablet with integrated UHF RFID, designed for inventory, logistics and asset-management workflows.',
    image: 'https://www.lqycit.com/uploadfiles/2026/06/20260624101755261.png', imageStatus: 'official-source-preview',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_137_lcid_14.html',
    highlights: ['Impinj E710-based UHF RFID module listed', 'Android 13 with 6 GB + 128 GB listed', 'Optional barcode scanning, NFC, fingerprint and PSAM modules'],
    specs: { 'Processor': 'Octa-core 2.2 GHz (source-listed)', 'Operating system': 'Android 13 (source-listed)', 'Memory & storage': '6 GB + 128 GB (source-listed)', 'Display': '10.1-inch (source-listed)', 'UHF RFID chipset': 'Impinj E710; E510 / R2000 options also listed', 'RFID frequency': 'Regional options: 902–928 MHz / 865–868 MHz / 920–925 MHz', 'RFID protocol': 'EPC Global UHF Class 1 Gen 2 / ISO 18000-6C', 'Read range': 'Up to 15 m in open outdoor conditions with specified tag (source-listed)', 'Battery': '10,000 mAh (source-listed)', 'NFC': 'ISO 14443 A/B; 1–3 cm stated on source page', 'Protection': 'IP67 in detailed specification; overview also says IP68 — verify before publication' }
  },
  {
    slug: 'y100-rugged-android-tablet', name: 'Y100 Rugged Android Tablet', category: 'Industrial Tablet', model: 'Y100 Android',
    summary: 'A rugged 10.1-inch tablet platform for mobile workforces, inspection and industrial data collection.',
    image: '/images/products/product-placeholder.svg', imageStatus: 'placeholder',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_76_lcid_17.html',
    highlights: ['10.1-inch rugged tablet family', 'Optional barcode / NFC / RFID configurations depend on model', 'Confirm Android variant specification before quotation'],
    specs: { 'Display': '10.1-inch family; exact resolution to confirm', 'Operating system': confirm, 'Processor': confirm, 'Memory & storage': confirm, 'Barcode / NFC / RFID': 'Optional modules; confirm by SKU', 'Battery': confirm, 'Protection': confirm }
  },
  {
    slug: 'y70-rugged-tablet', name: 'Y70 7-inch Rugged Tablet', category: 'Industrial Tablet', model: 'Y70 Android / Y70 Windows',
    summary: 'A compact 7-inch rugged tablet family available in Android and Windows variants for mobile field operations.',
    image: 'https://www.lqycit.com/uploadfiles/2025/11/20251110134948197.jpg', imageStatus: 'official-source-preview',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_135_lcid_17.html',
    highlights: ['7-inch compact rugged tablet', 'Android and Windows versions listed', 'Configuration and protection rating vary by version'],
    specs: { 'Display': '7-inch (source catalogue)', 'Operating system': 'Android / Windows variants', 'Processor': confirm, 'Memory & storage': confirm, 'Connectivity': confirm, 'Battery': confirm, 'Protection': confirm }
  },
  {
    slug: 'a100-windows-rugged-tablet', name: 'A100 Windows Rugged Tablet', category: 'Industrial Tablet', model: 'A100',
    summary: 'A 10.1-inch Windows rugged tablet with native industrial I/O options for equipment connectivity and field service.',
    image: 'https://www.lqycit.com/uploadfiles/2026/03/20260310170636811.jpg', imageStatus: 'official-source-preview',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_140_lcid_17.html',
    highlights: ['10.1-inch Windows tablet; Intel N-series options listed', 'Gigabit RJ45 and configurable RS232 / RS485', '550-nit display and IP67 are stated on source page; verify final SKU'],
    specs: { 'Display': '10.1-inch FHD, 1200 × 1920, 550 cd/m² (source-listed)', 'Operating system': 'Windows 10 / 11 Pro (source-listed)', 'Processor': 'Intel N5100 / N6000 / N100 / other options listed; confirm SKU', 'Memory & storage': '8+128 / 8+256 / 16+256 listed', 'I/O': 'Gigabit RJ45, configurable RS232 / RS485, mini HDMI, USB 3.0, Type-C data', 'Battery': '8,000 mAh / 7.6 V (source-listed)', 'Protection': 'IP67 stated; test report and exact configuration to confirm', 'Operating temperature': '-20°C to 60°C (source-listed)' }
  },
  {
    slug: 't120a-windows-industrial-tablet', name: 'T120A Windows Industrial Tablet', category: 'Industrial Tablet', model: 'T120A',
    summary: 'A large-format 12.6-inch Windows industrial tablet for demanding mobile workstations and industrial applications.',
    image: 'https://www.lqycit.com/uploadfiles/2026/03/20260303102358320.jpg', imageStatus: 'official-source-preview',
    sourceUrl: 'https://www.lqycit.com/Product/info_itemid_139_lcid_17.html',
    highlights: ['12.6-inch Windows industrial tablet', 'Large-screen platform for industrial software and field workflows', 'Detailed processor, I/O and protection data to confirm by SKU'],
    specs: { 'Display': '12.6-inch (source catalogue)', 'Operating system': 'Windows variant', 'Processor': confirm, 'Memory & storage': confirm, 'I/O': confirm, 'Battery': confirm, 'Protection': confirm }
  }
];
