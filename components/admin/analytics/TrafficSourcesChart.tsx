"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { Ga4Source } from "@/types/analytics";

interface TrafficSourcesChartProps {
  data: Ga4Source[];
}

export function TrafficSourcesChart({ data }: TrafficSourcesChartProps) {
  // Recharts horizontal bar: layout="vertical" + dataKey numeric em XAxis
  const chartData = data.slice(0, 10).map((s) => ({
    name: s.label.length > 30 ? s.label.slice(0, 28) + "…" : s.label,
    sessions: s.sessions,
    users: s.users,
    pct: s.pctOfTotal,
  }));

  return (
    <Card className="p-6 bg-white border-neutral-200">
      <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500 mb-4">
        Top fontes de tráfego
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#E5E2D9" strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              stroke="#8A8A8A"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#E5E2D9" }}
            />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#0A0A0A"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={160}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E2D9",
                borderRadius: 6,
                fontSize: 13,
              }}
              formatter={(value, name, props) => {
                const numValue = typeof value === "number" ? value : 0;
                if (name === "sessions") {
                  const pct = (props as unknown as { payload?: { pct?: number } }).payload?.pct ?? 0;
                  return [`${numValue.toLocaleString("pt-BR")} (${pct}%)`, "Sessions"];
                }
                return [numValue, name as string];
              }}
              cursor={{ fill: "#FAF8F2" }}
            />
            <Bar
              dataKey="sessions"
              fill="#0A0A0A"
              radius={[0, 4, 4, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
