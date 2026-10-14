import { forwardRef, useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-[var(--radius)] border border-line-strong bg-surface px-4 text-fg placeholder:text-fg-subtle transition-[border-color,box-shadow] duration-200 hover:border-fg/50 focus:border-fg focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-fg/15 aria-[invalid=true]:border-[#b3261e] aria-[invalid=true]:ring-[#b3261e]/15 disabled:opacity-50";

type FieldShellProps = {
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
  className?: string;
  optionalLabel?: boolean;
};

export function FieldShell({
  label,
  error,
  hint,
  required,
  children,
  className,
  optionalLabel,
}: FieldShellProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[0.8125rem] font-semibold tracking-[0.01em] text-fg">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-fg-subtle">
            *
          </span>
        ) : optionalLabel ? (
          <span className="ml-1.5 font-normal text-fg-subtle">(opcional)</span>
        ) : null}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error ? (
        <p id={hintId} className="text-[0.8125rem] text-fg-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errId}
          role="alert"
          className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-[#b3261e] [.theme-dark_&]:text-[#ffb4ab]"
        >
          <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8 4.5v4.2M8 10.8v.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = ComponentProps<"input"> & {
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  optionalLabel?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, required, optionalLabel, ...rest },
  ref,
) {
  return (
    <FieldShell
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
      optionalLabel={optionalLabel}
    >
      {({ id, describedBy, invalid }) => (
        <input
          ref={ref}
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          className={cn(control, "h-12")}
          {...rest}
        />
      )}
    </FieldShell>
  );
});

type TextareaProps = ComponentProps<"textarea"> & {
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  optionalLabel?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, required, rows = 4, optionalLabel, ...rest },
  ref,
) {
  return (
    <FieldShell
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
      optionalLabel={optionalLabel}
    >
      {({ id, describedBy, invalid }) => (
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          className={cn(control, "resize-y py-3 leading-relaxed")}
          {...rest}
        />
      )}
    </FieldShell>
  );
});

type SelectProps = ComponentProps<"select"> & {
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  optionalLabel?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, className, required, children, optionalLabel, ...rest },
  ref,
) {
  return (
    <FieldShell
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
      optionalLabel={optionalLabel}
    >
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            aria-required={required || undefined}
            className={cn(control, "h-12 appearance-none pr-10")}
            {...rest}
          >
            {children}
          </select>
          <svg
            viewBox="0 0 16 16"
            className="pointer-events-none absolute top-1/2 right-4 size-3.5 -translate-y-1/2 text-fg-muted"
            aria-hidden="true"
          >
            <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      )}
    </FieldShell>
  );
});

type CheckboxProps = Omit<ComponentProps<"input">, "type"> & { label: ReactNode; error?: string };

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, error, className, id: idProp, required, ...rest },
  ref,
) {
  const auto = useId();
  const id = idProp ?? auto;
  const errId = error ? `${id}-err` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="group/cb flex cursor-pointer items-start gap-3 text-[0.875rem] leading-snug text-fg-muted"
      >
        <span className="relative mt-0.5 inline-flex size-5 shrink-0">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={errId}
            aria-required={required || undefined}
            className="peer absolute inset-0 size-5 cursor-pointer appearance-none rounded-[3px] border border-line-strong bg-surface transition-colors checked:border-fg checked:bg-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg aria-[invalid=true]:border-[#b3261e]"
            {...rest}
          />
          <svg
            viewBox="0 0 16 16"
            className="pointer-events-none absolute inset-0 m-auto size-3.5 text-bg opacity-0 transition-opacity peer-checked:opacity-100"
            aria-hidden="true"
          >
            <path
              d="M3.5 8.5l3 3 6-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span>{label}</span>
      </label>
      {error ? (
        <p
          id={errId}
          role="alert"
          className="pl-8 text-[0.8125rem] font-medium text-[#b3261e] [.theme-dark_&]:text-[#ffb4ab]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
});
