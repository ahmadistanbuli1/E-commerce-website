import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../config/api";
import { toastSuccess, toastError, getErrorMessage } from "../lib/toast";
import type { Product } from "../interfaces/catalog";

export type WishlistItem = {
  id: string;
  createdAt: string;
  product: Product;
};

export function useWishlist(enabled = true) {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await api.get<{ items: WishlistItem[] }>("/wishlist");
      return data.items;
    },
    enabled,
    retry: false
  });
}

export function useAddToWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      await api.post(`/wishlist/${productId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      toastSuccess("Added to wishlist");
    },
    onError: (error) => toastError(getErrorMessage(error, "Failed to add to wishlist"))
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/wishlist/${productId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      toastSuccess("Removed from wishlist");
    },
    onError: (error) => toastError(getErrorMessage(error, "Failed to remove from wishlist"))
  });
}
