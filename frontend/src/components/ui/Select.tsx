import { Listbox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";
import ErrorMessage from "./ErrorMessage";

export type SelectOption = {
  value: string;
  label: string;
};

export function Select({
  label,
  error,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  allowClear = false,
  clearLabel,
  disabled,
  className,
  id,
  name
}: {
  label?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  allowClear?: boolean;
  clearLabel?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}) {
  const inputId = id ?? name;
  const selected = options.find((o) => o.value === value);

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={inputId} className="label-text">
          {label}
        </label>
      ) : null}

      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className={cn("relative", label && "mt-1.5")}>
          <Listbox.Button
            id={inputId}
            className={cn(
              "input-base inline-flex w-full items-center justify-between gap-2 py-2.5 text-left",
              error && "input-error",
              disabled && "cursor-not-allowed opacity-60"
            )}
          >
            <span className={cn("truncate", !selected && "text-muted-foreground")}>
              {selected?.label ?? placeholder}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          </Listbox.Button>

          <Listbox.Options className="absolute z-30 mt-1 max-h-60 w-full origin-top overflow-auto rounded-xl border border-border bg-card p-1 shadow-lg focus:outline-none dark:shadow-black/40">
            {allowClear ? (
              <Listbox.Option
                value=""
                className={({ active, selected: isSelected }) =>
                  cn(
                    "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    active ? "bg-muted text-foreground" : "text-foreground/80",
                    isSelected && "font-semibold text-primary"
                  )
                }
              >
                {({ selected: isSelected }) => (
                  <>
                    <span className="truncate">{clearLabel ?? placeholder}</span>
                    {isSelected ? <Check className="h-4 w-4 shrink-0 text-primary" /> : null}
                  </>
                )}
              </Listbox.Option>
            ) : null}
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active, selected: isSelected }) =>
                  cn(
                    "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    active ? "bg-muted text-foreground" : "text-foreground/80",
                    isSelected && "font-semibold text-primary"
                  )
                }
              >
                {({ selected: isSelected }) => (
                  <>
                    <span className="truncate">{option.label}</span>
                    {isSelected ? <Check className="h-4 w-4 shrink-0 text-primary" /> : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      <ErrorMessage msg={error} />
    </div>
  );
}
