import { useAppSelector } from "../app/hooks";

export function useChartTheme() {
  const isDark = useAppSelector((s) => s.ui.theme) === "dark";

  return {
    isDark,
    grid: isDark ? "#3f3f46" : "#e2e8f0",
    axis: isDark ? "#a1a1aa" : "#94a3b8",
    tooltip: {
      borderRadius: "12px",
      border: isDark ? "1px solid #3f3f46" : "1px solid #e2e8f0",
      backgroundColor: isDark ? "#18181b" : "#ffffff",
      color: isDark ? "#fafafa" : "#0f172a",
      boxShadow: isDark ? "0 8px 24px rgb(0 0 0 / 0.45)" : "0 4px 6px -1px rgb(0 0 0 / 0.1)"
    }
  };
}
