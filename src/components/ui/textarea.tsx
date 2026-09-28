import type { TextareaHTMLAttributes } from "react";

export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-32 w-full rounded-xl border border-[var(--blc-sand-200)] bg-white p-4 text-[var(--blc-green-900)] placeholder:text-[var(--blc-green-700)] focus:border-[var(--blc-gold-500)] focus-ring-light ${className}`}
      {...props}
    />
  );
}
