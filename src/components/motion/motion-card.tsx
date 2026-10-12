"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cardHover, fadeUp, hoverTransition, reducedFade } from "@/lib/motion";

type MotionCardProps = {
  children: ReactNode;
  className?: string;
  withHoverShadow?: boolean;
};

export function MotionCard({
  children,
  className = "",
  withHoverShadow = true,
}: MotionCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      variants={shouldReduceMotion ? reducedFade : fadeUp}
      whileHover={
        shouldReduceMotion
          ? undefined
          : withHoverShadow
            ? cardHover
            : { y: cardHover.y }
      }
      transition={hoverTransition}
      className={className}
    >
      {children}
    </motion.article>
  );
}
