import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`min-h-11 w-full rounded-xl border border-[var(--blc-sand-200)] bg-white px-4 text-[var(--blc-green-900)] placeholder:text-[var(--blc-green-700)] focus:border-[var(--blc-gold-500)] focus-ring-light ${className}`}
      {...props}
    />
  );
}
