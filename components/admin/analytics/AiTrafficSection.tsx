"use client";

import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import type { AiSourceBreakdown } from "@/lib/analytics/ai-sources";

interface AiTrafficSectionProps {
  breakdown: AiSourceBreakdown;
  totalSessions: number;
}

const AI_COLORS: Record<string, string> = {
  ChatGPT: "#10A37F",   // OpenAI green
  Claude: "#D97757",    // Anthropic terracotta
  Perplexity: "#1A8FA8",
  Gemini: "#4796E3",
  Copilot: "#0078D4",
  "You.com": "#5C6FF7",
  Phind: "#7C3AED",
  "Meta AI": "#0866FF",
  Grok: "#0A0A0A",
  default: "#4A4A4A",
};

export function AiTrafficSection({ breakdown, totalSessions }: AiTrafficSectionProps) {
  if (breakdown.byAi.length === 0) {
    return (
      <Card className="p-6 bg-white border-neutral-200">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-neutral-500" strokeWidth={1.75} />
          <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
            Tráfego vindo de IAs
          </h3>
        </div>
        <p className="text-sm text-neutral-500">
          Nenhuma fonte de IA detectada no período (ChatGPT, Claude, Perplexity, Gemini, Copilot, etc).
        </p>
      </Card>
    );
  }

  const chartData = breakdown.byAi.map((ai) => ({
    name: ai.name,
    users: ai.users,
    sessions: ai.sessions,
    pct: ai.pctOfTotal,
    fill: AI_COLORS[ai.name] ?? AI_COLORS.default,
  }));

  return (
    <Card className="p-6 bg-white border-neutral-200">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-neutral-500" strokeWidth={1.75} />
          <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
            Tráfego vindo de IAs
          </h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-neutral-900 tabular-nums leading-none">
            {breakdown.totalUsers}
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            {breakdown.pctOfTotal}% das sessões
          </div>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#0A0A0A"
              fontSize={13}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E2D9",
                borderRadius: 6,
                fontSize: 13,
              }}
              cursor={{ fill: "#FAF8F2" }}
              formatter={(value, name, props) => {
                const numValue = typeof value === "number" ? value : 0;
                const pct = (props as unknown as { payload?: { pct?: number } }).payload?.pct ?? 0;
                if (name === "users") {
                  return [`${numValue} users (${pct}%)`, "Tráfego"];
                }
                return [numValue, name as string];
              }}
            />
            <Bar dataKey="users" radius={[0, 4, 4, 0]} isAnimationActive={false}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="users"
                position="right"
                fontSize={13}
                fill="#0A0A0A"
                fontWeight={600}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
        Inclui clicks vindos de respostas geradas pelas IAs (com link de fonte para berkahn.com.br) ou de
        compartilhamento de conversas. Sinal de AEO funcionando.
      </p>
    </Card>
  );
}
