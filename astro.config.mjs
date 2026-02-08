// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

import icon from 'astro-icon';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  outDir: './build',
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    port: 3000,
  },
  integrations: [mdx(), icon(), preact({ compat: true })],
});
