// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const redirectOnlyRoutes = new Set([
  '/products/switches/',
  '/solutions/smart-lock-micro-motor/',
]);

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    sitemap({
      filter: (page) => !redirectOnlyRoutes.has(new URL(page).pathname),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://yukun-drive.com',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
