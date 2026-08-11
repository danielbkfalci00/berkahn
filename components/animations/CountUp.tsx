"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

interface CountUpProps {
  end: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  /** Casas decimais (default 0) */
  decimals?: number;
  /** Tag HTML (default "p"). Use "span" para inline. */
  as?: "p" | "span" | "div";
}

export function CountUp({
  end,
  prefix = "",
  suffix = "",
  className,
  duration = 2000,
  decimals = 0,
  as: Component = "p",
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -100px 0px"  // Só ativa quando elemento está 100px dentro da viewport
  });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // ease-out-expo
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const raw = end * easeOutExpo;
      setCount(decimals > 0 ? parseFloat(raw.toFixed(decimals)) : Math.floor(raw));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration, decimals]);

  return (
    <Component ref={ref} className={className}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : count}
      {suffix}
    </Component>
  );
}
