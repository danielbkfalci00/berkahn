"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Comparison3DMatrix as Comparison3DMatrixType } from "@/types/article";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Comparison3DMatrixProps {
  matrix: Comparison3DMatrixType;
  className?: string;
}

// Default color palette if not specified
const DEFAULT_COLORS = [
  "#18181b", // zinc-900 (Steel Frame)
  "#52525b", // zinc-600 (Alvenaria)
  "#a1a1aa", // zinc-400 (Madeira)
  "#10B981", // green-500 (option 4)
  "#3B82F6", // blue-500 (option 5)
];

export function Comparison3DMatrix({
  matrix,
  className = "",
}: Comparison3DMatrixProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Transform data for Recharts RadarChart
  // Each dimension becomes a data point with scores for each option
  const chartData = matrix.dimensions.map((dimension, index) => {
    const dataPoint: any = {
      dimension,
    };

    matrix.options.forEach((option) => {
      dataPoint[option.name] = option.scores[index] || 0;
    });

    return dataPoint;
  });

  const maxScore = matrix.maxScore || 10;

  return (
    <motion.div
      ref={ref}
      className={`bg-white rounded-lg shadow-luxury-md overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Title */}
      <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-4 border-b border-black-10">
        <h3 className="headline-sm mb-2">{matrix.title}</h3>
        {matrix.description && (
          <p className="text-sm text-black-60">{matrix.description}</p>
        )}
      </div>

      {/* Chart */}
      <div className="px-4 md:px-6 lg:px-8 py-6">
        <div className="h-[400px] md:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{
                  fill: "#000",
                  fontFamily: "var(--font-manrope)",
                  fontSize: isMobile ? 11 : 13,
                }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, maxScore]}
                tick={{
                  fill: "#6b7280",
                  fontSize: 11,
                }}
                tickCount={6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRadius: "8px",
                  border: "none",
                  fontFamily: "var(--font-manrope)",
                  fontSize: "14px",
                }}
                formatter={(value: number | undefined) => [
                  value !== undefined ? `${value}/${maxScore}` : "0",
                  "",
                ]}
              />
              {matrix.showLegend !== false && (
                <Legend
                  wrapperStyle={{
                    fontFamily: "var(--font-manrope)",
                    fontSize: "14px",
                    paddingTop: "20px",
                  }}
                  iconType="circle"
                />
              )}
              {matrix.options.map((option, index) => {
                const color =
                  option.color ||
                  DEFAULT_COLORS[index % DEFAULT_COLORS.length];
                return (
                  <Radar
                    key={option.name}
                    name={option.name}
                    dataKey={option.name}
                    stroke={color}
                    fill={color}
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                );
              })}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Descriptions */}
        {matrix.options.some((opt) => opt.description) && (
          <div className="mt-6 space-y-3">
            {matrix.options.map((option, index) => {
              if (!option.description) return null;

              const color =
                option.color ||
                DEFAULT_COLORS[index % DEFAULT_COLORS.length];

              return (
                <div key={option.name} className="flex items-start gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <h4 className="font-heading font-semibold text-sm mb-1">
                      {option.name}
                    </h4>
                    <p className="text-sm text-black-70 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Score Legend */}
        <div className="mt-6 pt-4 border-t border-black-10">
          <p className="text-xs text-black-50 text-center">
            Escala de avaliação: 0 (mínimo) - {maxScore} (máximo) para cada dimensão
          </p>
        </div>
      </div>
    </motion.div>
  );
}
