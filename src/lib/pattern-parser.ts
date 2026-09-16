/**
 * 把 ai-design-patterns 的 pattern markdown（按 DATA_SCHEMA 结构）解析成数据，
 * 供站点用可视化组件渲染。任何段落解析失败都返回空，页面回退到 prose 直出。
 */
import { marked } from 'marked';

export type MechanismKey = 'input' | 'processing' | 'artifact' | 'execution' | 'feedback';

export interface MechanismStep { key: MechanismKey; label: string; text: string }
export interface Boundary { title?: string; text: string }

export interface Product {
  name: string;
  /** 对比矩阵字段（规范化 key → 值） */
  matrix: Record<string, string>;
  /** 矩阵里未识别的额外维度，保留原标签 */
  extra: { label: string; value: string }[];
  /** 详情卡字段（规范化 key → HTML） */
  detail: Record<string, string>;
}

export interface PatternDoc {
  oneLiner: { en?: string; zh?: string };
  mechanism: MechanismStep[];
  prerequisites: string[];
  boundaries: Boundary[];
  products: Product[];
  pmNotesHtml: string;
  /** 至少解析出机制或产品实现，页面才走结构化渲染 */
  parsed: boolean;
}

export const MECHANISM_LABELS: Record<MechanismKey, string> = {
  input: '输入',
  processing: '处理',
  artifact: '沉淀物',
  execution: '执行',
  feedback: '反馈闭环',
};

export const MATRIX_LABELS: Record<string, string> = {
  vendor: '厂商',
  launch: '上线时间',
  platform: '使用平台',
  scenario: '使用场景',
  approach: '实现方式',
  tradeoff: '核心取舍',
  url: '官方链接',
};

export const DETAIL_LABELS: Record<string, string> = {
  platform: '平台',
  scenario: '场景',
  implementation: '实现方式',
  design: '设计取舍',
  constraints: '限制',
  link: '官方链接',
  visual: '视觉参考',
};

const BOLD_BULLET = /^-\s*\*\*([^*]+?)\*\*\s*[:：]?\s*(.*)$/;

function splitSections(md: string, level: 2 | 3): Map<string, string> {
  const re = level === 2 ? /^## +(.+)$/m : /^### +(.+)$/m;
  const out = new Map<string, string>();
  const parts = md.split(re);
  // parts: [preamble, heading1, body1, heading2, body2, ...]
  for (let i = 1; i < parts.length; i += 2) {
    out.set(parts[i].trim().toLowerCase(), parts[i + 1] ?? '');
  }
  return out;
}

function findSection(sections: Map<string, string>, ...needles: string[]): string {
  for (const [k, v] of sections) {
    if (needles.some(n => k.includes(n))) return v;
  }
  return '';
}

/** 从 "Input / 输入" 这类双语标签里取中文；没有就返回 undefined */
function zhOf(label: string): string | undefined {
  const m = label.split('/').map(s => s.trim());
  return m.length > 1 ? m[m.length - 1] : undefined;
}

function mechanismKey(label: string): MechanismKey | undefined {
  const l = label.toLowerCase();
  if (/input|输入/.test(l)) return 'input';
  if (/process|处理/.test(l)) return 'processing';
  if (/artifact|沉淀/.test(l)) return 'artifact';
  if (/execut|执行/.test(l)) return 'execution';
  if (/feedback|反馈/.test(l)) return 'feedback';
  return undefined;
}

function matrixKey(label: string): string | undefined {
  const l = label.toLowerCase();
  if (/vendor|厂商/.test(l)) return 'vendor';
  if (/launch|上线/.test(l)) return 'launch';
  if (/platform|平台/.test(l)) return 'platform';
  if (/scenario|场景/.test(l)) return 'scenario';
  if (/approach|实现/.test(l)) return 'approach';
  if (/trade|取舍/.test(l)) return 'tradeoff';
  if (/url|link|链接/.test(l)) return 'url';
  return undefined;
}

function detailKey(label: string): string | undefined {
  const l = label.toLowerCase();
  if (/platform|平台/.test(l)) return 'platform';
  if (/scenario|场景/.test(l)) return 'scenario';
  if (/implementation|实现/.test(l)) return 'implementation';
  if (/design|取舍/.test(l)) return 'design';
  if (/constraint|限制/.test(l)) return 'constraints';
  if (/official|link|链接/.test(l)) return 'link';
  if (/visual|视觉/.test(l)) return 'visual';
  return undefined;
}

