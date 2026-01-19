"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Stat {
  value: string | number;
  label: string;
  suffix?: string;
  prefix?: string;
  description?: string;
  color?: "default" | "green" | "blue" | "amber" | "purple";
}

interface StatsGridProps {
  stats: Stat[];
  columns?: 2 | 3 | 4;
  title?: string;
}

const colorClasses = {
  default: "text-neutral-900",
  green: "text-green-600",
  blue: "text-blue-600",
  amber: "text-amber-600",
  purple: "text-purple-600",
};

export function StatsGrid({ stats, columns = 4, title }: StatsGridProps) {
  return (
    <div className="my-8">
      {title && (
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
      )}
      <div
        className={cn(
          "grid gap-4",
          columns === 2 && "grid-cols-1 sm:grid-cols-2",
          columns === 3 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
          columns === 4 && "grid-cols-2 md:grid-cols-4"
        )}
      >
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 text-center">
            <p
              className={cn(
                "text-3xl font-bold",
                colorClasses[stat.color || "default"]
              )}
            >
              {stat.prefix}
              {stat.value}
              {stat.suffix}
            </p>
            <p className="text-sm font-medium text-neutral-700 mt-1">
              {stat.label}
            </p>
            {stat.description && (
              <p className="text-xs text-neutral-500 mt-2">{stat.description}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
