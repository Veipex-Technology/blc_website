"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { easing, heroStagger, reducedFade, fadeUp } from "@/lib/motion";

type MotionHeroProps = {
  children: ReactNode;
  className?: string;
  dir?: "ltr" | "rtl";
};

export function MotionHero({
  children,
  className = "",
  dir = "ltr",
}: MotionHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const itemVariants = shouldReduceMotion ? reducedFade : fadeUp;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      variants={heroStagger}
      className={className}
    >
      {Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
      <motion.span
        aria-hidden="true"
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.48, ease: easing }}
        className={`mt-8 block h-px w-20 bg-[var(--blc-gold-500)] ${dir === "rtl" ? "origin-right" : "origin-left"}`}
      />
    </motion.div>
  );
}
