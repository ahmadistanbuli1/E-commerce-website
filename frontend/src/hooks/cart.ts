import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "../config/api";

import { toastSuccess, toastError, getErrorMessage } from "../lib/toast";

import type { Cart } from "../interfaces/cart";



export function useCart(enabled = true) {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get<{ cart: Cart | null }>("/cart");
      return data.cart;
    },
    enabled,
    retry: false
  });
}



export function useAddToCart() {

  const qc = useQueryClient();

  return useMutation({

    mutationFn: async (input: { productId: string; quantity: number }) => {

      const { data } = await api.post<{ cart: Cart | null }>("/cart/items", input);

      return data.cart;

    },

    onSuccess: (cart) => {

      qc.setQueryData(["cart"], cart);

      toastSuccess("Added to cart");

    },

    onError: (error) => toastError(getErrorMessage(error, "Failed to add to cart"))

  });

}



export function useUpdateCartItem() {

  const qc = useQueryClient();

  return useMutation({

    mutationFn: async (input: { itemId: string; quantity: number }) => {

      const { data } = await api.put<{ cart: Cart | null }>(`/cart/items/${input.itemId}`, {

        quantity: input.quantity

      });

      return data.cart;

    },

    onSuccess: (cart) => {

      qc.setQueryData(["cart"], cart);

      toastSuccess("Cart updated");

    },

    onError: (error) => toastError(getErrorMessage(error, "Failed to update cart"))

  });

}



export function useRemoveCartItem() {

  const qc = useQueryClient();

  return useMutation({

    mutationFn: async (itemId: string) => {

      const { data } = await api.delete<{ cart: Cart | null }>(`/cart/items/${itemId}`);

      return data.cart;

    },

    onSuccess: (cart) => {

      qc.setQueryData(["cart"], cart);

      toastSuccess("Item removed from cart");

    },

    onError: (error) => toastError(getErrorMessage(error, "Failed to remove item"))

  });

}



export function useClearCart() {

  const qc = useQueryClient();

  return useMutation({

    mutationFn: async () => {

      const { data } = await api.delete<{ cart: Cart | null }>("/cart");

      return data.cart;

    },

    onSuccess: (cart) => {

      qc.setQueryData(["cart"], cart);

      toastSuccess("Cart cleared");

    },

    onError: (error) => toastError(getErrorMessage(error, "Failed to clear cart"))

  });

}

