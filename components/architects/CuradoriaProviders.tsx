"use client";

import { ViewTransitions } from "next-view-transitions";
import { MotionConfig } from "motion/react";

interface Props {
  children: React.ReactNode;
}

export function CuradoriaProviders({ children }: Props) {
  return (
    <ViewTransitions>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ViewTransitions>
  );
}
