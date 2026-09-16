export interface TimelineNode {
  date: string;
  driver?: string;
  text: string;
}

const LOG_RE = /^\*\*(\d{4}-\d{2}(?:-\d{2})?)\*\*\s*\[?(product-design|ux|tech|market|academic)?\]?\s*(.*)$/;

export function parseEvolutionLog(markdown: string): { nodes: TimelineNode[]; remaining: string[] } {
  const nodes: TimelineNode[] = [];
  const remaining: string[] = [];

  const logSection = markdown.split(/^## Evolution Log/m)[1];
  if (!logSection) return { nodes, remaining };

  const content = logSection.split(/^## /m)[0];
  const lines = content.trim().split('\n');

  for (const line of lines) {
    const trimmed = line.replace(/^- /, '').trim();
    if (!trimmed) continue;

    const match = trimmed.match(LOG_RE);
    if (match) {
      nodes.push({
        date: match[1],
        driver: match[2] || undefined,
        text: match[3].replace(/^[-–—]\s*/, ''),
      });
    } else if (trimmed.startsWith('|') || trimmed.startsWith('-')) {
      continue;
    } else {
      remaining.push(trimmed);
    }
  }

  return { nodes, remaining };
}
