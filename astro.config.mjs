// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

import icon from 'astro-icon';

import preact from '@astrojs/preact';

import compress from 'astro-compress';

import sitemap from '@astrojs/sitemap';

import { svgoOptimizer } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.acm.illinois.edu',
  output: 'static',
  outDir: './build',
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
  },
  server: {
    port: 3000,
  },
  integrations: [
    mdx(),
    icon(),
    preact({ compat: true }),
    compress(),
    sitemap({
      filter: (page) => !page.startsWith('https://www.acm.illinois.edu/admin/'),
    }),
  ],
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
