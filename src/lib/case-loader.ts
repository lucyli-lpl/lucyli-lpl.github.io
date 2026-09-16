import type { Loader } from 'astro/loaders';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface CaseChapter {
  slug: string;
  title: string;
  body: string;
}

export function caseLoader(base: string): Loader {
  return {
    name: 'case-loader',
    async load({ store, logger }) {
      if (!existsSync(base)) {
        logger.warn(`Case loader: base directory not found: ${base}`);
        return;
      }

      const caseDirs = readdirSync(base, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .sort((a, b) => a.name.localeCompare(b.name));

      for (const dir of caseDirs) {
        const casePath = resolve(base, dir.name, 'case.md');
        if (!existsSync(casePath)) continue;

        const caseRaw = readFileSync(casePath, 'utf-8');
        const { data: frontmatter, content: caseContent } = matter(caseRaw);

        const chapterDir = resolve(base, dir.name);
        const chapterFiles = readdirSync(chapterDir)
          .filter(f => /^\d{2}-.*\.md$/.test(f))
          .sort();

        const chapters: CaseChapter[] = chapterFiles.map(f => {
          const raw = readFileSync(resolve(chapterDir, f), 'utf-8');
          const { data, content } = matter(raw);
          return {
            slug: f.replace(/\.md$/, ''),
            title: data.title || f.replace(/^\d{2}-/, '').replace(/\.md$/, ''),
            body: marked.parse(content, { async: false }) as string,
          };
        });

        const toStr = (v: unknown) => v instanceof Date ? v.toISOString().slice(0, 10) : (v != null ? String(v) : undefined);

        store.set({
          id: dir.name,
          data: {
            ...frontmatter,
            product_launched: toStr(frontmatter.product_launched),
            analyzed: toStr(frontmatter.analyzed),
            filing_date: toStr(frontmatter.filing_date),
            patterns: Array.isArray(frontmatter.patterns) ? frontmatter.patterns : [],
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
            slug: dir.name,
            chapters,
            summary: caseContent.trim(),
          },
        });
      }
    },
  };
}
