"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ConstructionTimeline } from "@/types/article";
import { Timeline } from "@/components/ui/timeline";

interface TimelineSectionProps {
  timeline: ConstructionTimeline;
  className?: string;
}

export function TimelineSection({
  timeline,
  className = "",
}: TimelineSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Convert ProcessStep[] to Timeline format
  const timelineData = timeline.milestones.map((milestone) => ({
    title: milestone.shortTitle || milestone.title,
    content: (
      <div className="space-y-3">
        {milestone.shortTitle && (
          <h4 className="text-lg font-heading font-semibold">
            {milestone.title}
          </h4>
        )}
        <p className="text-black-70 leading-relaxed">{milestone.description}</p>
        {milestone.duration && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black-5 rounded-md">
            <svg
              className="w-4 h-4 text-black-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-black-70">
              {milestone.duration}
            </span>
          </div>
        )}
      </div>
    ),
  }));

  return (
    <motion.div
      ref={ref}
      className={`bg-white rounded-lg shadow-luxury-md overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Header */}
      {(timeline.title || timeline.totalDuration) && (
        <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-4 border-b border-black-10">
          {timeline.title && (
            <h3 className="headline-sm mb-2">{timeline.title}</h3>
          )}
          {timeline.totalDuration && (
            <div className="flex items-center gap-2 text-black-60">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium">
                Duração total: {timeline.totalDuration}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="py-8">
        <Timeline data={timelineData} titleClassName="md:pl-20 md:text-2xl lg:text-3xl" />
      </div>

      {/* Progress Footer (Optional) */}
      {timeline.showProgress && (
        <div className="px-4 md:px-6 lg:px-8 pb-6 pt-4 border-t border-black-10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-black-60">Progresso</span>
            <span className="font-medium text-black">
              {timeline.milestones.length} fases identificadas
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
