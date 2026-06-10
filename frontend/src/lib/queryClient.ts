import { QueryClient } from "@tanstack/react-query";
import { setCsrfToken } from "./csrf";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

export function clearAuthSession() {
  setCsrfToken(null);
  queryClient.setQueryData(["me"], undefined);
  queryClient.removeQueries({ queryKey: ["me"] });
  queryClient.removeQueries({ queryKey: ["cart"] });
  queryClient.removeQueries({ queryKey: ["wishlist"] });
  queryClient.removeQueries({ queryKey: ["orders"] });
  queryClient.removeQueries({ queryKey: ["admin"] });
}
