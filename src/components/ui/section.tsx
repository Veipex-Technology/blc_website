import type { HTMLAttributes } from "react";

type SectionVariant = "white" | "cream" | "sand" | "dark";
const backgrounds: Record<SectionVariant, string> = {
  white: "bg-white",
  cream: "bg-[var(--blc-cream-100)]",
  sand: "bg-[var(--blc-sand-200)]",
  dark: "bg-[var(--blc-green-900)] text-white",
};

export function Section({
  variant = "white",
  className = "",
  ...props
}: HTMLAttributes<HTMLElement> & { variant?: SectionVariant }) {
  return (
    <section
      className={`py-16 lg:py-24 ${backgrounds[variant]} ${className}`}
      {...props}
    />
  );
}
