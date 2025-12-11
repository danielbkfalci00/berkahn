"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  end: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

export function CountUp({
  end,
  suffix = "",
  className,
  duration = 2000,
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // ease-out-expo
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(end * easeOutExpo));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <p ref={ref} className={className}>
      {count}
      {suffix}
    </p>
  );
}
