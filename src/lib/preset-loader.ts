import type { Loader } from 'astro/loaders';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

export function presetLoader(base: string): Loader {
  return {
    name: 'preset-loader',
    async load({ store, logger }) {
      if (!existsSync(base)) {
        logger.warn(`Preset loader: base directory not found: ${base}`);
        return;
      }

      const typeDirs = readdirSync(base, { withFileTypes: true })
        .filter(d => d.isDirectory());

      for (const typeDir of typeDirs) {
        const typePath = resolve(base, typeDir.name);
        const typeReadme = resolve(typePath, '_README.md');
        let typeDescription = '';
        if (existsSync(typeReadme)) {
          const raw = readFileSync(typeReadme, 'utf-8');
          const lines = raw.split('\n').filter(l => l.trim());
          typeDescription = lines[0]?.replace(/^#+ /, '') || '';
        }

        const presetDirs = readdirSync(typePath, { withFileTypes: true })
          .filter(d => d.isDirectory());

        for (const presetDir of presetDirs) {
          const tokensPath = resolve(typePath, presetDir.name, 'TOKENS.md');
          if (!existsSync(tokensPath)) continue;

          const raw = readFileSync(tokensPath, 'utf-8');
          const { data, content } = matter(raw);

          const hasExample = existsSync(resolve(typePath, presetDir.name, 'example.html'));
          const hasPreview = existsSync(resolve(typePath, presetDir.name, 'preview.png'));

          store.set({
            id: `${typeDir.name}--${presetDir.name}`,
            data: {
              preset_name: data.preset_name || presetDir.name,
              chinese_name: data.chinese_name || '',
              output_type: data.output_type || typeDir.name,
              origin: data.origin || '',
              one_liner: data.one_liner || '',
              tags: data.tags || [],
              type_label: typeDir.name,
              type_description: typeDescription,
              hasExample,
              hasPreview,
              body: marked.parse(content, { async: false }) as string,
            },
          });
        }
      }
    },
  };
}