/** 解析 "- **Label**: text" 列表；子弹点（缩进的 -）并入上一条 */
function parseBoldBullets(md: string): { label: string; text: string }[] {
  const out: { label: string; text: string }[] = [];
  for (const raw of md.split('\n')) {
    const line = raw.replace(/\t/g, '  ');
    const m = line.trim().match(BOLD_BULLET);
    if (m && !/^\s{2,}/.test(line)) {
      out.push({ label: m[1].trim(), text: m[2].trim() });
    } else if (/^\s{2,}-\s+/.test(line) && out.length) {
      out[out.length - 1].text += `\n- ${line.trim().replace(/^-\s+/, '')}`;
    }
  }
  return out;
}

function parseList(md: string): string[] {
  return md
    .split('\n')
    .map(l => l.trim())
    .filter(l => /^(\d+[.)]|-|\*)\s+/.test(l))
    .map(l => l.replace(/^(\d+[.)]|-|\*)\s+/, ''));
}

function parseTable(md: string): string[][] {
  return md
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('|'))
    .map(l => l.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()))
    .filter(cells => !cells.every(c => /^:?-{2,}:?$/.test(c)));
}

function normName(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, ' ').trim();
}

function inlineHtml(md: string): string {
  return (marked.parse(md, { async: false }) as string).trim();
}

export function parsePattern(md: string): PatternDoc {
  const top = splitSections(md, 2);
  const definition = findSection(top, 'definition', '定义');
  const implementations = findSection(top, 'implementation', '产品实现');
  const pmNotes = findSection(top, 'pm notes', 'pm 笔记', '笔记');

  // ---- Definition
  const def = splitSections(definition, 3);
  const oneLinerRaw = findSection(def, 'one-liner', '一句话');
  const quoteLines = oneLinerRaw.split('\n').map(l => l.trim()).filter(l => l.startsWith('>')).map(l => l.replace(/^>\s*/, ''));
  const oneLiner = {
    zh: quoteLines.find(l => /[一-鿿]/.test(l)),
    en: quoteLines.find(l => !/[一-鿿]/.test(l)),
  };

  const mechanism: MechanismStep[] = [];
  for (const b of parseBoldBullets(findSection(def, 'how it works', '运作机制'))) {
    const key = mechanismKey(b.label);
    if (key && !mechanism.some(s => s.key === key)) {
      mechanism.push({ key, label: zhOf(b.label) ?? MECHANISM_LABELS[key], text: b.text });
    }
  }
  const order: MechanismKey[] = ['input', 'processing', 'artifact', 'execution', 'feedback'];
  mechanism.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));

  const prerequisites = parseList(findSection(def, 'prerequisite', '前置')).map(l => l.replace(/\*\*/g, ''));

  const boundaries: Boundary[] = [];
  const boundaryMd = findSection(def, 'boundar', '边界');
  const boldB = parseBoldBullets(boundaryMd);
  if (boldB.length) {
    boundaries.push(...boldB.map(b => ({ title: b.label, text: b.text })));
  } else {
    boundaries.push(...parseList(boundaryMd).map(text => ({ text })));
  }

  // ---- Implementations
  const impl = splitSections(implementations, 3);
  const products: Product[] = [];
  const table = parseTable(findSection(impl, 'comparison', '对比'));
  if (table.length > 1) {
    const header = table[0];
    for (let c = 1; c < header.length; c++) {
      products.push({ name: header[c], matrix: {}, extra: [], detail: {} });
    }
    for (const row of table.slice(1)) {
      const key = matrixKey(row[0]);
      for (let c = 1; c < header.length; c++) {
        const p = products[c - 1];
        if (!p) continue;
        const val = row[c] ?? '';
        if (key) p.matrix[key] = val;
        else p.extra.push({ label: row[0].split('/')[0].trim(), value: val });
      }
    }
  }

  // 详情卡：### <Name> — Detail Card
  for (const [heading, body] of impl) {
    if (!/detail card|详情卡/.test(heading)) continue;
    const name = heading.split(/\s[—–-]\s/)[0].trim();
    const fields: Record<string, string> = {};
    for (const b of parseBoldBullets(body)) {
      const k = detailKey(b.label);
      if (k && b.text && b.text !== '—' && !/^n\/a$/i.test(b.text)) fields[k] = inlineHtml(b.text);
    }
    const n = normName(name);
    let target =
      products.find(p => normName(p.name) === n) ??
      products.find(p => n.split(' ')[0] && normName(p.name).startsWith(n.split(' ')[0])) ??
      products.find(p => Object.keys(p.detail).length === 0);
    if (!target) {
      target = { name, matrix: {}, extra: [], detail: {} };
      products.push(target);
    }
    target.detail = fields;
  }

  const pmNotesHtml = pmNotes.trim() ? inlineHtml(pmNotes) : '';

  return {
    oneLiner,
    mechanism,
    prerequisites,
    boundaries,
    products,
    pmNotesHtml,
    parsed: mechanism.length > 0 || products.length > 0,
  };
}
