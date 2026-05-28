"use client";

import { InsightsList } from "../InsightsList";
import { ActionsPriority } from "../ActionsPriority";
import { IndexationStatus } from "../IndexationStatus";
import { narrativeAct4Action } from "@/lib/analytics/narrative";
import type { SnapshotContext } from "@/types/analytics";

interface Act4ActionProps {
  context: SnapshotContext;
}

/**
 * ATO 4 — Ação. Insights + priorização P0/P1/P2 + status de indexação.
 */
export function Act4Action({ context }: Act4ActionProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
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
    </section>
  );
}
