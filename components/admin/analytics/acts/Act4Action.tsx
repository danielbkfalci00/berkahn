"use client";

import { InsightsList } from "../InsightsList";
import { ActionsPriority } from "../ActionsPriority";
import { IndexationStatus } from "../IndexationStatus";
import { FallingQueriesPanel } from "../FallingQueriesPanel";
import { narrativeAct4Action } from "@/lib/analytics/narrative";
import type { SnapshotContext } from "@/types/analytics";

interface Act4ActionProps {
  context: SnapshotContext;
}

export function Act4Action({ context }: Act4ActionProps) {
  return (
    <section className="space-y-6" aria-labelledby="act-4-title">
      <div>
        <h2 id="act-4-title" className="text-2xl font-bold text-neutral-900 tracking-tight">
          Para onde direcionar esforço
        </h2>
        <p className="text-base text-neutral-600 mt-1">{narrativeAct4Action(context)}</p>
      </div>
      <InsightsList insights={context.insights} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionsPriority
          p0={context.actionsP0}
          p1={context.actionsP1}
          p2={context.actionsP2}
        />
        <IndexationStatus indexation={context.indexation} />
      </div>
      <FallingQueriesPanel queries={context.gsc.fallingQueries} />
    </section>
  );
}
