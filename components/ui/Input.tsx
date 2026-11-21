import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type FieldProps = {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
  id: string;
};

export function Input({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-text">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={cn(
          "h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-text outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15",
          error ? "border-danger" : "border-border",
        )}
        {...props}
      />
      {error ? <p className="text-xs text-danger">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function Textarea({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-text">
          {label}
        </label>
      ) : null}
      <textarea
        id={id}
        className={cn(
          "min-h-28 w-full rounded-xl border bg-surface px-3.5 py-3 text-sm text-text outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15",
          error ? "border-danger" : "border-border",
        )}
        {...props}
      />
      {error ? <p className="text-xs text-danger">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function Select({
  label,
  error,
  className,
  id,
  children,
  ...props
}: FieldProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-text">
          {label}
        </label>
      ) : null}
      <select
        id={id}
        className={cn(
          "h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15",
          error ? "border-danger" : "border-border",
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
