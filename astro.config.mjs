import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    svelte(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  site: 'https://iberi22.github.io',
  base: '/portfolio-iberi22',
  output: 'static',
  vite: {
    ssr: {
      noExternal: ['@astrojs/svelte'],
    },
  },
});
