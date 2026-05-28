"use client";

import { Card } from "@/components/ui/card";
import { Trophy, AlertCircle, Clock, Eye } from "lucide-react";
import { formatTimeMinSec } from "@/lib/analytics/post-performance";
import type { PostPerformance } from "@/types/analytics";

interface PostHeroCardsProps {
  best: PostPerformance | null;
  opportunity: PostPerformance | null;
}

export function PostHeroCards({ best, opportunity }: PostHeroCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BestCard post={best} />
      <OpportunityCard post={opportunity} />
    </div>
  );
}

function BestCard({ post }: { post: PostPerformance | null }) {
  if (!post) {
    return (
      <Card className="p-5 bg-white border-neutral-200 border-l-4 border-l-neutral-200">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
          <Trophy className="h-3.5 w-3.5" strokeWidth={2} />
          <span>Melhor post do mês</span>
        </div>
        <p className="text-sm text-neutral-400">Sem posts elegíveis no período.</p>
      </Card>
    );
  }
  return (
    <Card className="p-5 bg-[#E8F3EC] border-l-4 border-l-[#1F6F3D]">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#1F6F3D] mb-2">
        <Trophy className="h-3.5 w-3.5" strokeWidth={2.25} />
        <span>Melhor post do mês</span>
      </div>
      <h3 className="text-base font-semibold text-neutral-900 leading-snug line-clamp-2 mb-2">
        {post.title}
      </h3>
      <p className="text-xs text-neutral-500 mb-3">{post.category}</p>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-neutral-700">
        <span className="inline-flex items-center gap-1">
          <Eye className="h-3.5 w-3.5 text-neutral-500" />
          <strong className="text-neutral-900 tabular-nums">{post.pageviews}</strong> pageviews
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-neutral-500" />
          <strong className="text-neutral-900 tabular-nums">{formatTimeMinSec(post.avgEngagementTime)}</strong> tempo médio
        </span>
        <span>
          <strong className="text-neutral-900 tabular-nums">{post.retentionPct}%</strong> retenção
        </span>
      </div>
    </Card>
  );
}

function OpportunityCard({ post }: { post: PostPerformance | null }) {
  if (!post) {
    return (
      <Card className="p-5 bg-white border-l-4 border-neutral-200 border-l-neutral-200">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
          <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} />
          <span>Maior oportunidade</span>
        </div>
        <p className="text-sm text-neutral-500">
          Nenhum post com alto tráfego e baixa retenção. Saudável.
        </p>
      </Card>
    );
  }
  return (
    <Card className="p-5 bg-[#FDF4D8] border-l-4 border-l-[#B8801F]">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#B8801F] mb-2">
        <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.25} />
        <span>Maior oportunidade</span>
      </div>
      <h3 className="text-base font-semibold text-neutral-900 leading-snug line-clamp-2 mb-2">
        {post.title}
      </h3>
      <p className="text-xs text-neutral-500 mb-3">{post.category}</p>
      <p className="text-sm text-neutral-700 leading-relaxed">
        Recebe <strong className="text-neutral-900 tabular-nums">{post.pageviews}</strong> pageviews
        mas só <strong className="text-neutral-900 tabular-nums">{post.retentionPct}%</strong> de
        retenção. Revisar abertura, hierarquia e CTAs.
      </p>
    </Card>
  );
}
