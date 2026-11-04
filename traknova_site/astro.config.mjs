import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://automan99.github.io',
  base: '/website',
  integrations: [sitemap()],
  output: 'static',
  build: { format: 'directory' }
});