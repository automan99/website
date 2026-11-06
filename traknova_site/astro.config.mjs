import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Cloudflare Pages deploys at the domain root, so no Astro `base` is set.
  site: 'https://enpfox.com',
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
    '/products/ht540-series': '/products/rfid-handhelds',
    '/products/ht550': '/products/rfid-handhelds',
    '/zh/products/ht540-series': '/zh/products/rfid-handhelds',
    '/zh/products/ht550': '/zh/products/rfid-handhelds'
  }
});