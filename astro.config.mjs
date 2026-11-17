// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  devToolbar: { enabled: false },
  output: 'static',
  site: 'https://kirantushar10.github.io',
  base: '/',
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwind()],
    build: {
      target: 'es2020',
    },
  },
});