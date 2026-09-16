import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import * as yaml from 'js-yaml';

export type TriggerKind = 'project' | 'reading' | 'discussion' | 'internal';

export interface ChangelogEntry {
  version: string;
  date?: string;
  summary: string;
  modules: number[];
  details?: string;
  /** 触发源：显式字段优先，否则从 summary 推断 */
  trigger: TriggerKind;
  /** 触发源的具体说明（如复盘/文章名），可选 */
  trigger_ref?: string;
  /** 关联的复盘目录名（retros/<slug>），有则站点链接到复盘页 */
  retro?: string;
}

export const TRIGGER_META: Record<TriggerKind, { label: string; glyph: string }> = {
  project:    { label: '项目复盘', glyph: '◆' },
  reading:    { label: '精读落地', glyph: '▲' },
  discussion: { label: '讨论校正', glyph: '●' },
  internal:   { label: '自我梳理', glyph: '○' },
};

interface RawEntry {
  version: string | number;
  date?: string | Date | null;
  summary?: string;
  modules?: number[];
  details?: string;
  trigger?: string;
  trigger_ref?: string;
  retro?: string;
}

function inferTrigger(summary: string): TriggerKind {
  if (/复盘|真实项目/.test(summary)) return 'project';
  if (/精读/.test(summary)) return 'reading';
  if (/讨论/.test(summary)) return 'discussion';
  return 'internal';
}

function isTrigger(v: unknown): v is TriggerKind {
  return v === 'project' || v === 'reading' || v === 'discussion' || v === 'internal';
}

function dateStr(d: RawEntry['date']): string | undefined {
  if (!d) return undefined;
  if (d instanceof Date) return d.toISOString().slice(0, 7);
  return String(d);
}

/** 版本号按数值段比较："1.10" > "1.9" */
export function compareVersion(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

/** 读取 CHANGELOG.yaml，返回按版本升序（旧 → 新）的条目 */
export function loadChangelog(): ChangelogEntry[] {
  const path = resolve(process.cwd(), '.content/ai-pm-fieldbook/methodology/CHANGELOG.yaml');
  if (!existsSync(path)) return [];
  const raw = (yaml.load(readFileSync(path, 'utf-8')) as RawEntry[]) || [];
  return raw
    .map((e): ChangelogEntry => {
      const summary = e.summary ?? '';
      return {
        version: String(e.version),
        date: dateStr(e.date),
        summary,
        modules: Array.isArray(e.modules) ? e.modules : [],
        details: e.details,
        trigger: isTrigger(e.trigger) ? e.trigger : inferTrigger(summary),
        trigger_ref: e.trigger_ref,
        retro: e.retro != null ? String(e.retro) : undefined,
      };
    })
    .sort((a, b) => compareVersion(a.version, b.version));
}

/** 某个模块（按 order）被哪些版本改动过，升序 */
export function entriesForModule(entries: ChangelogEntry[], order: number): ChangelogEntry[] {
  return entries.filter(e => e.modules.includes(order));
}
