"use client";

import { Card } from "@/components/ui/card";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonItem {
  label: string;
  steelFrame: string | number | boolean;
  alvenaria: string | number | boolean;
  highlight?: "steelFrame" | "alvenaria" | null;
}

interface ComparisonTableProps {
  title?: string;
  description?: string;
  items: ComparisonItem[];
  steelFrameLabel?: string;
  alvenariaLabel?: string;
}

function renderValue(value: string | number | boolean) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-green-600" />
    ) : (
      <X className="h-5 w-5 text-red-600" />
    );
  }
  if (value === "-" || value === null) {
    return <Minus className="h-5 w-5 text-neutral-400" />;
  }
  return <span>{value}</span>;
}

export function ComparisonTable({
  title = "Comparativo",
  description,
  items,
  steelFrameLabel = "Steel Frame",
  alvenariaLabel = "Alvenaria",
}: ComparisonTableProps) {
  return (
    <Card className="my-8 overflow-hidden">
      {(title || description) && (
        <div className="p-6 border-b border-neutral-200 bg-neutral-50">
          {title && (
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-neutral-600 mt-1">{description}</p>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 bg-neutral-50">
                Critério
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-900 bg-green-50">
                {steelFrameLabel}
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-900 bg-neutral-100">
                {alvenariaLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className="border-b border-neutral-100 last:border-0"
              >
                <td className="px-6 py-4 text-sm text-neutral-700">
                  {item.label}
                </td>
                <td
                  className={cn(
                    "px-6 py-4 text-center text-sm",
                    item.highlight === "steelFrame"
                      ? "bg-green-50 font-semibold text-green-700"
                      : "text-neutral-700"
                  )}
                >
                  <div className="flex justify-center">
                    {renderValue(item.steelFrame)}
                  </div>
                </td>
                <td
                  className={cn(
                    "px-6 py-4 text-center text-sm",
                    item.highlight === "alvenaria"
                      ? "bg-amber-50 font-semibold text-amber-700"
                      : "text-neutral-700"
                  )}
                >
                  <div className="flex justify-center">
                    {renderValue(item.alvenaria)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
