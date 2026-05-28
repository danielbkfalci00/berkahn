"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface SparklineMiniProps {
  data: number[];
  height?: number;
  color?: string;
  className?: string;
}

/**
 * Mini-gráfico de linha sem eixos, sem grid, sem tooltip.
 * Mostra tendência em ~60px de altura. Reutilizável em KpiCard, tabelas, etc.
 */
export function SparklineMini({
  data,
  height = 40,
  color = "#0A0A0A",
  className,
}: SparklineMiniProps) {
  if (!data || data.length === 0) {
    return <div className={className} style={{ height }} />;
  }
  const chartData = data.map((v, i) => ({ idx: i, value: v }));
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
