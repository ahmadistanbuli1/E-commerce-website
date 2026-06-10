import { Select } from "../ui/Select";

export function AdminMenuSelect({
  label,
  value,
  options,
  placeholder = "Select an option",
  onChange
}: {
  label?: string;
  value: string;
  options: Array<{ id: string; name: string }>;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      options={options.map((o) => ({ value: o.id, label: o.name }))}
      placeholder={placeholder}
    />
  );
}
