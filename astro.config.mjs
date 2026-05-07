import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [svelte(), mdx()],
  site: 'https://iberi22.github.io',
  base: '/portfolio-iberi22',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@astrojs/svelte'],
    },
  },
});
