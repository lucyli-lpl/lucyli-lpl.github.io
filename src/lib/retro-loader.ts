import type { Loader } from 'astro/loaders';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface RetroChapter {
  slug: string;
  title: string;
  body: string;
}

export interface Pitfall {
  /** 方法论模块编号；通用坑为 null */
  module: number | null;
  what: string;
  why?: string;
  fix?: string;
}

export interface RetroUpdate {
  date: string;
  note: string;
}

/**
 * 踩坑行格式（在 *-pitfalls.md 章节里）：
 *   - **[模块3]** 坑的一句话 → 原因 → 对策
 *   - **[通用]** 坑的一句话 → 原因 → 对策
 * 也接受 [3] / [M3]；箭头可用 → 或 ->
 */
const PITFALL_RE = /^-\s*\*\*\[\s*(?:模块|M)?\s*(\d+|通用)\s*\]\*\*\s*(.+)$/;

export function parsePitfalls(markdown: string): Pitfall[] {
  const out: Pitfall[] = [];
  for (const raw of markdown.split('\n')) {
    const m = raw.trim().match(PITFALL_RE);
    if (!m) continue;
    const module = m[1] === '通用' ? null : Number(m[1]);
    const parts = m[2].split(/\s*(?:→|->)\s*/).map(s => s.trim()).filter(Boolean);
    out.push({ module, what: parts[0] ?? '', why: parts[1], fix: parts[2] });
  }
  return out;
}

/**
 * 统一成 YYYY-MM-DD。
 * js-yaml 会把 `2026-09-16` 解析成 Date；作为 map 的 key 时又会被 JS 转成
 * "Wed Sep 16 2026 08:00:00 GMT+0800" 这种字符串，这里一并处理。
 */
const toStr = (v: unknown): string | undefined => {
  if (v == null) return undefined;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = String(v).trim();
  if (/^\d{4}-\d{2}(-\d{2})?$/.test(s)) return s;
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toISOString().slice(0, 10);
};

function normalizeUpdates(v: unknown): RetroUpdate[] {
  if (!Array.isArray(v)) return [];
  const out: RetroUpdate[] = [];
  for (const item of v) {
    if (item && typeof item === 'object' && !(item instanceof Date)) {
      // 形如 { 2026-09-16: 初稿 } 或 { date, note }
      const obj = item as Record<string, unknown>;
      if ('date' in obj) {
        out.push({ date: toStr(obj.date) ?? '', note: String(obj.note ?? '') });
      } else {
        for (const [k, val] of Object.entries(obj)) {
          out.push({ date: toStr(k) ?? k, note: String(val ?? '') });
        }
      }
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 读取 retros/<slug>/ 目录：retro.md 为主文件，NN-*.md 为章节。
 * 以 `_` 开头的目录（_inbox、_template）跳过。
 */
export function retroLoader(base: string): Loader {
  return {
    name: 'retro-loader',
    async load({ store, logger }) {
      if (!existsSync(base)) {
        logger.warn(`Retro loader: base directory not found: ${base}`);
        return;
      }

      const dirs = readdirSync(base, { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('_'))
        .sort((a, b) => a.name.localeCompare(b.name));

      for (const dir of dirs) {
        const mainPath = resolve(base, dir.name, 'retro.md');
        if (!existsSync(mainPath)) continue;

        const { data: fm, content: mainContent } = matter(readFileSync(mainPath, 'utf-8'));

        const chapterDir = resolve(base, dir.name);
        const chapterFiles = readdirSync(chapterDir)
          .filter(f => /^\d{2}-.*\.md$/.test(f))
          .sort();

        const pitfalls: Pitfall[] = [];
        const chapters: RetroChapter[] = chapterFiles.map(f => {
          const { data, content } = matter(readFileSync(resolve(chapterDir, f), 'utf-8'));
          const slug = f.replace(/\.md$/, '');
          if (/pitfall|坑/i.test(slug)) pitfalls.push(...parsePitfalls(content));
          return {
            slug,
            title: data.title || slug.replace(/^\d{2}-/, ''),
            body: marked.parse(content, { async: false }) as string,
          };
        });

        const updates = normalizeUpdates(fm.updates);

        store.set({
          id: dir.name,
          data: {
            title: String(fm.title ?? dir.name),
            project: fm.project != null ? String(fm.project) : undefined,
            period: fm.period != null ? String(fm.period) : undefined,
            status: fm.status === 'closed' ? 'closed' : 'ongoing',
            affected_modules: Array.isArray(fm.affected_modules) ? fm.affected_modules.map(Number) : [],
            produced_version: fm.produced_version != null ? String(fm.produced_version) : undefined,
            tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
            updates,
            started: toStr(fm.started) ?? updates[0]?.date,
            updated: updates.at(-1)?.date ?? toStr(fm.started),
            slug: dir.name,
            chapters,
            summary: mainContent.trim(),
            pitfalls,
          },
        });
      }
    },
  };
}
