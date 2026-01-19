"use client";

import { cn } from "@/lib/utils";
import {
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

type HighlightVariant = "info" | "warning" | "success" | "error" | "tip";

interface HighlightBoxProps {
  children: React.ReactNode;
  variant?: HighlightVariant;
  title?: string;
  icon?: LucideIcon;
}

const variantConfig: Record<
  HighlightVariant,
  {
    icon: LucideIcon;
    className: string;
    iconClassName: string;
    titleClassName: string;
  }
> = {
  info: {
    icon: Info,
    className: "bg-blue-50 border-blue-200",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-900",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-amber-50 border-amber-200",
    iconClassName: "text-amber-500",
    titleClassName: "text-amber-900",
  },
  success: {
    icon: CheckCircle,
    className: "bg-green-50 border-green-200",
    iconClassName: "text-green-500",
    titleClassName: "text-green-900",
  },
  error: {
    icon: XCircle,
    className: "bg-red-50 border-red-200",
    iconClassName: "text-red-500",
    titleClassName: "text-red-900",
  },
  tip: {
    icon: Lightbulb,
    className: "bg-purple-50 border-purple-200",
    iconClassName: "text-purple-500",
    titleClassName: "text-purple-900",
  },
};

const defaultTitles: Record<HighlightVariant, string> = {
  info: "Informação",
  warning: "Atenção",
  success: "Sucesso",
  error: "Erro",
  tip: "Dica",
};

export function HighlightBox({
  children,
  variant = "info",
  title,
  icon,
}: HighlightBoxProps) {
  const config = variantConfig[variant];
  const Icon = icon || config.icon;
  const displayTitle = title || defaultTitles[variant];

  return (
    <div
      className={cn(
        "my-6 rounded-lg border p-4 flex gap-4",
        config.className
      )}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconClassName)} />
      <div className="flex-1 min-w-0">
        <p className={cn("font-semibold text-sm", config.titleClassName)}>
          {displayTitle}
        </p>
        <div className="text-sm text-neutral-700 mt-1">{children}</div>
      </div>
    </div>
  );
}
