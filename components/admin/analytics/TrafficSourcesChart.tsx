"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";
import { MetricTooltip } from "./MetricTooltip";
import { classifyAiSource, buildAiBreakdown } from "@/lib/analytics/ai-sources";
import type { Ga4Source } from "@/types/analytics";

interface TrafficSourcesChartProps {
  data: Ga4Source[];
}

const AI_COLOR = "#7C3AED";
const DEFAULT_COLOR = "#0A0A0A";

/**
 * BarChart horizontal de top fontes.
 * IAs são CONSOLIDADAS em uma única linha "IAs" (cor roxa) com lista
 * das plataformas detectadas no tooltip. Demais fontes (Google, LinkedIn,
 * direct, etc) ficam separadas como sempre.
 */
export function TrafficSourcesChart({ data }: TrafficSourcesChartProps) {
  // Separa IAs vs não-IAs
  const aiSources = data.filter((s) => classifyAiSource(s.label).isAi);
  const nonAi = data.filter((s) => !classifyAiSource(s.label).isAi);

  const totalSessions = data.reduce((s, src) => s + src.sessions, 0);
  const totalUsers = data.reduce((s, src) => s + src.users, 0);
  const aiBreakdown = buildAiBreakdown(data, totalUsers, totalSessions);

  // Monta dataset consolidado
  const consolidated: Array<{
    name: string;
    sessions: number;
    users: number;
    pct: number;
    isAi: boolean;
    aiList?: string;
  }> = [];

  if (aiSources.length > 0) {
    const aiList = aiBreakdown.byAi.map((a) => `${a.name} (${a.users})`).join(" · ");
    consolidated.push({
      name: `IAs (${aiBreakdown.byAi.length})`,
      sessions: aiBreakdown.totalSessions,
      users: aiBreakdown.totalUsers,
      pct: aiBreakdown.pctOfTotal,
      isAi: true,
      aiList,
    });
  }

  for (const src of nonAi) {
    consolidated.push({
      name: src.label.length > 32 ? src.label.slice(0, 30) + "…" : src.label,
      sessions: src.sessions,
      users: src.users,
      pct: src.pctOfTotal,
      isAi: false,
    });
  }

  // Re-sort por sessions
  consolidated.sort((a, b) => b.sessions - a.sessions);
  const chartData = consolidated.slice(0, 10);

  return (
    <Card className="p-6 bg-white border-neutral-200">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
          Top fontes de tráfego
        </h3>
        <MetricTooltip
          content={
            <div className="space-y-1.5">
              <p className="font-semibold text-neutral-900">IAs consolidadas</p>
              <p>
                ChatGPT, Claude, Perplexity, Gemini, Copilot e outras aparecem agrupadas em uma
                única linha &quot;IAs&quot; na cor roxa. Passe o mouse pra ver a lista detalhada.
              </p>
              <p className="text-neutral-600 pt-1">
                Tráfego &quot;direct&quot; pode incluir clicks de apps mobile (LinkedIn, Instagram)
                que não passam referrer. Use UTM nos links pra capturar com precisão.
              </p>
            </div>
          }
        />
      </div>
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
                const payload = (props as unknown as {
                  payload?: { pct?: number; isAi?: boolean; aiList?: string };
                }).payload;
                if (name === "sessions") {
                  const pct = payload?.pct ?? 0;
                  return [`${numValue.toLocaleString("pt-BR")} (${pct}%)`, "Sessions"];
                }
                return [numValue, name as string];
              }}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload as { isAi?: boolean; aiList?: string };
                if (item?.isAi && item?.aiList) {
                  return `${label}\n${item.aiList}`;
                }
                return label;
              }}
              cursor={{ fill: "#FAF8F2" }}
            />
            <Bar dataKey="sessions" radius={[0, 4, 4, 0]} isAnimationActive={false}>
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.isAi ? AI_COLOR : DEFAULT_COLOR} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {aiSources.length > 0 && (
        <p className="text-xs text-neutral-500 mt-3">
          IAs consolidadas: {aiBreakdown.byAi.map((a) => `${a.name} ${a.users}`).join(" · ")}
        </p>
      )}
    </Card>
  );
}
