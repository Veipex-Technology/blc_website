import type { HTMLAttributes } from "react";

export function Badge({
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-[var(--blc-gold-300)] px-3 py-1 text-sm font-semibold text-[var(--blc-green-900)] ${className}`}
      {...props}
    />
  );
}
