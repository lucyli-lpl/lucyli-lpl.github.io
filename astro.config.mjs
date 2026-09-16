import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lucyli-lpl.github.io',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
