"use client";

import { PostHeroCards } from "../PostHeroCards";
import { PostPerformanceTable } from "../PostPerformanceTable";
import { narrativeAct3Posts } from "@/lib/analytics/narrative";
import {
  countByStatus,
  findBestPost,
  findOpportunityPost,
} from "@/lib/analytics/post-performance";
import type { PostPerformance, SnapshotContext } from "@/types/analytics";

interface Act3PostsProps {
  context: SnapshotContext;
  posts: PostPerformance[];
}

/**
 * ATO 3 — Performance de Posts.
 * Hero cards (melhor + oportunidade) + tabela filtrável.
 * Foco: time entende qual conteúdo performou, qual abandonou.
 */
export function Act3Posts({ context, posts }: Act3PostsProps) {
  const best = findBestPost(posts);
  const opportunity = findOpportunityPost(posts);
  const counts = countByStatus(posts);

  const narrative = narrativeAct3Posts(context, {
    bestPost: best
      ? {
          title: best.title,
          pageviews: best.pageviews,
          retentionPct: best.retentionPct,
        }
      : null,
    risingCount: counts.rising,
    coldCount: counts.cold,
    engagedCount: counts.engaged,
    abandonedCount: counts.abandoned,
  });

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
          O que está performando
        </h2>
        <p className="text-base text-neutral-600 mt-1">{narrative}</p>
      </div>

      <PostHeroCards best={best} opportunity={opportunity} />
      <PostPerformanceTable posts={posts} />
    </section>
  );
}
