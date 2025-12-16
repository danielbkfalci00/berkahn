"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartData } from "@/types/article";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

interface MarketGrowthChartProps {
  charts: ChartData[];
}

const COLORS = ["#000000", "#666666", "#AAAAAA", "#E0E0E0", "#10B981"];

function renderChart(chart: ChartData) {
  const commonProps = {
    data: chart.data,
    margin: { top: 5, right: 30, left: 0, bottom: 5 },
  };

  switch (chart.type) {
    case "line":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="year"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "8px",
              }}
              formatter={(value: any) => {
                if (typeof value === "number") {
                  return [
                    `US$ ${value.toFixed(2)}B`,
                    "Mercado",
                  ];
                }
                return value;
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#000000"
              strokeWidth={3}
              dot={{ fill: "#000000", r: 5 }}
              activeDot={{ r: 8 }}
              name="Mercado Brasil (US$ B)"
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case "bar":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="region"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
              formatter={(value: any) => `${value}%`}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar
              dataKey="adoption"
              fill="#000000"
              name="Taxa de Adoção (%)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      );

    case "pie":
      return (
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chart.data.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );

    default:
      return null;
  }
}

export function MarketGrowthChart({ charts }: MarketGrowthChartProps) {
  if (!charts || charts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {charts.map((chart, index) => (
        <RevealOnScroll key={chart.id} delay={index * 0.1}>
          <div className="bg-white rounded-lg border border-black-10 p-8 shadow-sm hover:shadow-md transition-shadow">
            {chart.title && (
              <h3 className="headline-sm mb-8 text-center">{chart.title}</h3>
            )}
            <div className="overflow-x-auto">
              {renderChart(chart)}
            </div>
            <p className="body-sm text-black-50 mt-6 text-center">
              Fonte: Análise de mercado 2024-2025
            </p>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
