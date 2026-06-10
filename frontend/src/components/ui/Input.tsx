import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import ErrorMessage from "./ErrorMessage";

export function Input({
  label,
  error,
  className,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  const inputId = id ?? props.name;

  return (
    <div>
      {label ? (
        <label htmlFor={inputId} className="label-text">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cn("input-base mt-1.5", error && "input-error", className)}
        {...props}
      />
      <ErrorMessage msg={error} />
    </div>
  );
}
