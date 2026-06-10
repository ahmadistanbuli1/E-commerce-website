import { QueryClientProvider } from "@tanstack/react-query";

import { Provider as ReduxProvider } from "react-redux";

import { Toaster } from "sonner";

import { store } from "../store";

import { queryClient } from "../../lib/queryClient";



export function AppProviders({ children }: { children: React.ReactNode }) {

  return (

    <ReduxProvider store={store}>

      <QueryClientProvider client={queryClient}>

        {children}

        <Toaster richColors closeButton position="top-right" duration={3500} />

      </QueryClientProvider>

    </ReduxProvider>

  );

}

