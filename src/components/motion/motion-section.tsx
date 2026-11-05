"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { fadeUp, reducedFade, stagger } from "@/lib/motion";

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  variant?: "fade" | "stagger";
};

export function MotionSection({
  children,
  className = "",
  variant = "stagger",
}: MotionSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [forceVisible, setForceVisible] = useState(false);
  const variants =
    variant === "fade" ? (shouldReduceMotion ? reducedFade : fadeUp) : stagger;

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const timeout = window.setTimeout(() => setForceVisible(true), 800);

    return () => window.clearTimeout(timeout);
  }, [shouldReduceMotion]);

  return (
    <motion.div
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={forceVisible ? undefined : "visible"}
      animate={
        shouldReduceMotion ? undefined : forceVisible ? "visible" : "hidden"
      }
      viewport={{ once: true, amount: 0.05 }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
