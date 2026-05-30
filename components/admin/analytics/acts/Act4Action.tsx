"use client";

import { InsightsList } from "../InsightsList";
import { TaskBoard } from "../TaskBoard";
import { IndexationStatus } from "../IndexationStatus";
import { FallingQueriesPanel } from "../FallingQueriesPanel";
import { narrativeAct4Action } from "@/lib/analytics/narrative";
import { countByStatus, findBestPost } from "@/lib/analytics/post-performance";
import type { AnalyticsTask, PostPerformance, SnapshotContext } from "@/types/analytics";

interface Act4ActionProps {
  context: SnapshotContext;
  posts?: PostPerformance[];
  tasks?: AnalyticsTask[];
}

export function Act4Action({ context, posts = [], tasks = [] }: Act4ActionProps) {
  const counts = countByStatus(posts);
  const best = findBestPost(posts);

  const narrative = narrativeAct4Action(context, {
    bestPostTitle: best?.title ?? null,
    abandonedCount: counts.abandoned,
    coldCount: counts.cold,
  });

  return (
    <section className="space-y-6" aria-labelledby="act-4-title">
      <div>
        <h2 id="act-4-title" className="text-2xl font-bold text-neutral-900 tracking-tight">
          Para onde direcionar esforço
        </h2>
        <p className="text-base text-neutral-600 mt-1">{narrative}</p>
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
        <FallingQueriesPanel queries={context.gsc.fallingQueries} />
      </div>
    </section>
  );
}
