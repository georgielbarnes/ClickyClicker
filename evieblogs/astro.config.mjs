
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://example.com',
  output: 'server',
  adapter: cloudflare({ mode: 'pages' }), // SSR on Cloudflare Pages
  vite: {
    server: { fs: { strict: true } }
  }
});
