/** Evolution Log 的驱动力类型（见 ai-design-patterns/DATA_SCHEMA.md） */
export const DRIVER_META: Record<string, { label: string }> = {
  'product-design': { label: '产品设计' },
  'tech':           { label: '技术' },
  'market':         { label: '市场' },
  'academic':       { label: '学术' },
  'ux':             { label: '体验' },
};

export interface StripEvent { date: string; driver?: string; text: string }
export interface StripRow { label: string; sub?: string; href?: string; events: StripEvent[] }
