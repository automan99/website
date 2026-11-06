import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://automan99.github.io',
  base: '/website',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you/'),
      // Keep this list in sync with ENABLED_LOCALES in src/i18n/config.ts.
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', zh: 'zh-CN' }
      }
    })
  ],
  output: 'static',
  build: { format: 'directory' },
  redirects: {
    '/products/ht540-series': '/website/products/rfid-handhelds',
    '/products/ht550': '/website/products/rfid-handhelds',
    '/zh/products/ht540-series': '/website/zh/products/rfid-handhelds',
    '/zh/products/ht550': '/website/zh/products/rfid-handhelds'
  }
});