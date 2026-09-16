import type { Loader } from 'astro/loaders';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

export function skillLoader(bases: string[]): Loader {
  return {
    name: 'skill-loader',
    async load({ store, logger }) {
      for (const base of bases) {
        if (!existsSync(base)) continue;

        const dirs = readdirSync(base, { withFileTypes: true })
          .filter(d => d.isDirectory() && d.name !== 'visual-library');

        for (const dir of dirs) {
          const skillPath = resolve(base, dir.name, 'SKILL.md');
          if (!existsSync(skillPath)) continue;

          const raw = readFileSync(skillPath, 'utf-8');
          const { data, content } = matter(raw);

          store.set({
            id: dir.name,
            data: {
              name: data.name || dir.name,
              description: data.description || '',
              body: marked.parse(content, { async: false }) as string,
            },
          });
        }
      }
    },
  };
}
