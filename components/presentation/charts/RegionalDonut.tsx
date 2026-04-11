"use client";

import { REGIONAL_SHARES } from "@/lib/global-steel-frame-data";
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

export default function RegionalDonut() {
  return (
    <div>
      <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={REGIONAL_SHARES}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="90%"
              dataKey="value"
              stroke="rgba(0,0,0,0.5)"
              strokeWidth={2}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {REGIONAL_SHARES.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={DARK_TOOLTIP_STYLE}
              formatter={(value) => [`${value ?? 0}%`, "Participação"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {REGIONAL_SHARES.map((share) => (
          <div key={share.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: share.color }}
            />
            <span className="text-white/60">{share.name}</span>
            <span className="text-white/80 font-medium ml-auto">{share.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
