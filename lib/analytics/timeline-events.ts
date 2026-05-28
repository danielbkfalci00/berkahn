import type { PostMeta, TrendPoint } from "@/types/analytics";

export interface TimelinePostRef {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
}

export interface TimelineEvent {
  monthSlug: string;
  monthLabel: string;
  posts: TimelinePostRef[];
}

export function buildTimelineEvents(
  postsMap: Map<string, PostMeta>,
  trendPoints: TrendPoint[]
): TimelineEvent[] {
  const monthLabelBySlug = new Map<string, string>();
  for (const tp of trendPoints) {
    monthLabelBySlug.set(tp.monthSlug, tp.monthLabel);
  }

  const grouped = new Map<string, TimelinePostRef[]>();

  for (const meta of postsMap.values()) {
    if (!meta.publishedAt) continue;
    const monthSlug = meta.publishedAt.slice(0, 7);
    if (!monthLabelBySlug.has(monthSlug)) continue;

    const list = grouped.get(monthSlug) ?? [];
    list.push({
      slug: meta.slug,
      title: meta.title,
      category: meta.category,
      publishedAt: meta.publishedAt,
    });
    grouped.set(monthSlug, list);
  }

  const events: TimelineEvent[] = [];
  for (const [monthSlug, posts] of grouped) {
    posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
    events.push({
      monthSlug,
      monthLabel: monthLabelBySlug.get(monthSlug)!,
      posts,
    });
  }

  events.sort((a, b) => (a.monthSlug < b.monthSlug ? -1 : 1));
  return events;
}
