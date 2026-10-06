"use client";

import Image from "next/image";
import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

type HeroMotionProps = {
  children: ReactNode;
};

type HeroTextLayerProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

const HeroBackgroundContext = createContext(false);
const easing = [0.22, 1, 0.36, 1] as const;

export function HeroMotion({ children }: HeroMotionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-7.5%", "7.5%"]);
  const contentReady = backgroundLoaded || shouldReduceMotion === true;

  return (
    <div ref={sectionRef} className="relative isolate overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-[7.5%] inset-x-0 overflow-hidden"
        style={{ y: shouldReduceMotion ? 0 : backgroundY }}
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.12] }}
          transition={{
            duration: 12,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <Image
            src="/images/hero-placeholder.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            onLoad={() => setBackgroundLoaded(true)}
            onError={() => setBackgroundLoaded(true)}
            className="object-cover opacity-[0.12]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(115deg,var(--blc-cream-100)_10%,rgb(242_225_209/0.86)_52%,rgb(227_218_203/0.72))]" />
      </motion.div>

      <HeroBackgroundContext.Provider value={contentReady}>
        {children}
      </HeroBackgroundContext.Provider>
    </div>
  );
}

export function HeroTextLayer({
  children,
  delay = 0,
  className = "",
}: HeroTextLayerProps) {
  const backgroundLoaded = useContext(HeroBackgroundContext);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : { opacity: 0, y: 28, clipPath: "inset(0 0 100% 0)" }
      }
      animate={
        backgroundLoaded || shouldReduceMotion
          ? { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }
          : undefined
      }
      transition={{ duration: 0.8, delay, ease: easing }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
