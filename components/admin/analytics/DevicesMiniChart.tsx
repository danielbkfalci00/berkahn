"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { MetricTooltip } from "./MetricTooltip";
import type { Ga4Device } from "@/types/analytics";

interface DevicesMiniChartProps {
  data: Ga4Device[];
}

const DEVICE_COLOR: Record<string, string> = {
  desktop: "#0A0A0A",
  mobile: "#4A4A4A",
  tablet: "#8A8A8A",
};
const FALLBACK_COLOR = "#C5C2BA";

function colorFor(device: string): string {
  return DEVICE_COLOR[device.toLowerCase()] ?? FALLBACK_COLOR;
}

function labelFor(device: string): string {
  const map: Record<string, string> = {
    desktop: "Desktop",
    mobile: "Mobile",
    tablet: "Tablet",
  };
  return map[device.toLowerCase()] ?? device;
}

export function DevicesMiniChart({ data }: DevicesMiniChartProps) {
  const hasData = data.length > 0 && data.some((d) => d.users > 0);

  return (
    <Card className="p-6 bg-white border-neutral-200">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
          Dispositivos
        </h3>
        <MetricTooltip
          content={
            <div className="space-y-1.5">
              <p className="font-semibold text-neutral-900">Distribuição por device</p>
              <p>
                Usuários do GA4 segmentados por desktop, mobile e tablet. Ajuda a calibrar o
                conteúdo e o layout pra audiência real.
              </p>
            </div>
          }
        />
      </div>
      <div
        className="h-72"
        role="img"
        aria-label="Distribuição de usuários por dispositivo (desktop, mobile, tablet)"
      >
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="users"
                nameKey="device"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                isAnimationActive={false}
              >
                {data.map((d, i) => (
                  <Cell
                    key={i}
                    fill={colorFor(d.device)}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E2D9",
                  borderRadius: 6,
                  fontSize: 13,
                }}
                formatter={(value, _name, props) => {
                  const numValue = typeof value === "number" ? value : 0;
                  const payload = (props as unknown as { payload?: Ga4Device }).payload;
                  const pct = payload?.pctOfTotal ?? 0;
                  return [
                    `${numValue.toLocaleString("pt-BR")} usuários (${pct}%)`,
                    labelFor(payload?.device ?? ""),
                  ];
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 13 }}
                formatter={(value) => labelFor(String(value))}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-neutral-500 text-sm">Sem dados de device no período</p>
          </div>
        )}
      </div>
    </Card>
  );
}
