"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { TrendPoint } from "@/types/analytics";
import type { TimelineEvent } from "@/lib/analytics/timeline-events";

interface GrowthChartProps {
  data: TrendPoint[];
  events?: TimelineEvent[];
}

interface GrowthTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey?: string; name?: string; value?: number; color?: string }>;
  label?: string;
  events?: TimelineEvent[];
}

function formatDayMonth(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

/**
 * Ponto de mês parcial fica oco e tracejado. O ponto NÃO é removido de
 * propósito: esconder o mês corrente faria a pessoa procurá-lo no gráfico.
 * Marcá-lo avisa que a queda visual é artefato de janela, não de desempenho.
 */
function partialAwareDot(color: string) {
  return function Dot({ cx, cy, payload }: { cx?: number; cy?: number; payload?: TrendPoint }) {
    if (cx == null || cy == null) return <g />;
    if (!payload?.partial) return <circle cx={cx} cy={cy} r={4} fill={color} />;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="#FFFFFF"
        stroke={color}
        strokeWidth={2}
        strokeDasharray="2 1.5"
      />
    );
  };
}

function GrowthTooltip({ active, payload, label, events }: GrowthTooltipProps) {
  if (!active || !payload?.length) return null;

  const event = events?.find((e) => e.monthLabel === label);

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E2D9",
        borderRadius: 6,
        fontSize: 13,
        padding: "8px 12px",
        maxWidth: 280,
      }}
    >
      <p className="font-medium text-neutral-900 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey ?? p.name} className="text-neutral-700" style={{ color: p.color }}>
          {p.name}: <span className="tabular-nums">{(p.value ?? 0).toLocaleString("pt-BR")}</span>
        </p>
      ))}
      {event && event.posts.length > 0 && (
        <div className="mt-2 pt-2 border-t border-neutral-200">
          <p className="text-xs uppercase tracking-wider text-[#7C3AED] font-medium mb-1">
            Publicados nesse mês
          </p>
          <ul className="space-y-1">
            {event.posts.map((p) => (
              <li key={p.slug} className="text-xs text-neutral-700">
                <span className="text-neutral-400 tabular-nums">{formatDayMonth(p.publishedAt)}</span>{" "}
                <span className="text-neutral-900">{p.title}</span>
                <span className="text-neutral-500"> · {p.category}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function GrowthChart({ data, events = [] }: GrowthChartProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6 bg-white border-neutral-200">
        <p className="text-neutral-500 text-sm">Sem dados históricos ainda.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-neutral-200">
      <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500 mb-1">
        Evolução mensal — usuários e cliques
      </h3>
      {events.length > 0 && (
        <p className="text-xs text-neutral-500 mb-5">
          <span
            aria-hidden="true"
            className="inline-block w-3 border-t border-dashed mr-1 align-middle"
            style={{ borderColor: "#7C3AED" }}
          />
          linhas verticais roxas indicam meses com publicações (hover pra ver os posts)
        </p>
      )}
      {events.length === 0 && <div className="mb-6" />}
      <div className="h-72" role="img" aria-label="Evolução mensal de usuários (GA4) e cliques (GSC)">
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
              content={<GrowthTooltip events={events} />}
              cursor={{ stroke: "#C5C2BA", strokeDasharray: "3 3" }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 13, paddingBottom: 12 }}
            />
            {events.map((e) => (
              <ReferenceLine
                key={e.monthSlug}
                x={e.monthLabel}
                stroke="#7C3AED"
                strokeWidth={1}
                strokeDasharray="3 3"
                yAxisId="left"
                ifOverflow="extendDomain"
              />
            ))}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="users"
              name="Usuários (GA4)"
              stroke="#0A0A0A"
              strokeWidth={2}
              dot={partialAwareDot("#0A0A0A")}
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
              dot={partialAwareDot("#8A8A8A")}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {data.some((d) => d.partial) && (
        <p className="mt-3 text-xs text-amber-700">
          O último ponto (círculo vazado) é de um mês ainda aberto: cobre menos dias que os
          anteriores, então a queda é artefato da janela, não do desempenho.
        </p>
      )}
    </Card>
  );
}
