// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://YOUR_USERNAME.github.io",
  base: "/YOUR_REPOSITORY_NAME",
  vite: {
    plugins: [tailwindcss()]
  }
});