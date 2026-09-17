/**
 * 内容格式校验：在 sync 之后、build 之前跑。
 * 规则与各仓库 WRITING.md / cases/README.md / DATA_SCHEMA.md 一致。
 * 有 error 则退出码 1（CI 失败并列出文件 + 原因）；warning 只打印。
 * 用法：pnpm validate
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import matter from 'gray-matter';
import * as yaml from 'js-yaml';

const ROOT = process.cwd();
const C = (p) => resolve(ROOT, '.content', p);
const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);
const rel = (p) => p.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');

const isDir = (p) => existsSync(p) && statSync(p).isDirectory();
const dirs = (p) => (isDir(p) ? readdirSync(p, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name) : []);
const files = (p) => (isDir(p) ? readdirSync(p) : []);
const fm = (file) => { try { return matter(readFileSync(file, 'utf-8')); } catch (e) { err(rel(file), `frontmatter 解析失败：${e.message.split('\n')[0]}`); return null; } };
const isIntArray = (v) => Array.isArray(v) && v.every(n => Number.isInteger(n));

// ---------- methodology ----------
const methDir = C('ai-pm-fieldbook/methodology');
const moduleOrders = new Set();
for (const d of dirs(methDir).filter(n => /^\d{2}-/.test(n))) {
  const mod = join(methDir, d, 'module.md');
  if (!existsSync(mod)) { err(rel(join(methDir, d)), '缺少 module.md'); continue; }
  const m = fm(mod); if (!m) continue;
  if (!Number.isInteger(m.data.order)) err(rel(mod), 'order 必须是整数');
  else {
    moduleOrders.add(m.data.order);
    if (String(m.data.order).padStart(2, '0') !== d.slice(0, 2)) warn(rel(mod), `order ${m.data.order} 与目录前缀 ${d.slice(0, 2)} 不一致`);
  }
  if (!m.data.title) err(rel(mod), '缺少 title');
  if (m.data.skills != null && !Array.isArray(m.data.skills)) err(rel(mod), 'skills 必须是数组');
  const chapters = files(join(methDir, d)).filter(f => /^\d{2}-.*\.md$/.test(f));
  for (const ch of chapters) { const c = fm(join(methDir, d, ch)); if (c && !c.data.title) warn(rel(join(methDir, d, ch)), '章节没有 title，将用文件名'); }
  const stray = files(join(methDir, d)).filter(f => f.endsWith('.md') && f !== 'module.md' && !/^\d{2}-/.test(f));
  for (const s of stray) warn(rel(join(methDir, d, s)), '没有 NN- 前缀，不会被当作章节读取');
}

// ---------- CHANGELOG ----------
const clPath = join(methDir, 'CHANGELOG.yaml');
const retroDirs = new Set(dirs(C('ai-pm-fieldbook/retros')).filter(n => !n.startsWith('_')));
if (existsSync(clPath)) {
  let entries;
  try { entries = yaml.load(readFileSync(clPath, 'utf-8')); } catch (e) { err(rel(clPath), `YAML 解析失败：${e.message.split('\n')[0]}`); }
  if (entries && !Array.isArray(entries)) err(rel(clPath), '顶层必须是数组');
  const TRIG = ['project', 'reading', 'discussion', 'internal'];
  for (const [i, e] of (Array.isArray(entries) ? entries : []).entries()) {
    const at = `${rel(clPath)} #${i + 1}${e?.version != null ? ` (v${e.version})` : ''}`;
    if (e?.version == null) err(at, '缺少 version');
    else if (typeof e.version !== 'string') err(at, `version 要加引号写成字符串（现在是 ${typeof e.version}：${e.version}）`);
    if (!e?.summary) err(at, '缺少 summary');
    if (!isIntArray(e?.modules)) err(at, 'modules 必须是整数数组，如 [1, 3]');
    else for (const m of e.modules) if (moduleOrders.size && !moduleOrders.has(m)) err(at, `modules 里的 ${m} 不存在对应模块目录`);
    if (e?.trigger != null && !TRIG.includes(e.trigger)) err(at, `trigger 只能是 ${TRIG.join(' | ')}`);
    if (e?.retro != null && !retroDirs.has(String(e.retro))) err(at, `retro "${e.retro}" 在 retros/ 下不存在`);
  }
} else warn(rel(clPath), '不存在，方法论页将没有演化数据');

// ---------- retros ----------
const PITFALL_RE = /^-\s*\*\*\[\s*(?:模块|M)?\s*(\d+|通用)\s*\]\*\*\s*(.+)$/;
for (const d of retroDirs) {
  const base = C(`ai-pm-fieldbook/retros/${d}`);
  const main = join(base, 'retro.md');
  if (!existsSync(main)) { err(rel(base), '缺少 retro.md（目录会被跳过）'); continue; }
  const r = fm(main); if (!r) continue;
  if (!r.data.title) err(rel(main), '缺少 title');
  if (r.data.status != null && !['ongoing', 'closed'].includes(r.data.status)) err(rel(main), 'status 只能是 ongoing | closed');
  if (r.data.affected_modules != null) {
    if (!isIntArray(r.data.affected_modules)) err(rel(main), 'affected_modules 必须是整数数组');
    else for (const m of r.data.affected_modules) if (moduleOrders.size && !moduleOrders.has(m)) err(rel(main), `affected_modules 里的 ${m} 不存在对应模块`);
  }
  if (r.data.updates != null && !Array.isArray(r.data.updates)) err(rel(main), 'updates 必须是数组');
  const chapters = files(base).filter(f => /^\d{2}-.*\.md$/.test(f));
  if (!chapters.length) warn(rel(base), '没有 NN-*.md 章节');
  for (const ch of chapters.filter(f => /pitfall|坑/i.test(f))) {
    const text = fm(join(base, ch))?.content ?? '';
    let n = 0;
    for (const line of text.split('\n')) {
      const t = line.trim();
      if (!t.startsWith('- ')) continue;
      if (PITFALL_RE.test(t)) { n++; const num = t.match(PITFALL_RE)[1]; if (num !== '通用' && moduleOrders.size && !moduleOrders.has(Number(num))) err(rel(join(base, ch)), `坑指向的模块 ${num} 不存在：${t.slice(0, 40)}…`); }
      else if (t.startsWith('- **[')) err(rel(join(base, ch)), `坑的格式不对（应为 "- **[模块N]** 坑 → 原因 → 对策"）：${t.slice(0, 50)}…`);
      else warn(rel(join(base, ch)), `这行不是坑格式，不会进坑库：${t.slice(0, 50)}…`);
    }
    if (n === 0) warn(rel(join(base, ch)), '没有解析出任何坑');
  }
}

// ---------- cases ----------
for (const [kind, required] of [['tastings', ['product', 'company', 'verdict']], ['anatomies', ['company', 'verdict']]]) {
  const base = C(`ai-business-anatomy/cases/${kind}`);
  for (const d of dirs(base)) {
    const main = join(base, d, 'case.md');
    if (!existsSync(main)) { warn(rel(join(base, d)), '缺少 case.md，目录会被跳过'); continue; }
    const c = fm(main); if (!c) continue;
    for (const k of required) if (!c.data[k]) err(rel(main), `缺少 ${k}`);
    for (const k of ['patterns', 'tags']) if (c.data[k] != null && !Array.isArray(c.data[k])) err(rel(main), `${k} 必须是数组`);
    if (!files(join(base, d)).some(f => /^\d{2}-.*\.md$/.test(f))) warn(rel(join(base, d)), '没有 NN-*.md 章节');
  }
}

// ---------- patterns ----------
const patDir = C('ai-design-patterns/patterns');
const EVO_RE = /^\*\*\d{4}-\d{2}(?:-\d{2})?\*\*\s*\[(product-design|ux|tech|market|academic)\]/;
for (const f of files(patDir).filter(f => f.endsWith('.md'))) {
  const p = fm(join(patDir, f)); if (!p) continue;
  const at = rel(join(patDir, f));
  for (const k of ['pattern_name', 'chinese_name', 'status', 'first_seen', 'heat']) if (p.data[k] == null) err(at, `缺少 ${k}`);
  if (p.data.status && !['concept', 'landed', 'evolving', 'converging'].includes(p.data.status)) err(at, 'status 取值非法');
  if (p.data.heat != null && !(Number.isInteger(p.data.heat) && p.data.heat >= 1 && p.data.heat <= 5)) err(at, 'heat 必须是 1–5 的整数');
  for (const h of ['## Definition', '## Implementations', '## Evolution Log']) if (!p.content.includes(h)) warn(at, `缺少 "${h} / …" 段落，站点将退回 prose 直出`);
  const evo = p.content.split(/^## Evolution Log/m)[1]?.split(/^## /m)[0] ?? '';
  for (const line of evo.split('\n')) {
    const t = line.trim().replace(/^- /, '');
    if (t.startsWith('**') && !EVO_RE.test(t)) err(at, `Evolution Log 行格式应为 "- **YYYY-MM** [driver] 文本"：${t.slice(0, 40)}…`);
  }
}

// ---------- notes (站点仓库) ----------
const notesDir = resolve(ROOT, 'content/notes');
for (const f of files(notesDir).filter(f => f.endsWith('.md') && !f.startsWith('_') && f !== 'README.md')) {
  const n = fm(join(notesDir, f)); if (!n) continue;
  if (!n.data.title) err(rel(join(notesDir, f)), '缺少 title');
}

// ---------- report ----------
if (warnings.length) { console.log(`\n⚠ ${warnings.length} 个提醒：`); for (const w of warnings) console.log('  - ' + w); }
if (errors.length) { console.log(`\n✖ ${errors.length} 个格式错误（构建中止）：`); for (const e of errors) console.log('  - ' + e); process.exit(1); }
console.log(`\n✓ 内容格式校验通过（${warnings.length} 个提醒）`);
