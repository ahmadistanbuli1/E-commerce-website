import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "../store";
import { queryClient } from "../../lib/queryClient";
import { ThemeProvider } from "./ThemeProvider";
import { useAppSelector } from "../hooks";

function ThemedToaster() {
  const theme = useAppSelector((s) => s.ui.theme);
  return <Toaster richColors closeButton position="top-right" duration={3500} theme={theme} />;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
          <ThemedToaster />
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

