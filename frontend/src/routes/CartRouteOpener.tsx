import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { setCartOpen } from "../app/features/ui/uiSlice";

export function CartRouteOpener() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setCartOpen(true));
  }, [dispatch]);
  return <Navigate to="/products" replace />;
}

