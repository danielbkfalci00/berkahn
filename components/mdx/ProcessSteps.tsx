"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  title: string;
  description?: string;
  duration?: string;
}

interface ProcessStepsProps {
  steps: Step[];
  title?: string;
  variant?: "numbered" | "timeline" | "checklist";
}

export function ProcessSteps({
  steps,
  title,
  variant = "numbered",
}: ProcessStepsProps) {
  if (variant === "timeline") {
    return (
      <div className="my-8">
        {title && (
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            {title}
          </h3>
        )}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-neutral-200" />

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="relative flex gap-6">
                {/* Circle */}
                <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white text-sm font-semibold">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-neutral-900">
                      {step.title}
                    </h4>
                    {step.duration && (
                      <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                        {step.duration}
                      </span>
                    )}
                  </div>
                  {step.description && (
                    <p className="text-sm text-neutral-600 mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "checklist") {
    return (
      <div className="my-8">
        {title && (
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            {title}
          </h3>
        )}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">{step.title}</p>
                {step.description && (
                  <p className="text-sm text-neutral-600 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: numbered
  return (
    <div className="my-8">
      {title && (
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">{title}</h3>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative p-6 bg-white border border-neutral-200 rounded-xl"
          >
            <span className="absolute -top-3 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white text-sm font-semibold">
              {index + 1}
            </span>
            <h4 className="font-semibold text-neutral-900 mt-2">{step.title}</h4>
            {step.description && (
              <p className="text-sm text-neutral-600 mt-2">{step.description}</p>
            )}
            {step.duration && (
              <p className="text-xs text-neutral-400 mt-3">{step.duration}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
