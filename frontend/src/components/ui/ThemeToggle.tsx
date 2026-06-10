import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleTheme } from "../../app/features/ui/uiSlice";
import { applyTheme } from "../../lib/theme";
import { cn } from "../../utils/cn";
import { tapPress } from "../../utils/motion";

type ThemeToggleProps = {
  className?: string;
  compact?: boolean;
};

export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const isDark = theme === "dark";

  const handleToggle = () => {
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    dispatch(toggleTheme());
  };

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileTap={tapPress}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30",
        compact ? "h-9 w-9" : "h-10 gap-2 px-3",
        className
      )}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -30, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
        className="inline-flex"
      >
        {isDark ? <Moon className="h-4 w-4 text-blue-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
      </motion.span>
      {!compact ? (
        <span className="hidden text-sm font-medium sm:inline">{isDark ? "Dark" : "Light"}</span>
      ) : null}
    </motion.button>
  );
}
