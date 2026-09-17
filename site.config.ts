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
