"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import type { Ga4Area } from "@/types/analytics";

interface AreaDistributionChartProps {
  data: Ga4Area[];
}

const COLORS = ["#0A0A0A", "#4A4A4A", "#8A8A8A", "#C5C2BA", "#E5E2D9", "#F4F2EC"];

export function AreaDistributionChart({ data }: AreaDistributionChartProps) {
  return (
    <Card className="p-6 bg-white border-neutral-200">
      <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500 mb-4">
        Tráfego por área do site
      </h3>
      <div
        className="h-72"
        role="img"
        aria-label="Distribuição de pageviews por área do site"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="pageviews"
              nameKey="area"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#FFFFFF" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E2D9",
                borderRadius: 6,
                fontSize: 13,
              }}
              formatter={(value, name, props) => {
                const numValue = typeof value === "number" ? value : 0;
                const pct = (props as unknown as { payload?: Ga4Area }).payload?.pctOfTotal ?? 0;
                return [`${numValue.toLocaleString("pt-BR")} pageviews (${pct}%)`, name as string];
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 13 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
