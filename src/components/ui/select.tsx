import type { SelectHTMLAttributes } from "react";

export function Select({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`min-h-11 w-full rounded-xl border border-[var(--blc-sand-200)] bg-white px-4 text-[var(--blc-green-900)] focus:border-[var(--blc-gold-500)] focus-ring-light ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
