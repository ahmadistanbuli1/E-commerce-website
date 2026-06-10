import { useEffect } from "react";
import { useAppSelector } from "../hooks";
import { applyTheme } from "../../lib/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <>{children}</>;
}
