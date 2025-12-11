"use client";

import { Timeline } from "@/components/ui/timeline";
import { timelineData } from "./timelineData";

export function BerkahnTimeline() {
  return (
    <div className="timeline-component w-full bg-white">
      <div className="max-w-[1000px] mx-auto py-20 px-4">
        <Timeline data={timelineData} />
      </div>
    </div>
  );
}
