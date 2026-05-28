"use client";

import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MetricTooltipProps {
  content: React.ReactNode;
  className?: string;
  iconSize?: number;
}

/**
 * Ícone (?) com tooltip explicativo. Usado pra explicar conceitos novos
 * (Health Score, Retention, Status de Post, etc) pro time que vai abrir
 * o dashboard sem o Bruno.
 */
export function MetricTooltip({ content, className, iconSize = 13 }: MetricTooltipProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-neutral-200 rounded-full",
              className
            )}
            aria-label="Explicação"
          >
            <HelpCircle size={iconSize} strokeWidth={1.75} />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs bg-white border border-neutral-200 text-neutral-800 shadow-md p-3 text-xs leading-relaxed"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
