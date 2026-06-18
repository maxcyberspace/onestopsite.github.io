// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://maxcyberspace.github.io/onestopsite.github.io/",
  base: "/onestopsite.github.io",
  vite: {
    plugins: [tailwindcss()]
  }
});
