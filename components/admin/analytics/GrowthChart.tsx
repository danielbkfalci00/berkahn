"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { TrendPoint } from "@/types/analytics";

interface GrowthChartProps {
  data: TrendPoint[];
}

/**
 * LineChart com 2 séries (Users GA4 + Clicks GSC) e eixos duplos.
 * Mostra todos os pontos disponíveis (cresce com o tempo).
 */
export function GrowthChart({ data }: GrowthChartProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6 bg-white border-neutral-200">
        <p className="text-neutral-500 text-sm">Sem dados históricos ainda.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-neutral-200">
      <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500 mb-6">
        Evolução mensal — usuários e cliques
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#E5E2D9" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="monthLabel"
              stroke="#8A8A8A"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#E5E2D9" }}
            />
            <YAxis
              yAxisId="left"
              stroke="#0A0A0A"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#8A8A8A"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E2D9",
                borderRadius: 6,
                fontSize: 13,
              }}
              cursor={{ stroke: "#C5C2BA", strokeDasharray: "3 3" }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 13, paddingBottom: 12 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="users"
              name="Usuários (GA4)"
              stroke="#0A0A0A"
              strokeWidth={2}
              dot={{ fill: "#0A0A0A", r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="clicks"
              name="Cliques (GSC)"
              stroke="#8A8A8A"
              strokeWidth={2}
              dot={{ fill: "#8A8A8A", r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
