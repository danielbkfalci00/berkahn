"use client";

import { InsightsList } from "../InsightsList";
import { TaskBoard } from "../TaskBoard";
import { IndexationStatus } from "../IndexationStatus";
import { FallingQueriesPanel } from "../FallingQueriesPanel";
import { ConversionEvents } from "../ConversionEvents";
import { FunilLeads } from "../FunilLeads";
import { narrativeAct4Action } from "@/lib/analytics/narrative";
import { comparisonAvailability } from "@/lib/analytics/comparability";
import { countByStatus, findBestPost } from "@/lib/analytics/post-performance";
import type { FunilLeads as Funil } from "@/lib/analytics/leads-funnel";
import type { AdminDataResult, AnalyticsTask, PostPerformance, SnapshotContext } from "@/types/analytics";

interface Act4ActionProps {
  context: SnapshotContext;
  posts?: PostPerformance[];
  tasks?: AnalyticsTask[];
  funilLeads: AdminDataResult<Funil>;
}

export function Act4Action({ context, posts = [], tasks = [], funilLeads }: Act4ActionProps) {
  const counts = countByStatus(posts);
  const best = findBestPost(posts);
  const comparability = comparisonAvailability(context);

  const narrative = narrativeAct4Action(context, {
    bestPostTitle: best?.title ?? null,
    abandonedCount: counts.abandoned,
    coldCount: counts.cold,
  });

  return (
    <section className="space-y-6" aria-labelledby="act-4-title">
      <div>
        <h2 id="act-4-title" className="text-xl font-bold text-neutral-900 tracking-tight sm:text-2xl">
          Para onde direcionar esforço
        </h2>
        <p className="mt-1 text-sm text-neutral-600 sm:text-base">{narrative}</p>
      </div>
      <InsightsList insights={context.insights} />
      <TaskBoard
        tasks={tasks}
        systemActions={{
          p0: context.actionsP0,
          p1: context.actionsP1,
          p2: context.actionsP2,
        }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IndexationStatus indexation={context.indexation} />
        <FallingQueriesPanel
          queries={context.gsc.fallingQueries}
          unavailableReason={
            comparability.gscMoM
              ? undefined
              : context.sources?.gsc.comparisonReason ?? comparability.reason ?? "baseline ausente"
          }
        />
      </div>
      <ConversionEvents
        events={context.ga4.events ?? []}
        monthSlug={context.monthSlug}
      />
      <FunilLeads funil={funilLeads} monthSlug={context.monthSlug} />
    </section>
  );
}
