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
        bottom: 20
      }
    };

    switch (chart.type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis
              dataKey={chart.config?.xAxisKey || "name"}
              tick={{ fill: "#000", fontFamily: "var(--font-manrope)" }}
              stroke="#000"
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
                fill={chart.config?.colors?.[index] || "#000"}
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
              tick={{ fill: "#000", fontFamily: "var(--font-manrope)" }}
              stroke="#000"
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
                stroke={chart.config?.colors?.[index] || "#000"}
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
            {chart.config?.dataKeys?.map((key, index) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={chart.config?.colors?.[index] || "#000"}
                fill={chart.config?.colors?.[index] || "#000"}
                fillOpacity={0.2}
              />
            ))}
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
              cy="50%"
              outerRadius={120}
              label
              animationDuration={800}
            >
              {chart.data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={chart.config?.colors?.[index] || "#000"} />
              ))}
            </Pie>
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
        <h3 className="headline-sm mb-6 text-center">{chart.title}</h3>
      )}
      <div className="h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
