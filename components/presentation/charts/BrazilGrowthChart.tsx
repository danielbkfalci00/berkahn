"use client";

import { BRAZIL_MARKET_GROWTH } from "@/lib/global-steel-frame-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const DARK_TOOLTIP_STYLE = {
  background: "rgba(0,0,0,0.9)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "12px",
};

export default function BrazilGrowthChart() {
  return (
    <div className="h-48 sm:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={BRAZIL_MARKET_GROWTH}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="year"
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickFormatter={(v: number) => `R$${v}bi`}
            width={60}
          />
          <Tooltip
            contentStyle={DARK_TOOLTIP_STYLE}
            formatter={(value) => [`R$ ${value ?? 0} bilhões`, "Receita"]}
            labelStyle={{ color: "rgba(255,255,255,0.7)" }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10B981"
            strokeWidth={2.5}
            dot={{ fill: "#10B981", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2, fill: "#000" }}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
