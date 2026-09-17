import type { Loader } from 'astro/loaders';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface ChapterData {
  slug: string;
  title: string;
  body: string;
}

export function moduleLoader(base: string): Loader {
  return {
    name: 'module-loader',
    async load({ store, logger }) {
      store.clear(); // 持久化 store：清掉上次的条目，删除的内容才会消失
      if (!existsSync(base)) {
        logger.warn(`Module loader: base directory not found: ${base}`);
        return;
      }

      const dirs = readdirSync(base, { withFileTypes: true })
        .filter(d => d.isDirectory() && /^\d{2}-/.test(d.name))
        .sort((a, b) => a.name.localeCompare(b.name));

      for (const dir of dirs) {
        const modulePath = resolve(base, dir.name, 'module.md');
        if (!existsSync(modulePath)) continue;

        const moduleRaw = readFileSync(modulePath, 'utf-8');
        const { data: frontmatter, content: moduleContent } = matter(moduleRaw);

        // Read chapter files
        const chapterDir = resolve(base, dir.name);
        const chapterFiles = readdirSync(chapterDir)
          .filter(f => /^\d{2}-.*\.md$/.test(f) && f !== 'module.md')
          .sort();

        const chapters: ChapterData[] = chapterFiles.map(f => {
          const raw = readFileSync(resolve(chapterDir, f), 'utf-8');
          const { data, content } = matter(raw);
          return {
            slug: f.replace(/\.md$/, ''),
            title: data.title || f.replace(/^\d{2}-/, '').replace(/\.md$/, ''),
            body: marked.parse(content, { async: false }) as string,
          };
        });

        const hasDiagram = existsSync(resolve(chapterDir, 'diagram.svg'));

        store.set({
          id: dir.name,
          data: {
            ...frontmatter,
            slug: dir.name,
            chapters,
            hasDiagram,
            moduleBody: moduleContent.trim(),
          },
        });
      }
    },
  };
}
