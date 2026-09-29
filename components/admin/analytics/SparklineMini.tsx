"use client";

interface SparklineMiniProps {
  data: number[];
  height?: number;
  color?: string;
  className?: string;
}

/**
 * Mini-gráfico de linha sem eixos, sem grid, sem tooltip.
 * Mostra tendência em ~60px de altura. Reutilizável em KpiCard, tabelas, etc.
 */
export function SparklineMini({
  data,
  height = 40,
  color = "#0A0A0A",
  className,
}: SparklineMiniProps) {
  const values = data?.filter(Number.isFinite) ?? [];
  if (values.length === 0) {
    return <div className={className} style={{ height }} />;
  }
  // Este gráfico não tem eixos, interação ou animação. SVG evita carregar o
  // motor de gráficos inteiro na primeira aba e em cada célula da tabela.
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) => {
    const x = values.length === 1 ? 50 : 2 + (index / (values.length - 1)) * 96;
    const y = max === min ? 20 : 38 - ((value - min) / (max - min)) * 36;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg className={className} width="100%" height={height} viewBox="0 0 100 40" preserveAspectRatio="none" role="img" aria-label={`Tendência: ${values[0]} a ${values[values.length - 1]}`}>
      {values.length === 1 ? <circle cx="50" cy="20" r="1.5" fill={color} /> :
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />}
    </svg>
  );
}
