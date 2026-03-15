"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { ChartData } from "@/types/article";

// Custom tick component: rotated on mobile, word-wrapped on desktop
function CustomXAxisTick({ x, y, payload, isMobile }: any) {
  const label = payload.value as string;

  // Mobile: rotate labels -45° to prevent overlap
  if (isMobile) {
    return (
      <text x={x} y={y + 8} textAnchor="end" fill="#000"
            fontFamily="var(--font-manrope)" fontSize={9}
            transform={`rotate(-45, ${x}, ${y + 8})`}>
        {label}
      </text>
    );
  }

  // Desktop: word-wrap into multiple lines
  const maxCharsPerLine = 20;
  const words = label.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxCharsPerLine && currentLine) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    }
  }
  if (currentLine) lines.push(currentLine.trim());

  return (
    <text x={x} y={y + 12} textAnchor="middle" fill="#000"
          fontFamily="var(--font-manrope)" fontSize={11}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 14}>{line}</tspan>
      ))}
    </text>
  );
}

// Default color palette for charts (grayscale + accents)
// Provides graceful fallback when colors aren't specified
const DEFAULT_COLORS = [
  "#18181b", // zinc-900 (darkest)
  "#52525b", // zinc-600
  "#a1a1aa", // zinc-400
  "#d4d4d8", // zinc-300
  "#e5e5e7", // zinc-200 (lightest)
  "#10B981", // green-500 (accent)
  "#3B82F6", // blue-500 (accent)
  "#F59E0B"  // amber-500 (accent)
];

interface ChartSectionProps {
  chart: ChartData;
  className?: string;
}

export function ChartSection({ chart, className = "" }: ChartSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderChart = () => {
    const commonProps = {
      data: chart.data,
      margin: {
        top: 20,
        right: isMobile ? 10 : 30,
        left: isMobile ? 0 : 20,
        bottom: 5
      }
    };

    switch (chart.type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis
              dataKey={chart.config?.xAxisKey || "name"}
              tick={<CustomXAxisTick isMobile={isMobile} />}
              stroke="#000"
              interval={0}
              height={isMobile ? 80 : 50}
            />
            <YAxis tick={{ fill: "#000" }} stroke="#000" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
                fontFamily: "var(--font-manrope)"
              }}
            />
            <Legend wrapperStyle={{ fontFamily: "var(--font-manrope)" }} />
            {chart.config?.dataKeys?.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={
                  chart.config?.colors?.[index] ||
                  DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                }
                animationDuration={800}
              />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis
              dataKey={chart.config?.xAxisKey || "name"}
              tick={<CustomXAxisTick isMobile={isMobile} />}
              stroke="#000"
              interval={0}
              height={isMobile ? 80 : 50}
            />
            <YAxis tick={{ fill: "#000" }} stroke="#000" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
                fontFamily: "var(--font-manrope)"
              }}
            />
            <Legend wrapperStyle={{ fontFamily: "var(--font-manrope)" }} />
            {chart.config?.dataKeys?.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={
                  chart.config?.colors?.[index] ||
                  DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                }
                strokeWidth={2}
                animationDuration={800}
              />
            ))}
          </LineChart>
        );

      case 'radar':
        return (
          <RadarChart {...commonProps}>
            <PolarGrid stroke="rgba(0,0,0,0.2)" />
            <PolarAngleAxis
              dataKey="criterio"
              tick={{ fill: "#000", fontFamily: "var(--font-manrope)" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#000" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
                fontFamily: "var(--font-manrope)"
              }}
            />
            <Legend wrapperStyle={{ fontFamily: "var(--font-manrope)" }} />
            {chart.config?.dataKeys?.map((key, index) => {
              const color = chart.config?.colors?.[index] ||
                DEFAULT_COLORS[index % DEFAULT_COLORS.length];
              return (
                <Radar
                  key={key}
                  name={key}
                  dataKey={key}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2}
                />
              );
            })}
          </RadarChart>
        );

      case 'pie':
        return (
          <PieChart {...commonProps}>
            <Pie
              data={chart.data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy={isMobile ? "45%" : "50%"}
              outerRadius={isMobile ? 80 : 120}
              label={!isMobile} // Disable labels on mobile to avoid overlap
              labelLine={!isMobile}
              animationDuration={800}
              activeShape={false}
            >
              {chart.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    // 1. Try config.colors array (preferred format)
                    chart.config?.colors?.[index] ||
                    // 2. Try data[].fill property (legacy format)
                    entry.fill ||
                    // 3. Fallback to default color palette
                    DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                  }
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
                fontFamily: "var(--font-manrope)",
                fontSize: isMobile ? "12px" : "14px"
              }}
            />
            <Legend
              wrapperStyle={{
                fontFamily: "var(--font-manrope)",
                fontSize: isMobile ? "11px" : "14px",
                paddingTop: isMobile ? "10px" : "0"
              }}
              layout={isMobile ? "horizontal" : "vertical"}
              align={isMobile ? "center" : "right"}
              verticalAlign={isMobile ? "bottom" : "middle"}
              iconSize={isMobile ? 8 : 10}
            />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`bg-white rounded-lg shadow-luxury-md p-4 md:p-6 lg:p-8 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      {chart.title && (
        <h3 className="headline-sm mb-4 md:mb-6 text-center text-sm md:text-base">{chart.title}</h3>
      )}
      <div className="h-[350px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Accessible table fallback for crawlers and screen readers */}
      {chart.data && chart.data.length > 0 && (
        <div className="sr-only">
          <table>
            {chart.title && <caption>{chart.title}</caption>}
            <thead>
              <tr>
                {Object.keys(chart.data[0]).filter(k => k !== 'fill').map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.data.map((row: Record<string, unknown>, i: number) => (
                <tr key={i}>
                  {Object.entries(row).filter(([k]) => k !== 'fill').map(([k, v]) => (
                    <td key={k}>{String(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
