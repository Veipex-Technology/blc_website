import type { InputHTMLAttributes } from "react";

export function Checkbox({
  label,
  error,
  id,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const errorId = error && id ? `${id}-error` : undefined;
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="flex items-start gap-3 text-start">
        <input
          id={id}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={`mt-1 size-4 rounded border-[var(--blc-sand-200)] accent-[var(--blc-green-900)] focus-ring-light ${className}`}
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-[var(--blc-green-900)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
