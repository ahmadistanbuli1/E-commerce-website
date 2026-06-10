import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "../config/api";

import { toastSuccess, toastError, getErrorMessage } from "../lib/toast";

import { useMe } from "./auth";



export type OrderItem = {

  id: string;

  price: string;

  quantity: number;

  product: { id: string; name: string; imageUrl: string };

};



export type Order = {

  id: string;

  totalPrice: string;

  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

  paymentMethod: string;

  shippingAddress: string;

  adminMessage?: string | null;

  createdAt: string;

  items?: OrderItem[];

};



export function useCheckout() {

  const qc = useQueryClient();

  return useMutation({

    mutationFn: async (input: { paymentMethod: string; shippingAddress: string }) => {

      const { data } = await api.post<{ order: Order }>("/orders", input);

      return data.order;

    },

    onSuccess: () => {

      qc.invalidateQueries({ queryKey: ["cart"] });

      qc.invalidateQueries({ queryKey: ["orders", "my"] });

      toastSuccess("Order placed successfully!");

    },

    onError: (error) => toastError(getErrorMessage(error, "Checkout failed"))

  });

}



export function useMyOrders() {

  const me = useMe();



  return useQuery({

    queryKey: ["orders", "my"],

    queryFn: async () => {

      const { data } = await api.get<{ orders: Order[] }>("/orders/my-orders");

      return data.orders;

    },

    enabled: !!me.data && !me.isError,

    retry: false

  });

}

