import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://automan99.github.io',
  base: '/website',
  integrations: [
    sitemap({
      // Keep this list in sync with ENABLED_LOCALES in src/i18n/config.ts.
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', zh: 'zh-CN' }
      }
    })
  ],
  output: 'static',
  build: { format: 'directory' }
});