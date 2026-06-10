import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import ErrorMessage from "./ErrorMessage";

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
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
      <textarea
        id={inputId}
        className={cn("input-base mt-1.5 resize-y", error && "input-error", className)}
        {...props}
      />
      <ErrorMessage msg={error} />
    </div>
  );
}
