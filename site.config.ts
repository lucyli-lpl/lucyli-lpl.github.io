export const siteTitle = 'lucyli-lpl';
export const siteDescription = 'AI PM · 方法论 / 观察 / 技能箱';
export const siteTagline = '把学习和实践沉淀为方法。';
export const githubUser = 'lucyli-lpl';
export const githubSite = 'https://github.com/lucyli-lpl/lucyli-lpl.github.io';

export const nav = [
  { label: '方法论', href: '/methodology/' },
  { label: '复盘', href: '/retros/' },
  { label: '观察', href: '/observations/' },
  { label: '技能箱', href: '/skills/' },
  { label: '视觉库', href: '/presets/' },
  { label: '笔记', href: '/notes/' },
  { label: '关于', href: '/about/' },
] as const;

/** 首页研究板：五张档案便签（固定配置，不依赖数量统计） */
export const archiveNotes = [
  { key: 'methodology', title: '方法论', sub: 'Methodology', desc: '把 AI 的模糊能力规定成清晰的产品承诺。八个模块，持续修订。', href: '/methodology/', icon: 'book' },
  { key: 'observations', title: '观察', sub: 'Observations', desc: '追踪设计模式的演化，拆解具体产品与公司。', href: '/observations/', icon: 'eye' },
  { key: 'skills', title: '技能箱', sub: 'Skills', desc: '可直接调用的认知模块：品鉴、追踪、拆解。', href: '/skills/', icon: 'drawer' },
  { key: 'presets', title: '视觉库', sub: 'Visual Library', desc: '输出用的视觉预设与样本页。', href: '/presets/', icon: 'swatch' },
  { key: 'notes', title: '笔记', sub: '慢，就是快', desc: '随手记下的想法与碎片，慢慢沉淀。', href: '/notes/', icon: 'pen' },
] as const;

/** 首页「正在沉淀」：最多 3 条长期主题，只有标题 + 一句话问题 */
export const currentFocus = [
  { title: '能力边界方法论', question: '怎样把 AI 的模糊能力，规定成产品敢说出口的承诺？' },
  { title: '复盘反哺方法', question: '真实项目里踩的坑，如何反向修订方法论的下一个版本？' },
  { title: 'AI 产品设计模式', question: '同一种能力，不同产品为什么做出了不同的取舍？' },
] as const;

/** 首页「精选内容」：1 主 + 最多 2 次，人工策展 */
export const featuredEntries = [
  {
    kicker: '方法论 · 模块 01',
    title: '能力三区 = 三种产品承诺',
    summary: '核心区保证结果，边缘区保证处理，界外区保证边界——三区依据产品承诺，不依据模型表现。这是整套方法论的地基。',
    href: '/methodology/01-three-zones/',
    image: '/content/methodology/01-three-zones/diagram.svg',
    imageAlt: '能力三区示意图',
  },
  {
    kicker: 'Pattern 追踪',
    title: 'Teach-by-Demonstration 录屏示教',
    summary: '用户示范一次工作流，agent 转化为可重放的 skill。四家实现、七个演化事件。',
    href: '/patterns/teach-by-demonstration/',
  },
  {
    kicker: '项目复盘',
    title: 'AI 项目实战心得',
    summary: '两个企业 agent 项目的六条心得：反例与兜底、检索选型、边界知识、多模态、提速、等待态。八个坑，对应五个模块。',
    href: '/retros/2026-09-enterprise-agent-insights/',
  },
] as const;

export const registry = {
  methodology: { kind: 'modules',  nav: '方法论', path: '/methodology', label: '方法论' },
  retros:      { kind: 'cases',    nav: '复盘',   path: '/retros',      label: '项目复盘' },
  patterns:    { kind: 'articles', nav: '观察',   path: '/patterns',    label: 'pattern 追踪', listStyle: 'rows' as const },
  tastings:    { kind: 'cases',    nav: '观察',   path: '/tastings',    label: '产品品鉴' },
  anatomies:   { kind: 'cases',    nav: '观察',   path: '/anatomies',   label: '公司拆解' },
  skills:      { kind: 'skills',   nav: '技能箱', path: '/skills',      label: '技能箱' },
  presets:     { kind: 'presets',  nav: '视觉库', path: '/presets',     label: '视觉库' },
  notes:       { kind: 'articles', nav: '笔记',   path: '/notes',       label: '笔记' },
} as const;

export const skillMeta: Record<string, { repo: string; module?: string; display: string }> = {
  'ai-product-tasting': { repo: 'ai-business-anatomy', module: '03', display: 'AI 产品品鉴' },
  'ipo-archaeology':    { repo: 'ai-business-anatomy', display: '招股书考古' },
  'auto-analysis':      { repo: 'ai-business-anatomy', display: '自动分析' },
  'pattern-tracker':    { repo: 'ai-design-patterns', display: 'pattern 追踪' },
  'visual-library':     { repo: 'ai-design-patterns', display: '视觉库' },
};

export const repos = [
  'ai-design-patterns',
  'ai-business-anatomy',
  'ai-pm-fieldbook',
] as const;
