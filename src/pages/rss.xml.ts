import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async (context) => {
  const patterns = await getCollection('patterns');
  const tastings = await getCollection('tastings');

  const items = [
    ...patterns.map(p => ({
      title: `${p.data.pattern_name} ${p.data.chinese_name}`,
      link: `/patterns/${p.id}/`,
      description: `Pattern · ${p.data.status} · heat ${p.data.heat}`,
      pubDate: new Date(p.data.first_seen + '-01'),
    })),
    ...tastings.map(t => ({
      title: `${t.data.product} 品鉴`,
      link: `/tastings/${t.id}/`,
      description: t.data.verdict,
      pubDate: t.data.analyzed ? new Date(t.data.analyzed) : new Date(),
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'lucyli-lpl',
    description: 'AI PM · 方法论 / 观察 / 工具',
    site: context.site!,
    items,
  });
};
