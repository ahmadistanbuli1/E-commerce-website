import { Select } from "./Select";

export type CategoryOption = { id: string; name: string };

export function CategorySelect({
  value,
  options,
  onChange,
  placeholder = "All categories"
}: {
  value?: string;
  options: CategoryOption[];
  onChange: (next?: string) => void;
  placeholder?: string;
}) {
  return (
    <Select
      value={value ?? ""}
      onChange={(v) => onChange(v || undefined)}
      options={options.map((o) => ({ value: o.id, label: o.name }))}
      placeholder={placeholder}
      allowClear
      clearLabel={placeholder}
    />
  );
}
