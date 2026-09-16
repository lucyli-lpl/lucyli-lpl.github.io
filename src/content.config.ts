import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { moduleLoader } from './lib/module-loader';
import { caseLoader } from './lib/case-loader';
import { skillLoader } from './lib/skill-loader';
import { presetLoader } from './lib/preset-loader';
import { resolve } from 'node:path';

const root = process.cwd();

const patterns = defineCollection({
  loader: glob({ base: '.content/ai-design-patterns/patterns', pattern: '*.md' }),
  schema: z.object({
    pattern_name: z.string(),
    chinese_name: z.string(),
    status: z.enum(['concept', 'landed', 'evolving', 'converging']),
    first_seen: z.string(),
    originated_by: z.string().optional(),
    heat: z.number().min(1).max(5),
    tags: z.array(z.string()).default([]),
    related_patterns: z.array(z.string()).default([]),
  }),
});

const methodology = defineCollection({
  loader: moduleLoader(resolve(root, '.content/ai-pm-fieldbook/methodology')),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    one_liner: z.string().optional(),
    skills: z.array(z.string()).default([]),
    since_version: z.string().optional(),
    slug: z.string(),
    chapters: z.array(z.object({
      slug: z.string(),
      title: z.string(),
      body: z.string(),
    })),
    hasDiagram: z.boolean().default(false),
    moduleBody: z.string().default(''),
  }),
});

const caseChaptersSchema = z.array(z.object({
  slug: z.string(),
  title: z.string(),
  body: z.string(),
}));

const tastings = defineCollection({
  loader: caseLoader(resolve(root, '.content/ai-business-anatomy/cases/tastings')),
  schema: z.object({
    product: z.string(),
    company: z.string(),
    product_launched: z.string().optional(),
    analyzed: z.string().optional(),
    framework: z.string().optional(),
    framework_version: z.string().optional(),
    verdict: z.string(),
    patterns: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    slug: z.string(),
    chapters: caseChaptersSchema,
    summary: z.string().default(''),
  }),
});

const anatomies = defineCollection({
  loader: caseLoader(resolve(root, '.content/ai-business-anatomy/cases/anatomies')),
  schema: z.object({
    company: z.string(),
    filing_date: z.string().optional(),
    exchange: z.string().optional(),
    framework: z.string().optional(),
    framework_version: z.string().optional(),
    verdict: z.string(),
    patterns: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    slug: z.string(),
    chapters: caseChaptersSchema,
    summary: z.string().default(''),
  }),
});

const skills = defineCollection({
  loader: skillLoader([
    resolve(root, '.content/ai-design-patterns/skills'),
    resolve(root, '.content/ai-business-anatomy/skills'),
    resolve(root, '.content/ai-pm-fieldbook/skills'),
  ]),
  schema: z.object({
    name: z.string(),
    description: z.string().default(''),
    body: z.string().default(''),
  }),
});

const presets = defineCollection({
  loader: presetLoader(resolve(root, '.content/ai-design-patterns/skills/visual-library/presets')),
  schema: z.object({
    preset_name: z.string(),
    chinese_name: z.string().default(''),
    output_type: z.string(),
    origin: z.string().default(''),
    one_liner: z.string().default(''),
    tags: z.array(z.string()).default([]),
    type_label: z.string(),
    type_description: z.string().default(''),
    hasExample: z.boolean().default(false),
    hasPreview: z.boolean().default(false),
    body: z.string().default(''),
  }),
});

const notes = defineCollection({
  loader: glob({ base: 'content/notes', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
  }),
});

export const collections = { patterns, methodology, tastings, anatomies, skills, presets, notes };
