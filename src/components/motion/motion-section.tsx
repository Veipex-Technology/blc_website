"use client";

import type { ReactNode } from "react";
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
  const variants =
    variant === "fade" ? (shouldReduceMotion ? reducedFade : fadeUp) : stagger;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
