import { Navigate, useLocation } from "react-router-dom";
import { useMe } from "../hooks/auth";
import { LoadingState } from "../components/ui/LoadingState";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const me = useMe();
  const location = useLocation();

  if (me.isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <LoadingState message="Checking session..." />
      </div>
    );
  }

  if (!me.data) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
