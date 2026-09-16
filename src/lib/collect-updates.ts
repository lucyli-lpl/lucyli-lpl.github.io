import { getCollection } from 'astro:content';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import * as yaml from 'js-yaml';

export interface UpdateItem {
  collection: string;
  slug: string;
  title: string;
  date: string;
  kind: 'new' | 'evolved' | 'changelog';
  href: string;
}

export interface Backlinks {
  patternToCases: Record<string, { collection: string; slug: string; title: string }[]>;
  moduleToSkills: Record<string, string[]>;
}

export async function collectUpdates(): Promise<UpdateItem[]> {
  const updates: UpdateItem[] = [];

  const patterns = await getCollection('patterns');
  for (const p of patterns) {
    updates.push({
      collection: 'patterns',
      slug: p.id,
      title: `${p.data.pattern_name} ${p.data.chinese_name}`,
      date: p.data.first_seen,
      kind: 'new',
      href: `/patterns/${p.id}/`,
    });
  }

  const tastings = await getCollection('tastings');
  for (const t of tastings) {
    updates.push({
      collection: 'tastings',
      slug: t.id,
      title: `${t.data.product} 品鉴`,
      date: t.data.analyzed || '',
      kind: 'new',
      href: `/tastings/${t.id}/`,
    });
  }

  const changelogPath = resolve(process.cwd(), '.content/ai-pm-fieldbook/methodology/CHANGELOG.yaml');
  if (existsSync(changelogPath)) {
    const raw = readFileSync(changelogPath, 'utf-8');
    const entries = yaml.load(raw) as { version: string; date?: string; summary: string }[];
    if (entries?.length) {
      const latest = entries[0];
      if (latest.date) {
        updates.push({
          collection: 'methodology',
          slug: 'changelog',
          title: `方法论 v${latest.version}：${latest.summary}`,
          date: latest.date,
          kind: 'changelog',
          href: '/methodology/changelog/',
        });
      }
    }
  }

  return updates
    .filter(u => u.date)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function collectBacklinks(): Promise<Backlinks> {
  const tastings = await getCollection('tastings');
  const modules = await getCollection('methodology');

  const patternToCases: Record<string, { collection: string; slug: string; title: string }[]> = {};
  for (const t of tastings) {
    for (const p of (t.data.patterns || [])) {
      if (!patternToCases[p]) patternToCases[p] = [];
      patternToCases[p].push({
        collection: 'tastings',
        slug: t.id,
        title: t.data.product,
      });
    }
  }

  const moduleToSkills: Record<string, string[]> = {};
  for (const m of modules) {
    if (m.data.skills?.length) {
      moduleToSkills[String(m.data.order)] = m.data.skills;
    }
  }

  return { patternToCases, moduleToSkills };
}
