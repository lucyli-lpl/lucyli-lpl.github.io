import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lucyli-lpl.github.io',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // 把 CSS 内联进 HTML：GitHub Pages 部署切换期间，旧 HTML 引用的 hash CSS
    // 会 404 导致整页无样式；内联后 HTML 与样式永远同版本。全站 CSS 仅 ~56KB。
    inlineStylesheets: 'always',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
