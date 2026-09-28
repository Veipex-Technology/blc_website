import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "whatsapp";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--blc-green-900)] text-white hover:bg-[var(--blc-green-700)] focus-ring-dark",
  secondary:
    "border-2 border-[var(--blc-gold-500)] text-[var(--blc-green-900)] hover:bg-[var(--blc-cream-100)]",
  ghost: "text-[var(--blc-green-900)] hover:bg-[var(--blc-cream-100)]",
  whatsapp:
    "bg-[var(--blc-green-700)] text-white hover:bg-[var(--blc-green-900)] focus-ring-dark",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
