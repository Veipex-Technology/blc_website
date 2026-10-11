import type { Transition, Variants } from "framer-motion";

export const easing = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: easing },
  },
};

export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

export const cardHover = {
  y: -6,
  boxShadow: "0 16px 40px rgba(2, 56, 48, 0.15)",
};

export const hoverTransition: Transition = {
  duration: 0.3,
  ease: easing,
};
