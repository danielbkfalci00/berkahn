"use client";

import { BRAZIL_CONSTRUCTION_MIX } from "@/lib/global-steel-frame-data";
import {
  PieChart,
  Pie,
  Cell,
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

export default function BrazilMixDonut() {
  return (
    <div className="flex items-center justify-center gap-6">
      <div className="w-36 h-36 sm:w-44 sm:h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={BRAZIL_CONSTRUCTION_MIX}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="88%"
              dataKey="value"
              stroke="rgba(0,0,0,0.5)"
              strokeWidth={2}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {BRAZIL_CONSTRUCTION_MIX.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={DARK_TOOLTIP_STYLE}
              formatter={(value) => [`${value ?? 0}%`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2">
        {BRAZIL_CONSTRUCTION_MIX.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-white/60">{item.name}</span>
            <span className="text-white/80 font-medium ml-2">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
